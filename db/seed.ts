import { db } from "./index";
import * as schema from "@shared/schema";
import { Chess } from "chess.js";

async function seed() {
  try {
    console.log("Starting database seed...");

    // Check if users already exist
    const existingUsers = await db.query.users.findMany();
    if (existingUsers.length > 0) {
      console.log("Users already exist, skipping user creation");
    } else {
      // Create sample users
      console.log("Creating sample users...");
      const users = [
        {
          username: "Player_1a2b3c",
          address: "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b",
        },
        {
          username: "Player_4d5e6f",
          address: "0x4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3",
        },
        {
          username: "Player_7a8b9c",
          address: "0x7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6",
        },
      ];

      for (const user of users) {
        await db.insert(schema.users).values(user);
      }
    }

    // Fetch users for references
    const dbUsers = await db.query.users.findMany();
    if (dbUsers.length < 3) {
      throw new Error("Not enough users in database to proceed with seeding");
    }

    // Check if games already exist
    const existingGames = await db.query.games.findMany();
    if (existingGames.length > 0) {
      console.log("Games already exist, skipping game creation");
    } else {
      console.log("Creating sample games...");
      
      // Create a few completed games
      const completedGames = [
        {
          player1Id: dbUsers[0].id,
          player2Id: dbUsers[1].id,
          wagerAmount: "0.02",
          timeControl: "10",
          status: "completed",
          fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
          currentTurn: "white",
          drawOffered: false,
          contractAddress: "0x7C3F4E8B9D2A1C5F0B3E7D6A9C8B7A6B5C4D3E2B",
          transactionHash: "0x9F2A3B4C5D6E7F8A9B0C1D2E3F4A5B6C7D8E9F0A",
          network: "Ethereum",
          wagerStatus: "completed",
          createdAt: new Date(Date.now() - 86400000 * 3), // 3 days ago
          lastMoveAt: new Date(Date.now() - 86400000 * 3 + 3600000), // 3 days ago + 1 hour
        },
        {
          player1Id: dbUsers[1].id,
          player2Id: dbUsers[0].id,
          wagerAmount: "0.01",
          timeControl: "5",
          status: "completed",
          fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
          currentTurn: "white",
          drawOffered: false,
          contractAddress: "0x7C3F4E8B9D2A1C5F0B3E7D6A9C8B7A6B5C4D3E2B",
          transactionHash: "0x9F2A3B4C5D6E7F8A9B0C1D2E3F4A5B6C7D8E9F0A",
          network: "Ethereum",
          wagerStatus: "completed",
          createdAt: new Date(Date.now() - 86400000 * 2), // 2 days ago
          lastMoveAt: new Date(Date.now() - 86400000 * 2 + 3600000), // 2 days ago + 1 hour
        },
        {
          player1Id: dbUsers[0].id,
          player2Id: dbUsers[2].id,
          wagerAmount: "0.01",
          timeControl: "3",
          status: "completed",
          fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
          currentTurn: "white",
          drawOffered: false,
          contractAddress: "0x7C3F4E8B9D2A1C5F0B3E7D6A9C8B7A6B5C4D3E2B",
          transactionHash: "0x9F2A3B4C5D6E7F8A9B0C1D2E3F4A5B6C7D8E9F0A",
          network: "Ethereum",
          wagerStatus: "completed",
          createdAt: new Date(Date.now() - 86400000), // 1 day ago
          lastMoveAt: new Date(Date.now() - 86400000 + 3600000), // 1 day ago + 1 hour
        }
      ];

      const gameIds = [];
      for (const game of completedGames) {
        const [insertedGame] = await db.insert(schema.games).values(game).returning({ id: schema.games.id });
        gameIds.push(insertedGame.id);
      }

      // Add game results
      await db.insert(schema.gameResults).values({
        gameId: gameIds[0],
        winnerId: dbUsers[0].id,
        result: "white_wins",
        endedAt: new Date(Date.now() - 86400000 * 3 + 3600000),
      });

      await db.insert(schema.gameResults).values({
        gameId: gameIds[1],
        winnerId: dbUsers[1].id,
        result: "white_wins",
        endedAt: new Date(Date.now() - 86400000 * 2 + 3600000),
      });

      await db.insert(schema.gameResults).values({
        gameId: gameIds[2],
        result: "draw",
        endedAt: new Date(Date.now() - 86400000 + 3600000),
      });

      // Create an active game waiting for an opponent
      await db.insert(schema.games).values({
        player1Id: dbUsers[2].id,
        wagerAmount: "0.01",
        timeControl: "5",
        status: "waiting",
        contractAddress: "0x7C3F4E8B9D2A1C5F0B3E7D6A9C8B7A6B5C4D3E2B",
        transactionHash: "0x9F2A3B4C5D6E7F8A9B0C1D2E3F4A5B6C7D8E9F0A",
        network: "Ethereum",
        wagerStatus: "funded",
        createdAt: new Date(),
        lastMoveAt: new Date(),
      });

      // Create an in-progress game
      const chess = new Chess();
      // Play a few moves
      chess.move('e4');
      chess.move('e5');
      chess.move('Nf3');
      chess.move('Nc6');
      chess.move('Bc4');
      
      const [inProgressGame] = await db.insert(schema.games).values({
        player1Id: dbUsers[0].id,
        player2Id: dbUsers[1].id,
        wagerAmount: "0.01",
        timeControl: "10",
        status: "in_progress",
        fen: chess.fen(),
        currentTurn: "black",
        drawOffered: false,
        contractAddress: "0x7C3F4E8B9D2A1C5F0B3E7D6A9C8B7A6B5C4D3E2B",
        transactionHash: "0x9F2A3B4C5D6E7F8A9B0C1D2E3F4A5B6C7D8E9F0A",
        network: "Ethereum",
        wagerStatus: "funded",
        createdAt: new Date(Date.now() - 3600000), // 1 hour ago
        lastMoveAt: new Date(),
      }).returning({ id: schema.games.id });

      // Add move history
      await db.insert(schema.gameHistory).values([
        {
          gameId: inProgressGame.id,
          playerId: dbUsers[0].id,
          move: "e2e4",
          fen: "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1",
          moveNumber: 1,
        },
        {
          gameId: inProgressGame.id,
          playerId: dbUsers[1].id,
          move: "e7e5",
          fen: "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq e6 0 2",
          moveNumber: 2,
        },
        {
          gameId: inProgressGame.id,
          playerId: dbUsers[0].id,
          move: "g1f3",
          fen: "rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2",
          moveNumber: 3,
        },
        {
          gameId: inProgressGame.id,
          playerId: dbUsers[1].id,
          move: "b8c6",
          fen: "r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3",
          moveNumber: 4,
        },
        {
          gameId: inProgressGame.id,
          playerId: dbUsers[0].id,
          move: "f1c4",
          fen: "r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3",
          moveNumber: 5,
        }
      ]);
    }

    console.log("Seed completed successfully!");
  } catch (error) {
    console.error("Error during seeding:", error);
  }
}

seed();
