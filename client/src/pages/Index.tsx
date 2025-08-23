import { useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/Navbar";
import IntroSplash from "@/components/IntroSplash";
import RecentGames from "@/components/RecentGames";
import NewGameModal from "@/components/NewGameModal";
import Web3Modal from "@/components/Web3Modal";
import { useWeb3Store } from "@/lib/web3";
import { Crown, Shield, Trophy, Wallet, TrendingUp, Swords, Clock3 } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface GameListItem {
  id: string;
  wagerAmount: string;
  timeControl: string;
  createdAt: string;
  player1?: {
    id: number;
    username: string;
    address: string;
    createdAt: string;
    updatedAt: string;
  };
}

const Index = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [showIntro, setShowIntro] = useState(() => !sessionStorage.getItem("cc_seen_intro"));
  const [isNewGameModalOpen, setIsNewGameModalOpen] = useState(false);
  const [isWeb3ModalOpen, setIsWeb3ModalOpen] = useState(false);
  const { account, isConnected } = useWeb3Store();

  const { data: activeGames } = useQuery<GameListItem[]>({
    queryKey: ['/api/games/active'],
    retry: false,
    staleTime: 0,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      try {
        const response = await fetch('/api/games/active');
        if (!response.ok) throw new Error('API not available');
        return await response.json();
      } catch (error) {
        return [];
      }
    }
  });

  const handleGameCreated = (gameId: number) => {
    navigate(`/game/${gameId}`);
  };

  const handleStartPlaying = () => {
    if (isConnected) {
      setIsNewGameModalOpen(true);
    } else {
      setIsWeb3ModalOpen(true);
    }
  };

  const onPointerMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = heroRef.current;
    if (!el) return;
    
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Original spotlight effect
    const spotX = (x / rect.width) * 100;
    const spotY = (y / rect.height) * 100;
    el.style.setProperty("--spot-x", `${spotX}%`);
    el.style.setProperty("--spot-y", `${spotY}%`);
    
    // Chess piece rotation based on cursor position with smoother tracking
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const deltaX = x - centerX;
    const deltaY = y - centerY;
    const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI) * 0.5; // Reduced sensitivity
    el.style.setProperty("--cursor-angle", `${angle}deg`);
    
    // Distance-based scaling for chess pieces
    const distance = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
    const maxDistance = Math.sqrt(Math.pow(centerX, 2) + Math.pow(centerY, 2));
    const scale = 1 + (distance / maxDistance) * 0.15;
    el.style.setProperty("--cursor-scale", scale.toString());
    
    // Chessboard pattern effect
    const tileX = Math.floor(x / 80);
    const tileY = Math.floor(y / 80);
    el.style.setProperty("--tile-x", tileX.toString());
    el.style.setProperty("--tile-y", tileY.toString());
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "ChessChain",
    url: window.location.origin,
    potentialAction: {
      "@type": "SearchAction",
      target: `${window.location.origin}/?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  const jsonLdFaq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How do payouts work?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Funds are held in a smart contract escrow. When a game ends, the winner receives the full stake automatically.",
        },
      },
      {
        "@type": "Question",
        name: "Is there a house fee?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A small protocol fee may apply to cover network operations. Exact fees are shown before you join a match.",
        },
      },
      {
        "@type": "Question",
        name: "Which wallets are supported?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Any Ethereum-compatible wallet that works in your browser, like MetaMask, Rainbow, or Coinbase Wallet.",
        },
      },
    ],
  };

  return (
    <>
      <Helmet>
        <title>ChessChain — Stake ETH and Play Chess</title>
        <meta name="description" content="Stake ETH, match up, and battle on-chain. Winner takes all on ChessChain." />
        <link rel="canonical" href={window.location.href} />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
        <script type="application/ld+json">{JSON.stringify(jsonLdFaq)}</script>
      </Helmet>

      <Navbar />
      {showIntro && (
        <IntroSplash
          onFinish={() => {
            sessionStorage.setItem("cc_seen_intro", "1");
            setShowIntro(false);
          }}
        />
      )}

      <main>
        {/* Hero */}
        <section ref={heroRef} onMouseMove={onPointerMove} className="bg-hero relative overflow-hidden">
          {/* Chess pieces floating background */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="chess-piece chess-piece-1">♚</div>
            <div className="chess-piece chess-piece-2">♛</div>
            <div className="chess-piece chess-piece-3">♝</div>
            <div className="chess-piece chess-piece-4">♞</div>
            <div className="chess-piece chess-piece-5">♜</div>
            <div className="chess-piece chess-piece-6">♟</div>
          </div>
          {/* Interactive cursor glow */}
          <div 
            className="absolute pointer-events-none opacity-30 w-32 h-32 rounded-full bg-gradient-radial from-primary/40 to-transparent blur-xl transition-all duration-300 ease-out"
            style={{
              left: 'var(--spot-x, 50%)',
              top: 'var(--spot-y, 50%)',
              transform: 'translate(-50%, -50%) scale(var(--cursor-scale, 1))'
            }}
          />
          <div className="container mx-auto px-6 py-20 relative z-10">
            <div className="mx-auto max-w-4xl rounded-2xl surface-card p-10 text-center backdrop-blur-sm">
              <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full border border-border bg-secondary/60 chess-crown">
                <Crown className="text-primary transition-transform duration-300" />
              </div>
              <h1 className="mb-4 text-5xl font-extrabold leading-tight tracking-tight headline-gradient">
                The Future of On‑Chain Chess
              </h1>
              <p className="mb-8 text-lg text-muted-foreground">
                Challenge opponents, stake ETH, and have your victories permanently recorded on the blockchain. Welcome to the next evolution of competitive chess.
              </p>
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button variant="hero" size="lg" onClick={handleStartPlaying}>
                  <Swords className="mr-2" /> Start Playing
                </Button>
                <Button variant="outline" size="lg" onClick={() => navigate('/games')}>
                  <Trophy className="mr-2" /> View Leaderboard
                </Button>
              </div>
              <div className="mt-10 grid grid-cols-1 gap-6 text-left sm:grid-cols-3">
                <div>
                  <div className="text-2xl font-bold text-primary">1,234</div>
                  <div className="text-sm text-muted-foreground">Games Played</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">45.6 ETH</div>
                  <div className="text-sm text-muted-foreground">Total Wagered</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">567</div>
                  <div className="text-sm text-muted-foreground">Active Players</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="container mx-auto px-6 py-20">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <div className="mb-8 flex justify-center">
              <div className="animated-features-card">
                <div className="animated-features-loader">
                  <span>Why ChessChain? Experience </span>
                  <div className="animated-features-words">
                    <span className="animated-features-word">Stockfish AI Analysis</span>
                    <span className="animated-features-word">Anti-Cheat Detection</span>
                    <span className="animated-features-word">Instant Blockchain Payouts</span>
                    <span className="animated-features-word">Provably Fair Games</span>
                    <span className="animated-features-word">Smart Contract Security</span>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-muted-foreground">Fast, fair, and secure gameplay with transparent payouts.</p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <article className="rounded-xl border border-border bg-card/60 p-6 shadow-sm">
              <div className="mb-4 inline-flex rounded-md border border-border bg-secondary/50 p-2"><Wallet /></div>
              <h3 className="mb-1 font-semibold">Stake ETH Seamlessly</h3>
              <p className="text-sm text-muted-foreground">Connect your wallet and stake in seconds. Smart contracts hold funds until the match concludes.</p>
            </article>
            <article className="rounded-xl border border-border bg-card/60 p-6 shadow-sm">
              <div className="mb-4 inline-flex rounded-md border border-border bg-secondary/50 p-2"><Shield /></div>
              <h3 className="mb-1 font-semibold">Provably Fair & Secure</h3>
              <p className="text-sm text-muted-foreground">On-chain settlement and anti-cheat detection keep every match fair with verifiable results.</p>
            </article>
            <article className="rounded-xl border border-border bg-card/60 p-6 shadow-sm">
              <div className="mb-4 inline-flex rounded-md border border-border bg-secondary/50 p-2"><TrendingUp /></div>
              <h3 className="mb-1 font-semibold">Instant Payouts</h3>
              <p className="text-sm text-muted-foreground">Winner takes all. Payouts are executed automatically at game end.</p>
            </article>
          </div>
        </section>

        {/* Active Games Section */}
        {activeGames && activeGames.length > 0 && (
          <section className="container mx-auto px-6 pb-20">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <h2 className="text-3xl font-bold">Active Games</h2>
              <p className="mt-2 text-muted-foreground">Join an existing game or create your own.</p>
            </div>
            <RecentGames />
          </section>
        )}

        {/* How it works */}
        <section id="how" className="container mx-auto px-6 pb-20">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="text-3xl font-bold">How It Works</h2>
            <p className="mt-2 text-muted-foreground">Three simple steps to start winning.</p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <article className="rounded-xl border border-border bg-card/60 p-6 shadow-sm">
              <div className="mb-4 inline-flex rounded-md border border-border bg-secondary/50 p-2"><Crown /></div>
              <h3 className="mb-1 font-semibold">1. Connect Wallet</h3>
              <p className="text-sm text-muted-foreground">Use your favorite Ethereum wallet to sign in.</p>
            </article>
            <article className="rounded-xl border border-border bg-card/60 p-6 shadow-sm">
              <div className="mb-4 inline-flex rounded-md border border-border bg-secondary/50 p-2"><Clock3 /></div>
              <h3 className="mb-1 font-semibold">2. Join a Match</h3>
              <p className="text-sm text-muted-foreground">Pick a lobby or create your own with your preferred stake.</p>
            </article>
            <article className="rounded-xl border border-border bg-card/60 p-6 shadow-sm">
              <div className="mb-4 inline-flex rounded-md border border-border bg-secondary/50 p-2"><Trophy /></div>
              <h3 className="mb-1 font-semibold">3. Win & Get Paid</h3>
              <p className="text-sm text-muted-foreground">Winner takes all with automatic smart contract payouts.</p>
            </article>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="container mx-auto px-6 pb-16">
          <div className="mx-auto mb-8 max-w-2xl text-center">
            <h2 className="text-3xl font-bold">FAQ</h2>
            <p className="mt-2 text-muted-foreground">Everything you need to know before your first match.</p>
          </div>
          <div className="mx-auto max-w-3xl rounded-xl border border-border bg-card/60 p-2 sm:p-4">
            <Accordion type="single" collapsible>
              <AccordionItem value="item-1">
                <AccordionTrigger>How do payouts work?</AccordionTrigger>
                <AccordionContent>
                  Funds are held in a smart contract escrow. When a game ends, the winner receives the full stake automatically.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>Is there a house fee?</AccordionTrigger>
                <AccordionContent>
                  A small protocol fee may apply to cover network operations. Exact fees are shown before you join a match.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>Which wallets are supported?</AccordionTrigger>
                <AccordionContent>
                  Any Ethereum-compatible wallet that works in your browser, like MetaMask, Rainbow, or Coinbase Wallet.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>

        {/* CTA */}
        <section className="container mx-auto px-6 pb-24">
          <div className="rounded-2xl surface-card p-8 text-center sm:p-12">
            <h2 className="mb-3 text-3xl font-bold">Ready to make your move?</h2>
            <p className="mb-6 text-muted-foreground">Jump into a match and claim the pot.</p>
            <Button variant="hero" size="lg" onClick={handleStartPlaying}>
              <Swords className="mr-2"/> Play Now
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/60 py-8 text-center text-sm text-muted-foreground">
        <div className="container mx-auto px-6">
          © {new Date().getFullYear()} ChessChain. All rights reserved.
        </div>
      </footer>

      <NewGameModal 
        isOpen={isNewGameModalOpen}
        onClose={() => setIsNewGameModalOpen(false)}
        onGameCreated={handleGameCreated}
      />

      <Web3Modal 
        isOpen={isWeb3ModalOpen}
        onClose={() => setIsWeb3ModalOpen(false)}
      />
    </>
  );
};

export default Index;
