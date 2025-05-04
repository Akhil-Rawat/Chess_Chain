// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

/**
 * @title ChessGame
 * @dev A smart contract for managing chess games with wagering functionality
 */
contract ChessGame {
    // Game status enum
    enum GameStatus {
        Waiting,
        InProgress,
        Completed
    }

    // Game result enum
    enum GameResult {
        None,
        WhiteWins,
        BlackWins,
        Draw
    }

    // Game struct to store game data
    struct Game {
        uint256 id;
        address whitePlayer;
        address blackPlayer;
        uint256 wagerAmount;
        uint256 timeControl;
        GameStatus status;
        string fen;
        bool drawOffered;
        address currentTurn;
        uint256 lastMoveTime;
        GameResult result;
    }

    // Move struct to store move data
    struct Move {
        uint256 gameId;
        address player;
        string moveNotation;
        uint256 timestamp;
    }

    // Game counter
    uint256 private gameCounter;
    
    // Mapping from game ID to Game struct
    mapping(uint256 => Game) public games;
    
    // Mapping from game ID to array of moves
    mapping(uint256 => Move[]) public gameMoves;

    // Events
    event GameCreated(uint256 indexed gameId, address indexed creator, uint256 wagerAmount);
    event GameJoined(uint256 indexed gameId, address indexed player);
    event MoveMade(uint256 indexed gameId, address indexed player, string move);
    event DrawOffered(uint256 indexed gameId, address indexed player);
    event DrawAccepted(uint256 indexed gameId);
    event GameResigned(uint256 indexed gameId, address indexed player);
    event GameCompleted(uint256 indexed gameId, GameResult result, address winner);
    event WagerPaid(uint256 indexed gameId, address indexed recipient, uint256 amount);

    /**
     * @dev Creates a new chess game with a wager
     * @param timeControl Time control in minutes
     * @return Game ID
     */
    function createGame(uint256 timeControl) external payable returns (uint256) {
        require(msg.value > 0, "Wager amount must be greater than 0");
        
        uint256 gameId = ++gameCounter;
        
        games[gameId] = Game({
            id: gameId,
            whitePlayer: msg.sender,
            blackPlayer: address(0),
            wagerAmount: msg.value,
            timeControl: timeControl,
            status: GameStatus.Waiting,
            fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", // Initial position
            drawOffered: false,
            currentTurn: msg.sender, // White starts
            lastMoveTime: block.timestamp,
            result: GameResult.None
        });
        
        emit GameCreated(gameId, msg.sender, msg.value);
        
        return gameId;
    }

    /**
     * @dev Allows a player to join a game
     * @param gameId Game ID to join
     */
    function joinGame(uint256 gameId) external payable {
        Game storage game = games[gameId];
        
        require(game.id > 0, "Game does not exist");
        require(game.status == GameStatus.Waiting, "Game is not in waiting state");
        require(game.whitePlayer != msg.sender, "Cannot play against yourself");
        require(msg.value == game.wagerAmount, "Wager amount does not match");
        
        game.blackPlayer = msg.sender;
        game.status = GameStatus.InProgress;
        
        emit GameJoined(gameId, msg.sender);
    }

    /**
     * @dev Makes a move in the chess game
     * @param gameId Game ID
     * @param move Chess move in algebraic notation (e.g., "e2e4")
     */
    function makeMove(uint256 gameId, string memory move) external {
        Game storage game = games[gameId];
        
        require(game.id > 0, "Game does not exist");
        require(game.status == GameStatus.InProgress, "Game is not in progress");
        require(
            msg.sender == game.whitePlayer || msg.sender == game.blackPlayer,
            "Not a player in this game"
        );
        require(msg.sender == game.currentTurn, "Not your turn");
        
        // Reset draw offer after a move
        game.drawOffered = false;
        
        // Create and store the move
        Move memory newMove = Move({
            gameId: gameId,
            player: msg.sender,
            moveNotation: move,
            timestamp: block.timestamp
        });
        
        gameMoves[gameId].push(newMove);
        
        // Update current turn
        game.currentTurn = (msg.sender == game.whitePlayer) ? game.blackPlayer : game.whitePlayer;
        game.lastMoveTime = block.timestamp;
        
        // Note: FEN is updated off-chain by oracle or backend
        
        emit MoveMade(gameId, msg.sender, move);
    }

    /**
     * @dev Updates the FEN string for a game (called by trusted oracle/backend)
     * @param gameId Game ID
     * @param fen New FEN string
     */
    function updateFen(uint256 gameId, string memory fen) external {
        // In a production environment, this would be restricted to a trusted oracle
        // For simplicity, we're allowing anyone to update it in this example
        Game storage game = games[gameId];
        
        require(game.id > 0, "Game does not exist");
        require(game.status == GameStatus.InProgress, "Game is not in progress");
        
        game.fen = fen;
    }

    /**
     * @dev Resigns from a game, giving the win to the opponent
     * @param gameId Game ID
     */
    function resignGame(uint256 gameId) external {
        Game storage game = games[gameId];
        
        require(game.id > 0, "Game does not exist");
        require(game.status == GameStatus.InProgress, "Game is not in progress");
        require(
            msg.sender == game.whitePlayer || msg.sender == game.blackPlayer,
            "Not a player in this game"
        );
        
        address winner;
        if (msg.sender == game.whitePlayer) {
            game.result = GameResult.BlackWins;
            winner = game.blackPlayer;
        } else {
            game.result = GameResult.WhiteWins;
            winner = game.whitePlayer;
        }
        
        game.status = GameStatus.Completed;
        
        // Pay out to winner
        uint256 wagerAmount = game.wagerAmount * 2;
        payable(winner).transfer(wagerAmount);
        
        emit GameResigned(gameId, msg.sender);
        emit GameCompleted(gameId, game.result, winner);
        emit WagerPaid(gameId, winner, wagerAmount);
    }

    /**
     * @dev Offers a draw to the opponent
     * @param gameId Game ID
     */
    function offerDraw(uint256 gameId) external {
        Game storage game = games[gameId];
        
        require(game.id > 0, "Game does not exist");
        require(game.status == GameStatus.InProgress, "Game is not in progress");
        require(
            msg.sender == game.whitePlayer || msg.sender == game.blackPlayer,
            "Not a player in this game"
        );
        
        game.drawOffered = true;
        
        emit DrawOffered(gameId, msg.sender);
    }

    /**
     * @dev Accepts a draw offer
     * @param gameId Game ID
     */
    function acceptDraw(uint256 gameId) external {
        Game storage game = games[gameId];
        
        require(game.id > 0, "Game does not exist");
        require(game.status == GameStatus.InProgress, "Game is not in progress");
        require(
            msg.sender == game.whitePlayer || msg.sender == game.blackPlayer,
            "Not a player in this game"
        );
        require(game.drawOffered, "No draw offered");
        require(
            (msg.sender == game.whitePlayer && game.currentTurn == game.whitePlayer) ||
            (msg.sender == game.blackPlayer && game.currentTurn == game.blackPlayer),
            "Only the current player can accept a draw"
        );
        
        game.status = GameStatus.Completed;
        game.result = GameResult.Draw;
        
        // Refund both players
        uint256 refundAmount = game.wagerAmount;
        payable(game.whitePlayer).transfer(refundAmount);
        payable(game.blackPlayer).transfer(refundAmount);
        
        emit DrawAccepted(gameId);
        emit GameCompleted(gameId, GameResult.Draw, address(0));
    }

    /**
     * @dev Claims victory when opponent's time has run out
     * @param gameId Game ID
     */
    function claimVictoryByTime(uint256 gameId) external {
        Game storage game = games[gameId];
        
        require(game.id > 0, "Game does not exist");
        require(game.status == GameStatus.InProgress, "Game is not in progress");
        require(
            msg.sender == game.whitePlayer || msg.sender == game.blackPlayer,
            "Not a player in this game"
        );
        require(msg.sender != game.currentTurn, "Cannot claim victory on your turn");
        
        // Time in seconds for the time control (minutes * 60)
        uint256 timeLimit = game.timeControl * 60;
        
        // Check if time has elapsed since the last move
        require(
            block.timestamp > game.lastMoveTime + timeLimit,
            "Time limit has not been exceeded"
        );
        
        address winner = msg.sender;
        game.status = GameStatus.Completed;
        
        if (winner == game.whitePlayer) {
            game.result = GameResult.WhiteWins;
        } else {
            game.result = GameResult.BlackWins;
        }
        
        // Pay out to winner
        uint256 wagerAmount = game.wagerAmount * 2;
        payable(winner).transfer(wagerAmount);
        
        emit GameCompleted(gameId, game.result, winner);
        emit WagerPaid(gameId, winner, wagerAmount);
    }

    /**
     * @dev Gets the current state of a game
     * @param gameId Game ID
     * @return Game status, white player, black player, wager amount, FEN string, draw offered flag, last move time
     */
    function getGameState(uint256 gameId) external view returns (
        GameStatus, 
        address,
        address,
        uint256,
        string memory,
        bool,
        uint256
    ) {
        Game storage game = games[gameId];
        
        require(game.id > 0, "Game does not exist");
        
        return (
            game.status,
            game.whitePlayer,
            game.blackPlayer,
            game.wagerAmount,
            game.fen,
            game.drawOffered,
            game.lastMoveTime
        );
    }

    /**
     * @dev Gets the move history for a game
     * @param gameId Game ID
     * @return Array of moves
     */
    function getMoveHistory(uint256 gameId) external view returns (Move[] memory) {
        return gameMoves[gameId];
    }
}
