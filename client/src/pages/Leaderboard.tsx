import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trophy, Medal, Award } from "lucide-react";

interface LeaderboardItem {
  rank: number;
  address: string;
  username: string;
  wins: number;
  losses: number;
  draws: number;
  rating: number;
  totalWagered: string;
}

const Leaderboard = () => {
  const { data: players, isLoading } = useQuery<LeaderboardItem[]>({
    queryKey: ["/api/players/leaderboard"],
  });

  // Temporary leaderboard data until API endpoint is implemented
  const mockPlayers: LeaderboardItem[] = [
    {
      rank: 1,
      address: "0x7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6",
      username: "GrandMaster_ETH",
      wins: 47,
      losses: 12,
      draws: 5,
      rating: 2150,
      totalWagered: "5.78",
    },
    {
      rank: 2,
      address: "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0",
      username: "CryptoKnight",
      wins: 42,
      losses: 15,
      draws: 8,
      rating: 2050,
      totalWagered: "4.32",
    },
    {
      rank: 3,
      address: "0x9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0",
      username: "BlockchainBishop",
      wins: 38,
      losses: 18,
      draws: 10,
      rating: 1980,
      totalWagered: "3.95",
    },
    {
      rank: 4,
      address: "0x2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1",
      username: "EthereumRook",
      wins: 35,
      losses: 20,
      draws: 7,
      rating: 1940,
      totalWagered: "3.45",
    },
    {
      rank: 5,
      address: "0x8c7b6a5d4e3f2a1c0b9d8e7f6a5b4c3d2e1f0a9",
      username: "PawnChampion",
      wins: 30,
      losses: 22,
      draws: 12,
      rating: 1890,
      totalWagered: "2.98",
    },
  ];

  // Use the API data if available, otherwise use mock data
  const displayPlayers = players || mockPlayers;

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-400" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-300" />;
      case 3:
        return <Award className="h-5 w-5 text-amber-600" />;
      default:
        return <span className="text-gray-400">{rank}</span>;
    }
  };

  return (
    <div className="bg-background text-foreground font-sans min-h-screen">
      <Header />
      
      <main className="container mx-auto px-4 py-6 max-w-7xl">
        <h1 className="text-3xl font-bold mb-8">Player Leaderboard</h1>
        
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-xl">Top Chess Players</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-700 hover:bg-gray-800">
                    <TableHead className="w-16">Rank</TableHead>
                    <TableHead>Player</TableHead>
                    <TableHead className="text-center">W</TableHead>
                    <TableHead className="text-center">L</TableHead>
                    <TableHead className="text-center">D</TableHead>
                    <TableHead className="text-center">Rating</TableHead>
                    <TableHead className="text-right">Total Wagered</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayPlayers.map((player) => (
                    <TableRow key={player.address} className="border-gray-700 hover:bg-gray-700/50">
                      <TableCell className="font-medium flex items-center justify-center">
                        {getRankIcon(player.rank)}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{player.username}</div>
                        <div className="text-sm text-gray-400">
                          {player.address.substring(0, 6)}...{player.address.substring(player.address.length - 4)}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">{player.wins}</TableCell>
                      <TableCell className="text-center">{player.losses}</TableCell>
                      <TableCell className="text-center">{player.draws}</TableCell>
                      <TableCell className="text-center font-medium">{player.rating}</TableCell>
                      <TableCell className="text-right font-medium">{player.totalWagered} ETH</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Leaderboard;
