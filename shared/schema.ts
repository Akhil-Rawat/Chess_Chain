import { pgTable, text, serial, integer, boolean, timestamp, varchar, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Enum definitions
export const gameStatusEnum = pgEnum('game_status', ['waiting', 'in_progress', 'completed']);
export const gameResultEnum = pgEnum('game_result', ['white_wins', 'black_wins', 'draw']);
export const turnEnum = pgEnum('turn', ['white', 'black']);

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull(),
  address: text("address").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Games table
export const games = pgTable("games", {
  id: serial("id").primaryKey(),
  player1Id: integer("player1_id").references(() => users.id).notNull(),
  player2Id: integer("player2_id").references(() => users.id),
  wagerAmount: text("wager_amount").notNull(),
  timeControl: text("time_control").notNull(),
  status: gameStatusEnum("status").notNull().default('waiting'),
  fen: text("fen").notNull().default('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'),
  currentTurn: turnEnum("current_turn").notNull().default('white'),
  drawOffered: boolean("draw_offered").notNull().default(false),
  contractAddress: text("contract_address").notNull(),
  transactionHash: text("transaction_hash").notNull(),
  network: text("network").notNull(),
  wagerStatus: text("wager_status").notNull().default('pending'),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  lastMoveAt: timestamp("last_move_at").defaultNow().notNull(),
});

// Game moves history
export const gameHistory = pgTable("game_history", {
  id: serial("id").primaryKey(),
  gameId: integer("game_id").references(() => games.id).notNull(),
  playerId: integer("player_id").references(() => users.id).notNull(),
  move: text("move").notNull(),
  fen: text("fen").notNull(),
  moveNumber: integer("move_number").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Game results
export const gameResults = pgTable("game_results", {
  id: serial("id").primaryKey(),
  gameId: integer("game_id").references(() => games.id).notNull().unique(),
  winnerId: integer("winner_id").references(() => users.id),
  result: gameResultEnum("result").notNull(),
  endedAt: timestamp("ended_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Define relationships
export const usersRelations = relations(users, ({ many }) => ({
  gamesAsPlayer1: many(games, { relationName: "player1Games" }),
  gamesAsPlayer2: many(games, { relationName: "player2Games" }),
  moves: many(gameHistory),
  wins: many(gameResults, { relationName: "winnerResults" }),
}));

export const gamesRelations = relations(games, ({ one, many }) => ({
  player1: one(users, {
    fields: [games.player1Id],
    references: [users.id],
    relationName: "player1Games",
  }),
  player2: one(users, {
    fields: [games.player2Id],
    references: [users.id],
    relationName: "player2Games",
  }),
  moves: many(gameHistory),
  result: one(gameResults),
}));

export const gameHistoryRelations = relations(gameHistory, ({ one }) => ({
  game: one(games, {
    fields: [gameHistory.gameId],
    references: [games.id],
  }),
  player: one(users, {
    fields: [gameHistory.playerId],
    references: [users.id],
  }),
}));

export const gameResultsRelations = relations(gameResults, ({ one }) => ({
  game: one(games, {
    fields: [gameResults.gameId],
    references: [games.id],
  }),
  winner: one(users, {
    fields: [gameResults.winnerId],
    references: [users.id],
    relationName: "winnerResults",
  }),
}));

// Zod schemas for validation
export const insertUserSchema = createInsertSchema(users);
export const insertGameSchema = createInsertSchema(games);
export const insertGameHistorySchema = createInsertSchema(gameHistory);
export const insertGameResultSchema = createInsertSchema(gameResults);

// TypeScript types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Game = typeof games.$inferSelect & {
  player1?: User;
  player2?: User | null;
  moves?: GameMove[];
  result?: GameResult | null;
};
export type InsertGame = z.infer<typeof insertGameSchema>;

export type GameMove = typeof gameHistory.$inferSelect;
export type InsertGameMove = z.infer<typeof insertGameHistorySchema>;

export type GameResult = typeof gameResults.$inferSelect;
export type InsertGameResult = z.infer<typeof insertGameResultSchema>;

// Custom Types
export type GameStatus = 'waiting' | 'in_progress' | 'completed';
