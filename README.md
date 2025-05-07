# ChessChain

A decentralized chess application with blockchain integration for game results and wagering.

## The Smart Contract: ChessGame.sol

Contract `ChessGame.sol` (located at `server/contracts/ChessGame.sol`) manages:

- Game creation and joining
- Move validation and recording
- Draw offers and acceptance
- Game resignation
- Wager management and payout

All game results are immutable and verifiable on the blockchain.

## Project Structure

```
├── client/                # Frontend React application
│   ├── src/
│   │   ├── components/    # UI components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Utility functions
│   │   ├── pages/         # Application pages
│   │   └── App.tsx        # Main application component
├── db/                    # Database configuration
├── server/                # Backend Express server
│   ├── contracts/         # Solidity smart contracts
│   ├── index.ts           # Server entry point
│   └── routes.ts          # API route definitions
└── shared/                # Shared code between frontend and backend
    └── schema.ts          # Database schema definitions
```

## Features

- **Blockchain Chess**: Play chess with moves recorded on the blockchain
- **Cryptocurrency Wagering**: Bet ETH on chess games with smart contract escrow
- **Leaderboard System**: Compete for rankings with stored results
- **Time Controls**: Multiple time control options
- **Draw Offers & Resignation**: Full chess protocol implementation

## Technology Stack

- **Frontend**: React, TypeScript, Vite, TailwindCSS, shadcn/ui
- **Backend**: Node.js, Express
- **Database**: PostgreSQL with Drizzle ORM
- **Blockchain**: Ethereum, Solidity Smart Contracts
- **Web3 Integration**: ethers.js
- **Chess Logic**: chess.js

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL
- MetaMask or another Web3 wallet

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/chesschani.git
   cd chesschani
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with:
   ```
   DATABASE_URL=postgresql://username:password@localhost:5432/your_database_name
   ```

4. Initialize the database:
   ```bash
   npm run db:push
   npm run db:seed
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open your browser and navigate to:
   ```
   http://localhost:5000
   ```

### Blockchain Setup (Optional)

If you want to deploy the smart contract:

1. Install Hardhat:
   ```bash
   npm install -g hardhat
   ```

2. Compile and deploy the contract:
   ```bash
   npx hardhat compile
   npx hardhat run scripts/deploy.js --network sepolia
   ```

3. Update the contract address in `client/src/lib/web3.ts`

## API Endpoints

- `GET /api/games/active` - Get list of active games
- `GET /api/games/:id` - Get a specific game by ID
- `POST /api/games` - Create a new game
- `POST /api/games/:id/join` - Join an existing game
- `POST /api/games/:id/move` - Make a move in a game
- `POST /api/games/:id/resign` - Resign from a game
- `POST /api/games/:id/draw/offer` - Offer a draw
- `POST /api/games/:id/draw/accept` - Accept a draw offer

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [chess.js](https://github.com/jhlywa/chess.js) for chess logic
- [ethers.js](https://docs.ethers.io/v5/) for Ethereum interaction
- [shadcn/ui](https://ui.shadcn.com/) for UI components