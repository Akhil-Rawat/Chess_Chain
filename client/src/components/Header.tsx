import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Crown, Menu, X, Trophy, GamepadIcon, Users, Wallet, UserPlus } from "lucide-react";
import Web3Modal from "@/components/Web3Modal";
import AuthModal from "@/components/AuthModal";

export default function Header() {
  const [location, setLocation] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [web3ModalOpen, setWeb3ModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const navigation = [
    { name: "Home", href: "/", icon: Crown },
    { name: "Games", href: "/games", icon: GamepadIcon },
    { name: "Leaderboard", href: "/leaderboard", icon: Trophy },
    { name: "Community", href: "/community", icon: Users },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/20 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8">
        {/* Logo */}
        <div className="flex lg:flex-1">
          <button
            onClick={() => setLocation("/")}
            className="flex items-center space-x-2 -m-1.5 p-1.5"
          >
            <div className="relative">
              <Crown className="h-8 w-8 text-amber-400" />
              <div className="absolute inset-0 blur-sm bg-amber-400/20 rounded-full"></div>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent">
              ChessChain
            </span>
          </button>
        </div>

        {/* Mobile menu button */}
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-white/70 hover:text-white transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="sr-only">Open main menu</span>
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Desktop navigation */}
        <div className="hidden lg:flex lg:gap-x-8">
          {navigation.map((item) => {
            const isActive = location === item.href;
            const Icon = item.icon;
            return (
              <button
                key={item.name}
                onClick={() => setLocation(item.href)}
                className={`group flex items-center space-x-2 text-sm font-semibold leading-6 transition-all duration-200 ${
                  isActive
                    ? "text-amber-400"
                    : "text-white/70 hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{item.name}</span>
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full"></div>
                )}
              </button>
            );
          })}
        </div>

        {/* Connect Wallet and Sign In Buttons */}
        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:items-center lg:space-x-3">
          <Button
            variant="ghost"
            onClick={() => setAuthModalOpen(true)}
            className="text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Sign In
          </Button>
          <Button
            variant="outline"
            onClick={() => setWeb3ModalOpen(true)}
            className="group relative overflow-hidden border-amber-400/30 bg-amber-400/10 text-amber-400 hover:bg-amber-400/20 hover:text-amber-300 transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-amber-400/0 via-amber-400/10 to-amber-400/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            <Wallet className="h-4 w-4 mr-2 relative" />
            <span className="relative">Connect Wallet</span>
          </Button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden">
          <div className="fixed inset-0 z-50"></div>
          <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-black/95 backdrop-blur-xl px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-white/10">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setLocation("/")}
                className="flex items-center space-x-2 -m-1.5 p-1.5"
              >
                <Crown className="h-8 w-8 text-amber-400" />
                <span className="text-xl font-bold bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent">
                  ChessChain
                </span>
              </button>
              <button
                type="button"
                className="-m-2.5 rounded-md p-2.5 text-white/70 hover:text-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-white/10">
                <div className="space-y-2 py-6">
                  {navigation.map((item) => {
                    const Icon = item.icon;
                    const isActive = location === item.href;
                    return (
                      <button
                        key={item.name}
                        onClick={() => {
                          setLocation(item.href);
                          setMobileMenuOpen(false);
                        }}
                        className={`group flex w-full items-center space-x-3 rounded-lg px-3 py-2 text-base font-semibold leading-7 transition-all duration-200 ${
                          isActive
                            ? "bg-amber-400/10 text-amber-400"
                            : "text-white/70 hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        <span>{item.name}</span>
                      </button>
                    );
                  })}
                </div>
                <div className="py-6 space-y-3">
                  <Button
                    variant="outline"
                    className="w-full border-white/20 bg-white/5 text-white hover:bg-white/10"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setAuthModalOpen(true);
                    }}
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Sign In
                  </Button>
                  <Button
                    className="w-full bg-gradient-to-r from-amber-400 to-yellow-500 text-black hover:from-amber-500 hover:to-yellow-600 transition-all duration-300"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setWeb3ModalOpen(true);
                    }}
                  >
                    <Wallet className="h-4 w-4 mr-2" />
                    Connect Wallet
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Web3 Modal */}
      <Web3Modal 
        isOpen={web3ModalOpen} 
        onClose={() => setWeb3ModalOpen(false)} 
      />

      {/* Auth Modal */}
      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
      />
    </header>
  );
}
