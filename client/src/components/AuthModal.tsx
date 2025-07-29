import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Crown, Mail, Lock, User, Eye, EyeOff, Shield, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate authentication
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: isLogin ? "Welcome Back! 👑" : "Account Created! 🎉",
        description: isLogin 
          ? "Successfully signed in to ChessChain" 
          : "Your chess journey begins now!",
      });
      onClose();
    }, 2000);
  };

  const handleGoogleAuth = () => {
    toast({
      title: "Coming Soon! 🚀",
      description: "Google authentication will be available soon",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-slate-900 via-purple-900/50 to-slate-900 border border-amber-500/20 backdrop-blur-xl overflow-hidden">
        {/* Floating Chess Pieces Background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-4 left-4 text-4xl text-white/5 animate-bounce" style={{animationDelay: '0s', animationDuration: '8s'}}>♔</div>
          <div className="absolute top-8 right-8 text-3xl text-white/5 animate-bounce" style={{animationDelay: '2s', animationDuration: '6s'}}>♕</div>
          <div className="absolute bottom-8 left-8 text-3xl text-white/5 animate-bounce" style={{animationDelay: '4s', animationDuration: '7s'}}>♗</div>
          <div className="absolute bottom-4 right-4 text-2xl text-white/5 animate-bounce" style={{animationDelay: '6s', animationDuration: '9s'}}>♘</div>
        </div>

        <DialogHeader className="relative">
          <div className="flex items-center justify-center space-x-3 mb-2">
            <div className="relative">
              <Crown className="h-10 w-10 text-amber-400" />
              <div className="absolute inset-0 blur-sm bg-amber-400/20 rounded-full animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 bg-clip-text text-transparent">
                Chess Chain
              </h1>
            </div>
          </div>
          <DialogTitle className="text-xl font-bold text-white text-center">
            {isLogin ? "Welcome Back" : "Create an Account"}
          </DialogTitle>
          <DialogDescription className="text-gray-400 text-center">
            {isLogin 
              ? "Enter your credentials to access your chess kingdom" 
              : "Join the future of competitive chess on blockchain"
            }
          </DialogDescription>
        </DialogHeader>

        <Card className="bg-white/5 border-white/10 backdrop-blur-sm relative">
          <CardContent className="p-6 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-white font-medium">
                    Username
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="username"
                      type="text"
                      placeholder="Choose your chess name"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      className="pl-10 bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-amber-400/50 focus:ring-amber-400/20"
                      required={!isLogin}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-white font-medium">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@domain.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-amber-400/50 focus:ring-amber-400/20"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-white font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="pl-10 pr-10 bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-amber-400/50 focus:ring-amber-400/20"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-amber-400 to-yellow-500 text-black hover:from-amber-500 hover:to-yellow-600 transition-all duration-300 font-semibold py-3 shadow-lg hover:shadow-amber-500/25"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
                    <span>{isLogin ? "Signing in..." : "Creating account..."}</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <Sparkles className="h-4 w-4" />
                    <span>{isLogin ? "Sign in with email" : "Create account"}</span>
                  </div>
                )}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full bg-white/20" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-gradient-to-br from-slate-900 via-purple-900/50 to-slate-900 px-2 text-gray-400">
                  or continue with
                </span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={handleGoogleAuth}
              className="w-full border-white/20 bg-white/5 text-white hover:bg-white/10 hover:border-white/30 transition-all duration-300"
            >
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 bg-white rounded-sm flex items-center justify-center">
                  <span className="text-black font-bold text-xs">G</span>
                </div>
                <span>Google</span>
              </div>
            </Button>

            <div className="text-center space-y-4">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-gray-400 hover:text-amber-400 transition-colors"
              >
                {isLogin 
                  ? "Don't have an account? Sign up" 
                  : "Already have an account? Sign in"
                }
              </button>

              {isLogin && (
                <button
                  type="button"
                  className="block w-full text-sm text-gray-400 hover:text-amber-400 transition-colors"
                >
                  Forgot your password?
                </button>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="pt-4 border-t border-white/10 relative">
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-400">
            <Shield className="h-4 w-4" />
            <span>Your data is encrypted and secure</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
