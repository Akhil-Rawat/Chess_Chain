// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

/**
 * @title ChessGame - Enhanced Smart Contract
 * @dev Production-ready chess gaming contract with wagering
 * @author ChessChain Team
 */
contract ChessGame {
    // Game status enum
    enum GameStatus { Waiting, InProgress, Completed, Cancelled }
    
    // Game result enum
    enum GameResult {
        None, WhiteWins, BlackWins, Draw,
        WhiteWinsByTime, BlackWinsByTime,
        WhiteWinsByResignation, BlackWinsByResignation
    }

    // Game struct
    struct Game {
        uint256 id;
        address whitePlayer;
        address blackPlayer;
        uint256 wagerAmount;
        uint256 timeControl;
        uint256 increment;
        GameStatus status;
        string fen;
        bool whiteDrawOffered;
        bool blackDrawOffered;
        address currentTurn;
        uint256 whiteTimeRemaining;
        uint256 blackTimeRemaining;
        uint256 lastMoveTime;
        GameResult result;
        address winner;
        uint256 createdAt;
        bool isRated;
    }

    // Player statistics
    struct PlayerStats {
        uint256 gamesPlayed;
        uint256 gamesWon;
        uint256 gamesLost;
        uint256 gamesDrawn;
        uint256 totalWagered;
        uint256 totalWinnings;
        uint256 rating;
        bool isRegistered;
    }

    // State variables
    uint256 private gameCounter;
    uint256 public totalGamesCreated;
    uint256 public totalValueLocked;
    uint256 public platformFeesCollected;
    address public owner;
    
    // Constants
    uint256 public constant INITIAL_RATING = 1200;
    uint256 public constant MIN_WAGER = 0.001 ether;
    uint256 public constant MAX_WAGER = 100 ether;
    uint256 public constant PLATFORM_FEE_BASIS_POINTS = 250; // 2.5%
    uint256 public constant TIME_BUFFER = 300; // 5 minutes buffer for time claims
    
    // Mappings
    mapping(uint256 => Game) public games;
    mapping(address => PlayerStats) public playerStats;
    mapping(address => uint256[]) public playerGames;
    mapping(uint256 => bool) public gameExists;
    
    // Events
    event GameCreated(uint256 indexed gameId, address indexed creator, uint256 wagerAmount);
    event GameJoined(uint256 indexed gameId, address indexed whitePlayer, address indexed blackPlayer);
    event MoveMade(uint256 indexed gameId, address indexed player, string move);
    event GameCompleted(uint256 indexed gameId, GameResult result, address indexed winner, uint256 winnings);
    event DrawOffered(uint256 indexed gameId, address indexed player);
    event DrawAccepted(uint256 indexed gameId);
    event PlayerRegistered(address indexed player, uint256 initialRating);
    event FundsWithdrawn(address indexed owner, uint256 amount);

    // Modifiers
    modifier gameExists_(uint256 gameId) {
        require(gameExists[gameId], "Game does not exist");
        _;
    }
    
    modifier onlyGamePlayer(uint256 gameId) {
        Game memory game = games[gameId];
        require(msg.sender == game.whitePlayer || msg.sender == game.blackPlayer, "Not a game player");
        _;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    constructor() {
        gameCounter = 0;
        totalGamesCreated = 0;
        totalValueLocked = 0;
        platformFeesCollected = 0;
        owner = msg.sender;
    }

    /**
     * @dev Register a new player
     */
    function registerPlayer() external {
        require(!playerStats[msg.sender].isRegistered, "Already registered");
        
        playerStats[msg.sender] = PlayerStats({
            gamesPlayed: 0,
            gamesWon: 0,
            gamesLost: 0,
            gamesDrawn: 0,
            totalWagered: 0,
            totalWinnings: 0,
            rating: INITIAL_RATING,
            isRegistered: true
        });
        
        emit PlayerRegistered(msg.sender, INITIAL_RATING);
    }

    /**
     * @dev Create a new game
     */
    function createGame(uint256 timeControl, uint256 increment, bool isRated, bool preferWhite)
        external payable
    {
        require(msg.value >= MIN_WAGER && msg.value <= MAX_WAGER, "Invalid wager amount");
        require(timeControl >= 60 && timeControl <= 7200, "Time control must be between 1-120 minutes");
        require(increment <= 60, "Increment cannot exceed 60 seconds");
        
        if (isRated) {
            require(playerStats[msg.sender].isRegistered, "Must register for rated games");
        }

        gameCounter++;
        uint256 gameId = gameCounter;
        
        // Assign color based on preference or random
        address whitePlayer = preferWhite ? msg.sender : address(0);
        address blackPlayer = preferWhite ? address(0) : msg.sender;
        
        games[gameId] = Game({
            id: gameId,
            whitePlayer: whitePlayer,
            blackPlayer: blackPlayer,
            wagerAmount: msg.value,
            timeControl: timeControl,
            increment: increment,
            status: GameStatus.Waiting,
            fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
            whiteDrawOffered: false,
            blackDrawOffered: false,
            currentTurn: address(0),
            whiteTimeRemaining: timeControl,
            blackTimeRemaining: timeControl,
            lastMoveTime: 0,
            result: GameResult.None,
            winner: address(0),
            createdAt: block.timestamp,
            isRated: isRated
        });
        
        gameExists[gameId] = true;
        totalGamesCreated++;
        totalValueLocked += msg.value;
        playerGames[msg.sender].push(gameId);
        
        emit GameCreated(gameId, msg.sender, msg.value);
    }

    /**
     * @dev Join an existing game
     */
    function joinGame(uint256 gameId) external payable gameExists_(gameId) {
        Game storage game = games[gameId];
        require(game.status == GameStatus.Waiting, "Game not available for joining");
        require(msg.value == game.wagerAmount, "Incorrect wager amount");
        require(msg.sender != game.whitePlayer && msg.sender != game.blackPlayer, "Cannot join own game");
        
        if (game.isRated) {
            require(playerStats[msg.sender].isRegistered, "Must register for rated games");
        }
        
        // Assign joiner to empty color
        if (game.whitePlayer == address(0)) {
            game.whitePlayer = msg.sender;
        } else if (game.blackPlayer == address(0)) {
            game.blackPlayer = msg.sender;
        } else {
            revert("Game is already full");
        }
        
        game.status = GameStatus.InProgress;
        game.currentTurn = game.whitePlayer; // White always starts
        game.lastMoveTime = block.timestamp;
        
        totalValueLocked += msg.value;
        playerGames[msg.sender].push(gameId);
        
        emit GameJoined(gameId, game.whitePlayer, game.blackPlayer);
    }

    /**
     * @dev Make a move
     */
    function makeMove(uint256 gameId, string memory move, string memory newFen)
        external gameExists_(gameId)
    {
        Game storage game = games[gameId];
        require(game.status == GameStatus.InProgress, "Game not in progress");
        require(game.currentTurn == msg.sender, "Not your turn");
        require(bytes(move).length > 0, "Move cannot be empty");
        require(bytes(newFen).length > 0, "FEN cannot be empty");
        
        // Calculate time spent on this move
        uint256 timeSpent = block.timestamp - game.lastMoveTime;
        
        // Update time and check for timeout
        if (msg.sender == game.whitePlayer) {
            if (timeSpent > game.whiteTimeRemaining) {
                _endGame(gameId, GameResult.BlackWinsByTime, game.blackPlayer);
                return;
            }
            // Add increment and subtract time spent
            game.whiteTimeRemaining = game.whiteTimeRemaining + game.increment - timeSpent;
            game.currentTurn = game.blackPlayer;
        } else {
            if (timeSpent > game.blackTimeRemaining) {
                _endGame(gameId, GameResult.WhiteWinsByTime, game.whitePlayer);
                return;
            }
            // Add increment and subtract time spent
            game.blackTimeRemaining = game.blackTimeRemaining + game.increment - timeSpent;
            game.currentTurn = game.whitePlayer;
        }
        
        game.fen = newFen;
        game.lastMoveTime = block.timestamp;
        
        // Reset draw offers after a move
        game.whiteDrawOffered = false;
        game.blackDrawOffered = false;
        
        emit MoveMade(gameId, msg.sender, move);
    }

    /**
     * @dev Resign from game
     */
    function resignGame(uint256 gameId) external gameExists_(gameId) onlyGamePlayer(gameId) {
        Game storage game = games[gameId];
        require(game.status == GameStatus.InProgress, "Game not in progress");
        
        if (msg.sender == game.whitePlayer) {
            _endGame(gameId, GameResult.BlackWinsByResignation, game.blackPlayer);
        } else {
            _endGame(gameId, GameResult.WhiteWinsByResignation, game.whitePlayer);
        }
    }

    /**
     * @dev Offer draw
     */
    function offerDraw(uint256 gameId) external gameExists_(gameId) onlyGamePlayer(gameId) {
        Game storage game = games[gameId];
        require(game.status == GameStatus.InProgress, "Game not in progress");
        
        if (msg.sender == game.whitePlayer) {
            require(!game.whiteDrawOffered, "Draw already offered");
            game.whiteDrawOffered = true;
        } else {
            require(!game.blackDrawOffered, "Draw already offered");
            game.blackDrawOffered = true;
        }
        
        emit DrawOffered(gameId, msg.sender);
    }

    /**
     * @dev Accept draw offer
     */
    function acceptDraw(uint256 gameId) external gameExists_(gameId) onlyGamePlayer(gameId) {
        Game storage game = games[gameId];
        require(game.status == GameStatus.InProgress, "Game not in progress");
        
        bool canAccept = false;
        if (msg.sender == game.whitePlayer && game.blackDrawOffered) {
            canAccept = true;
        } else if (msg.sender == game.blackPlayer && game.whiteDrawOffered) {
            canAccept = true;
        }
        
        require(canAccept, "No draw offer from opponent");
        
        emit DrawAccepted(gameId);
        _endGame(gameId, GameResult.Draw, address(0));
    }

    /**
     * @dev Claim victory by time (opponent exceeded time limit)
     */
    function claimVictoryByTime(uint256 gameId) external gameExists_(gameId) onlyGamePlayer(gameId) {
        Game storage game = games[gameId];
        require(game.status == GameStatus.InProgress, "Game not in progress");
        
        uint256 timeElapsed = block.timestamp - game.lastMoveTime;
        
        if (game.currentTurn == game.whitePlayer) {
            require(timeElapsed > game.whiteTimeRemaining + TIME_BUFFER, "White still has time");
            require(msg.sender == game.blackPlayer, "Only black can claim white timeout");
            _endGame(gameId, GameResult.BlackWinsByTime, game.blackPlayer);
        } else {
            require(timeElapsed > game.blackTimeRemaining + TIME_BUFFER, "Black still has time");
            require(msg.sender == game.whitePlayer, "Only white can claim black timeout");
            _endGame(gameId, GameResult.WhiteWinsByTime, game.whitePlayer);
        }
    }

    /**
     * @dev Cancel a waiting game (only creator can cancel)
     */
    function cancelGame(uint256 gameId) external gameExists_(gameId) {
        Game storage game = games[gameId];
        require(game.status == GameStatus.Waiting, "Can only cancel waiting games");
        require(msg.sender == game.whitePlayer || msg.sender == game.blackPlayer, "Only game creator can cancel");
        
        game.status = GameStatus.Cancelled;
        totalValueLocked -= game.wagerAmount;
        
        // Refund the creator
        payable(msg.sender).transfer(game.wagerAmount);
    }

    /**
     * @dev Declare game result (for checkmate, stalemate, etc.)
     */
    function declareResult(uint256 gameId, GameResult result) external gameExists_(gameId) onlyGamePlayer(gameId) {
        Game storage game = games[gameId];
        require(game.status == GameStatus.InProgress, "Game not in progress");
        require(result == GameResult.WhiteWins || result == GameResult.BlackWins || result == GameResult.Draw, "Invalid result");
        
        address winner = address(0);
        if (result == GameResult.WhiteWins) {
            winner = game.whitePlayer;
        } else if (result == GameResult.BlackWins) {
            winner = game.blackPlayer;
        }
        
        _endGame(gameId, result, winner);
    }

    /**
     * @dev End game and distribute funds
     */
    function _endGame(uint256 gameId, GameResult result, address winner) internal {
        Game storage game = games[gameId];
        require(game.status == GameStatus.InProgress, "Game not in progress");
        
        game.status = GameStatus.Completed;
        game.result = result;
        game.winner = winner;
        
        uint256 totalPot = game.wagerAmount * 2;
        uint256 platformFee = (totalPot * PLATFORM_FEE_BASIS_POINTS) / 10000;
        uint256 winnings = totalPot - platformFee;
        
        totalValueLocked -= totalPot;
        platformFeesCollected += platformFee;
        
        // Update player statistics
        _updatePlayerStats(game.whitePlayer, game.blackPlayer, result, game.wagerAmount);
        
        // Distribute funds
        if (winner != address(0)) {
            // Someone won
            playerStats[winner].totalWinnings += winnings;
            (bool success, ) = payable(winner).call{value: winnings}("");
            require(success, "Transfer to winner failed");
            emit GameCompleted(gameId, result, winner, winnings);
        } else {
            // Draw - split winnings
            uint256 halfWinnings = winnings / 2;
            playerStats[game.whitePlayer].totalWinnings += halfWinnings;
            playerStats[game.blackPlayer].totalWinnings += halfWinnings;
            
            (bool success1, ) = payable(game.whitePlayer).call{value: halfWinnings}("");
            (bool success2, ) = payable(game.blackPlayer).call{value: halfWinnings}("");
            require(success1 && success2, "Transfer failed");
            
            emit GameCompleted(gameId, result, address(0), winnings);
        }
    }

    /**
     * @dev Update player statistics
     */
    function _updatePlayerStats(address whitePlayer, address blackPlayer, GameResult result, uint256 wagerAmount) internal {
        playerStats[whitePlayer].gamesPlayed++;
        playerStats[blackPlayer].gamesPlayed++;
        playerStats[whitePlayer].totalWagered += wagerAmount;
        playerStats[blackPlayer].totalWagered += wagerAmount;
        
        if (result == GameResult.WhiteWins || result == GameResult.WhiteWinsByTime || result == GameResult.WhiteWinsByResignation) {
            playerStats[whitePlayer].gamesWon++;
            playerStats[blackPlayer].gamesLost++;
        } else if (result == GameResult.BlackWins || result == GameResult.BlackWinsByTime || result == GameResult.BlackWinsByResignation) {
            playerStats[blackPlayer].gamesWon++;
            playerStats[whitePlayer].gamesLost++;
        } else if (result == GameResult.Draw) {
            playerStats[whitePlayer].gamesDrawn++;
            playerStats[blackPlayer].gamesDrawn++;
        }
    }

    /**
     * @dev Owner can withdraw collected fees
     */
    function withdrawFees() external onlyOwner {
        uint256 amount = platformFeesCollected;
        require(amount > 0, "No fees to withdraw");
        
        platformFeesCollected = 0;
        
        (bool success, ) = payable(owner).call{value: amount}("");
        require(success, "Fee withdrawal failed");
        
        emit FundsWithdrawn(owner, amount);
    }

    // View functions
    function getGame(uint256 gameId) external view returns (Game memory) {
        require(gameExists[gameId], "Game does not exist");
        return games[gameId];
    }
    
    function getPlayerStats(address player) external view returns (PlayerStats memory) {
        return playerStats[player];
    }
    
    function getPlayerGames(address player) external view returns (uint256[] memory) {
        return playerGames[player];
    }
    
    function getActiveGames() external view returns (uint256[] memory) {
        uint256 count = 0;
        
        // First pass: count active games
        for (uint256 i = 1; i <= gameCounter; i++) {
            if (gameExists[i] && (games[i].status == GameStatus.Waiting || games[i].status == GameStatus.InProgress)) {
                count++;
            }
        }
        
        // Second pass: populate result array
        uint256[] memory result = new uint256[](count);
        uint256 index = 0;
        
        for (uint256 i = 1; i <= gameCounter; i++) {
            if (gameExists[i] && (games[i].status == GameStatus.Waiting || games[i].status == GameStatus.InProgress)) {
                result[index] = i;
                index++;
            }
        }
        
        return result;
    }

    function getWaitingGames() external view returns (uint256[] memory) {
        uint256 count = 0;
        
        // First pass: count waiting games
        for (uint256 i = 1; i <= gameCounter; i++) {
            if (gameExists[i] && games[i].status == GameStatus.Waiting) {
                count++;
            }
        }
        
        // Second pass: populate result array
        uint256[] memory result = new uint256[](count);
        uint256 index = 0;
        
        for (uint256 i = 1; i <= gameCounter; i++) {
            if (gameExists[i] && games[i].status == GameStatus.Waiting) {
                result[index] = i;
                index++;
            }
        }
        
        return result;
    }

    /**
     * @dev Check if a player's time has expired
     */
    function isTimeExpired(uint256 gameId) external view returns (bool, address) {
        require(gameExists[gameId], "Game does not exist");
        Game memory game = games[gameId];
        
        if (game.status != GameStatus.InProgress) {
            return (false, address(0));
        }
        
        uint256 timeElapsed = block.timestamp - game.lastMoveTime;
        
        if (game.currentTurn == game.whitePlayer && timeElapsed > game.whiteTimeRemaining + TIME_BUFFER) {
            return (true, game.whitePlayer);
        } else if (game.currentTurn == game.blackPlayer && timeElapsed > game.blackTimeRemaining + TIME_BUFFER) {
            return (true, game.blackPlayer);
        }
        
        return (false, address(0));
    }

    /**
     * @dev Get remaining time for both players
     */
    function getRemainingTime(uint256 gameId) external view returns (uint256 whiteTime, uint256 blackTime) {
        require(gameExists[gameId], "Game does not exist");
        Game memory game = games[gameId];
        
        if (game.status != GameStatus.InProgress) {
            return (game.whiteTimeRemaining, game.blackTimeRemaining);
        }
        
        uint256 timeElapsed = block.timestamp - game.lastMoveTime;
        
        if (game.currentTurn == game.whitePlayer) {
            whiteTime = game.whiteTimeRemaining > timeElapsed ? game.whiteTimeRemaining - timeElapsed : 0;
            blackTime = game.blackTimeRemaining;
        } else {
            whiteTime = game.whiteTimeRemaining;
            blackTime = game.blackTimeRemaining > timeElapsed ? game.blackTimeRemaining - timeElapsed : 0;
        }
    }
}
