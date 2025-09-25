"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Sun, Users, Wallet, Shield, ArrowRight, Chrome, Globe, Compass } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface WalletOption {
  name: string;
  icon: any;
  description: string;
  color: string;
}

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const walletOptions: WalletOption[] = [
    {
      name: "Plug Wallet",
      icon: Wallet,
      description: "Popular wallet for Internet Computer",
      color: "text-blue-600"
    },
    {
      name: "Stoic Wallet",
      icon: Wallet,
      description: "Secure and user-friendly",
      color: "text-green-600"
    },
    {
      name: "NFID",
      icon: Shield,
      description: "Internet Identity provider",
      color: "text-purple-600"
    },
    {
      name: "Bitfinity",
      icon: Wallet,
      description: "Multi-chain wallet support",
      color: "text-orange-600"
    }
  ];

  const handleInternetIdentity = async () => {
    try {
      await login("internet-identity");
      router.push("/");
    } catch (error) {
      console.error("Internet Identity login failed:", error);
    }
  };

  const handleWalletConnect = async (walletName: string) => {
    try {
      await login("wallet", { walletName });
      router.push("/");
    } catch (error) {
      console.error("Wallet connection failed:", error);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login("email", { email, password });
      router.push("/");
    } catch (error) {
      console.error("Email login failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-orange-500 to-orange-600 transform -skew-y-3 origin-top-left opacity-20"></div>
        <div className="absolute top-32 left-0 w-full h-32 bg-white transform -skew-y-3 origin-top-left opacity-10"></div>
        <div className="absolute top-64 left-0 w-full h-32 bg-gradient-to-r from-green-500 to-green-600 transform -skew-y-3 origin-top-left opacity-20"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sun className="h-8 w-8 text-orange-500" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 via-green-600 to-orange-600 bg-clip-text text-transparent">
              HeliosHash DAO
            </h1>
          </div>
          <p className="text-gray-600">Welcome to India's Solar Energy DAO</p>
          <Badge variant="secondary" className="mt-2 bg-orange-100 text-orange-800">
            Powered by Internet Computer
          </Badge>
        </div>

        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Sign In</CardTitle>
            <CardDescription className="text-center">
              Choose your preferred authentication method
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="internet-identity" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="internet-identity" className="text-xs">
                  Internet ID
                </TabsTrigger>
                <TabsTrigger value="wallets" className="text-xs">
                  Wallets
                </TabsTrigger>
                <TabsTrigger value="email" className="text-xs">
                  Email
                </TabsTrigger>
              </TabsList>

              <TabsContent value="internet-identity" className="space-y-4">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
                    <Shield className="h-8 w-8 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Internet Identity</h3>
                    <p className="text-sm text-gray-600">
                      Secure, anonymous authentication powered by Internet Computer
                    </p>
                  </div>
                  <Button 
                    onClick={handleInternetIdentity}
                    disabled={isLoading}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    {isLoading ? "Connecting..." : "Connect with Internet Identity"}
                  </Button>
                  <div className="text-xs text-gray-500 space-y-1">
                    <div className="flex items-center justify-center gap-2">
                      <Chrome className="h-4 w-4" />
                      <span>Chrome</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <Globe className="h-4 w-4" />
                      <span>Firefox</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <Compass className="h-4 w-4" />
                      <span>Safari</span>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="wallets" className="space-y-4">
                <div className="space-y-3">
                  <h3 className="font-semibold text-center">Connect Your Wallet</h3>
                  {walletOptions.map((wallet) => (
                    <Button
                      key={wallet.name}
                      variant="outline"
                      className="w-full justify-start h-auto p-4"
                      onClick={() => handleWalletConnect(wallet.name)}
                      disabled={isLoading}
                    >
                      <div className="flex items-center gap-3">
                        <wallet.icon className={`h-6 w-6 ${wallet.color}`} />
                        <div className="text-left">
                          <div className="font-medium">{wallet.name}</div>
                          <div className="text-xs text-gray-500">{wallet.description}</div>
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="email" className="space-y-4">
                <form onSubmit={handleEmailLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
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
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-green-600 hover:bg-green-700"
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing In..." : "Sign In"}
                  </Button>
                  <div className="text-center">
                    <Button variant="link" className="text-sm">
                      Forgot password?
                    </Button>
                  </div>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-6 pt-6 border-t">
              <div className="text-center space-y-2">
                <p className="text-sm text-gray-600">
                  Don't have an account?
                </p>
                <Button variant="outline" className="w-full">
                  Sign Up
                </Button>
              </div>
            </div>

            <div className="mt-4 text-center">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => router.push("/")}
                className="flex items-center gap-2"
              >
                <ArrowRight className="h-4 w-4 rotate-180" />
                Back to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}