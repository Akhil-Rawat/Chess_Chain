<div align="center">
  <h1>♟️ ChessChain - Where Chess Meets Blockchain ♟️</h1>
  <img src="generated-icon.png" alt="ChessChain Logo" width="200">
  <p><em>Taking chess to the next level with Web3 technology</em></p>
  <p>
    <a href="https://github.com/yourusername/chesschani/issues">Report Bug</a> ·
    <a href="https://github.com/yourusername/chesschani/issues">Request Feature</a>
  </p>
</div>

## 🎮 What is ChessChain?

ChessChain isn't just another chess app - it's a revolution in how we play the game of kings! I've built this platform to combine the timeless strategy of chess with the cutting-edge security of blockchain.

Imagine playing chess where:
- Your victories are permanently recorded on the blockchain
- You can challenge friends to matches with real cryptocurrency wagers
- Every move is verified by smart contracts, ensuring complete fairness

Whether you're a casual player looking to have some fun or a serious competitor seeking to prove your skills (and maybe earn some ETH in the process), ChessChain offers a unique chess experience unlike anything you've played before.

## ✨ Cool Features

- **🔗 Blockchain Chess** - Every move is recorded on-chain for complete transparency
- **💰 Crypto Wagering** - Challenge opponents with ETH wagers secured by smart contracts
- **🏆 Leaderboard** - Climb the ranks and build your on-chain reputation
- **💬 In-game Chat** - Talk strategy (or trash) with your opponent
- **⏱️ Flexible Time Controls** - Play blitz, rapid, or classical chess
- **🤝 Draw & Resign** - Full chess protocols for all game outcomes

## 🛠️ Built With

- **React & TypeScript** - For a responsive, type-safe frontend
- **Vite** - Lightning-fast builds and hot module replacement
- **TailwindCSS & shadcn/ui** - Beautiful, customizable UI components
- **Node.js & Express** - Robust backend API
- **PostgreSQL & Drizzle ORM** - Efficient data storage and retrieval
- **Ethereum & Solidity** - Smart contracts for game logic and wagering
- **ethers.js** - Seamless Web3 integration
- **chess.js** - Reliable chess move validation

## 🚀 Getting Started

### Before You Begin

You'll need:
- **Node.js** (v18+) - The JavaScript runtime
- **PostgreSQL** - Our database of choice
- **MetaMask** - To connect with the Ethereum blockchain

### Let's Set It Up!

1. **Grab the code:**
   ```bash
   git clone https://github.com/yourusername/chesschani.git
   cd chesschani
   ```

2. **Install the goodies:**
   ```bash
   npm install
   ```

3. **Set up your environment:**
   Create a `.env` file with:
   ```
   DATABASE_URL=postgresql://username:password@localhost:5432/your_database_name
   ```

4. **Prepare the database:**
   ```bash
   npm run db:push   # Sets up your database schema
   npm run db:seed   # Adds some initial data to play with
   ```

5. **Start the engines:**
   ```bash
   npm run dev
   ```

6. **Play!** Open `http://localhost:5000` in your browser

### Want to Deploy the Smart Contract?

1. **Get Hardhat:**
   ```bash
   npm install -g hardhat
   ```

2. **Deploy to a test network:**
   ```bash
   npx hardhat compile
   npx hardhat run scripts/deploy.js --network sepolia
   ```

3. **Update** the contract address in `client/src/lib/web3.ts`

## 🧠 The Smart Contract Magic

Our `ChessGame.sol` contract is the brains of the operation, handling:

- Creating and joining games
- Validating and recording every move
- Managing draw offers and resignations
- Securely handling wagers and payouts

All game results are immutable and verifiable on the blockchain!

## 📂 Project Organization

```
├── client/                # All the frontend goodness
│   ├── src/
│   │   ├── components/    # UI building blocks
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Utility functions
│   │   ├── pages/         # Main application views
│   │   └── App.tsx        # App entry point
├── db/                    # Database configuration
├── server/                # Backend services
│   ├── contracts/         # Our Solidity smart contracts
│   ├── index.ts           # Server startup
│   └── routes.ts          # API endpoints
└── shared/                # Shared code and types
    └── schema.ts          # Database schema definitions
```

## 🔌 API Endpoints

- `GET /api/games/active` - Browse games looking for opponents
- `GET /api/games/:id` - Check out a specific game
- `POST /api/games` - Create your own game
- `POST /api/games/:id/join` - Join someone's game
- `POST /api/games/:id/move` - Make your chess move
- `POST /api/games/:id/resign` - Admit defeat gracefully
- `POST /api/games/:id/draw/offer` - Offer a draw
- `POST /api/games/:id/draw/accept` - Accept a draw offer

## 👥 Want to Contribute?

I'd love your help making ChessChain even better! Here's how:

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to your branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Thanks To

- The amazing [chess.js](https://github.com/jhlywa/chess.js) library
- [ethers.js](https://docs.ethers.io/v5/) for making Web3 integration smoother
- [shadcn/ui](https://ui.shadcn.com/) for the beautiful components

---

<div align="center">
  <p>Made with ♥️ by a chess enthusiast who loves blockchain</p>
  <p>Happy gaming, and may your strategies be sound and your captures many!</p>
</div>