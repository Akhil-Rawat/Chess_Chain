import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertUserSchema, insertGameSchema, Game, GameStatus } from "@shared/schema";
import { db } from "@db";
import { eq, and, desc } from "drizzle-orm";
import { games, users, gameResults, gameHistory } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // User routes
  app.post('/api/users/register', async (req, res) => {
    try {
      const validatedData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByAddress(validatedData.address);
      
      if (existingUser) {
        return res.status(200).json(existingUser);
      }
      
      // Create new user
      const newUser = await storage.createUser(validatedData);
      return res.status(201).json(newUser);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      console.error('Error registering user:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Game routes
  app.post('/api/games', async (req, res) => {
    try {
      const validatedData = insertGameSchema.parse(req.body);
      
      const newGame = await storage.createGame(validatedData);
      return res.status(201).json(newGame);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      console.error('Error creating game:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.get('/api/games/active', async (req, res) => {
    try {
      const activeGames = await storage.getActiveGames();
      return res.status(200).json(activeGames);
    } catch (error) {
      console.error('Error fetching active games:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.get('/api/games/recent', async (req, res) => {
    try {
      const recentGames = await storage.getRecentGames();
      return res.status(200).json(recentGames);
    } catch (error) {
      console.error('Error fetching recent games:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.get('/api/games/:id', async (req, res) => {
    try {
      const gameId = parseInt(req.params.id);
      if (isNaN(gameId)) {
        return res.status(400).json({ error: 'Invalid game ID' });
      }
      
      const game = await storage.getGameById(gameId);
      
      if (!game) {
        return res.status(404).json({ error: 'Game not found' });
      }
      
      return res.status(200).json(game);
    } catch (error) {
      console.error('Error fetching game:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.patch('/api/games/:id/join', async (req, res) => {
    try {
      const gameId = parseInt(req.params.id);
      if (isNaN(gameId)) {
        return res.status(400).json({ error: 'Invalid game ID' });
      }
      
      const { player2Address } = req.body;
      if (!player2Address) {
        return res.status(400).json({ error: 'Player 2 address is required' });
      }
      
      const game = await storage.joinGame(gameId, player2Address);
      return res.status(200).json(game);
    } catch (error) {
      console.error('Error joining game:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.patch('/api/games/:id/move', async (req, res) => {
    try {
      const gameId = parseInt(req.params.id);
      if (isNaN(gameId)) {
        return res.status(400).json({ error: 'Invalid game ID' });
      }
      
      const { move, playerAddress } = req.body;
      if (!move || !playerAddress) {
        return res.status(400).json({ error: 'Move and player address are required' });
      }
      
      const result = await storage.recordMove(gameId, move, playerAddress);
      return res.status(200).json(result);
    } catch (error) {
      console.error('Error recording move:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.patch('/api/games/:id/resign', async (req, res) => {
    try {
      const gameId = parseInt(req.params.id);
      if (isNaN(gameId)) {
        return res.status(400).json({ error: 'Invalid game ID' });
      }
      
      const { playerAddress } = req.body;
      if (!playerAddress) {
        return res.status(400).json({ error: 'Player address is required' });
      }
      
      const result = await storage.resignGame(gameId, playerAddress);
      return res.status(200).json(result);
    } catch (error) {
      console.error('Error resigning game:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.patch('/api/games/:id/draw', async (req, res) => {
    try {
      const gameId = parseInt(req.params.id);
      if (isNaN(gameId)) {
        return res.status(400).json({ error: 'Invalid game ID' });
      }
      
      const { playerAddress, action } = req.body;
      if (!playerAddress || !action) {
        return res.status(400).json({ error: 'Player address and action are required' });
      }
      
      if (action === 'offer') {
        const result = await storage.offerDraw(gameId, playerAddress);
        return res.status(200).json(result);
      } else if (action === 'accept') {
        const result = await storage.acceptDraw(gameId, playerAddress);
        return res.status(200).json(result);
      } else {
        return res.status(400).json({ error: 'Invalid action' });
      }
    } catch (error) {
      console.error('Error handling draw:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
