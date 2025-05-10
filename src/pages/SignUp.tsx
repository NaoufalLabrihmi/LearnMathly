import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const { signup, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !confirmPassword || !username) {
      toast.error("Please fill in all fields");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    const result = await signup(username, email, password);
    if (!result.error) {
      toast.success("Account created!");
      navigate("/");
    } else {
      toast.error(result.error);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-100/80 via-fuchsia-100/70 to-teal-100/80 animate-fade-in-fast">
      <div className="absolute top-8 left-8">
        <Link to="/" className="text-blue-700 hover:underline font-semibold text-base flex items-center gap-2">
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" /></svg>
          Back to Home
        </Link>
      </div>
      <div className="relative w-full max-w-lg rounded-3xl bg-white/80 shadow-2xl backdrop-blur-xl p-10 animate-glow-card transition-all duration-500 flex flex-col items-center justify-center">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Create your <span className="bg-gradient-to-r from-edu-purple to-edu-blue bg-clip-text text-transparent">LearnMathly</span> Teacher Account
          </h1>
          <p className="mt-2 text-gray-600">Sign up to get started</p>
        </div>
        <Card className="bg-transparent shadow-none border-0">
          <CardHeader>
            <CardTitle>Sign Up</CardTitle>
            <CardDescription>
              Enter your email and password to create your teacher account
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                type="submit" 
                className="w-full btn-primary"
                disabled={isLoading}
              >
                {isLoading ? "Signing up..." : "Sign up"}
              </Button>
            </CardFooter>
          </form>
        </Card>
        <div className="text-center mt-4">
          <span className="text-gray-600">Already have an account? </span>
          <Link to="/login" className="text-edu-purple font-semibold hover:underline">Sign In</Link>
        </div>
      </div>
    </div>
  );
} 