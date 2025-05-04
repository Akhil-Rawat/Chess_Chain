import { db } from "@db";
import {
  users,
  games,
  gameHistory,
  gameResults,
  User,
  Game,
  GameStatus,
  InsertUser,
  InsertGame,
  GameResult,
  GameMove
} from "@shared/schema";
import { eq, and, desc, asc, not, isNull } from "drizzle-orm";
import { Chess } from "chess.js";

// Helper function to generate a consistent username from an address
function generateUsernameFromAddress(address: string): string {
  const addressEnd = address.substring(address.length - 6);
  return `Player_${addressEnd}`;
}

export const storage = {
  // User operations
  async getUserByAddress(address: string): Promise<User | null> {
    const result = await db.query.users.findFirst({
      where: eq(users.address, address)
    });
    
    return result || null;
  },
  
  async createUser(data: InsertUser): Promise<User> {
    // Generate a username if not provided
    if (!data.username) {
      data.username = generateUsernameFromAddress(data.address);
    }
    
    const [newUser] = await db.insert(users).values(data).returning();
    return newUser;
  },
  
  // Game operations
  async createGame(data: InsertGame): Promise<Game> {
    // Create a new chess game with default FEN
    const chess = new Chess();
    
    const gameData = {
      ...data,
      status: "waiting" as GameStatus,
      fen: chess.fen(),
      currentTurn: "white",
      drawOffered: false,
      lastMoveAt: new Date()
    };
    
    const [newGame] = await db.insert(games).values(gameData).returning();
    return newGame;
  },
  
  async getGameById(id: number): Promise<Game | null> {
    const game = await db.query.games.findFirst({
      where: eq(games.id, id),
      with: {
        player1: true,
        player2: true,
        moves: {
          orderBy: asc(gameHistory.moveNumber)
        },
        result: true
      }
    });
    
    return game || null;
  },
  
  async getActiveGames(): Promise<Game[]> {
    const activeGames = await db.query.games.findMany({
      where: eq(games.status, "waiting"),
      with: {
        player1: true
      },
      orderBy: desc(games.createdAt)
    });
    
    return activeGames;
  },
  
  async getRecentGames(): Promise<any[]> {
    const recentGames = await db.query.games.findMany({
      where: eq(games.status, "completed"),
      with: {
        player1: true,
        player2: true,
        result: true
      },
      orderBy: desc(games.lastMoveAt),
      limit: 5
    });
    
    // Format games for the UI
    return recentGames.map(game => {
      let result = "draw";
      let amount = game.wagerAmount;
      let opponent = null;
      
      if (game.result) {
        if (game.result.winnerId === game.player1Id) {
          result = "victory";
          opponent = game.player2?.address;
        } else if (game.result.winnerId === game.player2Id) {
          result = "defeat";
          opponent = game.player2?.address;
        } else {
          result = "draw";
          opponent = game.player2?.address;
        }
      }
      
      return {
        id: game.id.toString(),
        opponent: opponent || "Unknown",
        result,
        timestamp: game.lastMoveAt.toISOString(),
        amount
      };
    });
  },
  
  async joinGame(gameId: number, player2Address: string): Promise<Game | null> {
    // First, check if the game exists and is in the waiting state
    const game = await db.query.games.findFirst({
      where: and(
        eq(games.id, gameId),
        eq(games.status, "waiting")
      )
    });
    
    if (!game) {
      throw new Error("Game not found or not in waiting state");
    }
    
    // Get or create the player
    let player2 = await this.getUserByAddress(player2Address);
    
    if (!player2) {
      player2 = await this.createUser({
        address: player2Address,
        username: generateUsernameFromAddress(player2Address)
      });
    }
    
    // Update the game
    const [updatedGame] = await db
      .update(games)
      .set({
        player2Id: player2.id,
        status: "in_progress",
        lastMoveAt: new Date()
      })
      .where(eq(games.id, gameId))
      .returning();
    
    return updatedGame;
  },
  
  async recordMove(gameId: number, move: string, playerAddress: string): Promise<Game | null> {
    // Get the game with its current state
    const game = await this.getGameById(gameId);
    
    if (!game) {
      throw new Error("Game not found");
    }
    
    if (game.status !== "in_progress") {
      throw new Error("Game is not in progress");
    }
    
    // Verify it's the player's turn
    const player1 = await this.getUserByAddress(game.player1?.address || "");
    const player2 = await this.getUserByAddress(game.player2?.address || "");
    
    if (!player1 || !player2) {
      throw new Error("Players not found");
    }
    
    const isWhiteTurn = game.currentTurn === "white";
    const expectedPlayerId = isWhiteTurn ? player1.id : player2.id;
    const movingPlayer = playerAddress === player1.address ? player1 : player2;
    
    if (movingPlayer.id !== expectedPlayerId) {
      throw new Error("Not your turn");
    }
    
    // Apply the move to the chess game
    const chess = new Chess(game.fen);
    
    try {
      // Move format should be like "e2e4"
      const from = move.substring(0, 2);
      const to = move.substring(2, 4);
      
      chess.move({
        from,
        to,
        promotion: move.length > 4 ? move[4] : undefined
      });
    } catch (error) {
      throw new Error("Invalid move");
    }
    
    // Record the move in the history
    const moveNumber = game.moves ? game.moves.length + 1 : 1;
    await db.insert(gameHistory).values({
      gameId: game.id,
      playerId: movingPlayer.id,
      move,
      fen: chess.fen(),
      moveNumber
    });
    
    // Update the game state
    const newTurn = isWhiteTurn ? "black" : "white";
    let gameStatus: GameStatus = "in_progress";
    
    // Check if the game is over
    if (chess.isCheckmate()) {
      gameStatus = "completed";
      // Record game result
      await db.insert(gameResults).values({
        gameId: game.id,
        winnerId: movingPlayer.id,
        result: isWhiteTurn ? "white_wins" : "black_wins",
        endedAt: new Date()
      });
    } else if (chess.isDraw()) {
      gameStatus = "completed";
      // Record draw result
      await db.insert(gameResults).values({
        gameId: game.id,
        result: "draw",
        endedAt: new Date()
      });
    }
    
    // Update the game
    const [updatedGame] = await db
      .update(games)
      .set({
        fen: chess.fen(),
        currentTurn: newTurn,
        status: gameStatus,
        lastMoveAt: new Date(),
        drawOffered: false // Reset draw offer after a move
      })
      .where(eq(games.id, gameId))
      .returning();
    
    return updatedGame;
  },
  
  async resignGame(gameId: number, playerAddress: string): Promise<Game | null> {
    // Get the game
    const game = await this.getGameById(gameId);
    
    if (!game) {
      throw new Error("Game not found");
    }
    
    if (game.status !== "in_progress") {
      throw new Error("Game is not in progress");
    }
    
    // Get players
    const player1 = await this.getUserByAddress(game.player1?.address || "");
    const player2 = await this.getUserByAddress(game.player2?.address || "");
    
    if (!player1 || !player2) {
      throw new Error("Players not found");
    }
    
    const resigningPlayer = playerAddress === player1.address ? player1 : player2;
    const winnerId = resigningPlayer.id === player1.id ? player2.id : player1.id;
    
    // Record game result
    await db.insert(gameResults).values({
      gameId: game.id,
      winnerId,
      result: resigningPlayer.id === player1.id ? "black_wins" : "white_wins",
      endedAt: new Date()
    });
    
    // Update the game
    const [updatedGame] = await db
      .update(games)
      .set({
        status: "completed",
        lastMoveAt: new Date()
      })
      .where(eq(games.id, gameId))
      .returning();
    
    return updatedGame;
  },
  
  async offerDraw(gameId: number, playerAddress: string): Promise<Game | null> {
    // Get the game
    const game = await this.getGameById(gameId);
    
    if (!game) {
      throw new Error("Game not found");
    }
    
    if (game.status !== "in_progress") {
      throw new Error("Game is not in progress");
    }
    
    // Update the game to indicate a draw offer
    const [updatedGame] = await db
      .update(games)
      .set({
        drawOffered: true,
        lastMoveAt: new Date()
      })
      .where(eq(games.id, gameId))
      .returning();
    
    return updatedGame;
  },
  
  async acceptDraw(gameId: number, playerAddress: string): Promise<Game | null> {
    // Get the game
    const game = await this.getGameById(gameId);
    
    if (!game) {
      throw new Error("Game not found");
    }
    
    if (game.status !== "in_progress") {
      throw new Error("Game is not in progress");
    }
    
    if (!game.drawOffered) {
      throw new Error("No draw has been offered");
    }
    
    // Record game result as a draw
    await db.insert(gameResults).values({
      gameId: game.id,
      result: "draw",
      endedAt: new Date()
    });
    
    // Update the game
    const [updatedGame] = await db
      .update(games)
      .set({
        status: "completed",
        drawOffered: false,
        lastMoveAt: new Date()
      })
      .where(eq(games.id, gameId))
      .returning();
    
    return updatedGame;
  }
};
