"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sun, Zap, Users, Award, Wallet, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  const router = useRouter();
  const { user, logout, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState("home");

  const handleNavigation = (tab: string) => {
    setActiveTab(tab);
    if (tab !== "home") {
      router.push(`/${tab}`);
    }
  };

  const handleLogout = () => {
    logout();
  };

  // Auto-redirect to auth page for proper user journey
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return (
      <div className="gradient-bg flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="flex items-center justify-center gap-3 mb-8">
            <Sun className="h-12 w-12 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">
              HeliosHash DAO
            </h1>
          </div>
          <p className="text-lg text-muted-foreground mb-8">
            Redirecting to authentication...
          </p>
          <div className="animate-spin mx-auto">
            <Sun className="h-6 w-6 text-primary" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="gradient-bg pb-20">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-4">
            <Sun className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                HeliosHash
              </h1>
              <p className="text-muted-foreground">
                Solar Energy DAO
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="font-medium text-foreground">{user?.name}</div>
                <div className="text-sm text-muted-foreground">{user?.email}</div>
              </div>
              <Avatar>
                <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
              </Avatar>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
          <Card className="minimal-card p-6 india-saffron">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Projects</p>
                <p className="text-2xl font-bold">24</p>
              </div>
              <Sun className="h-8 w-8 text-foreground/80" />
            </div>
          </Card>
          
          <Card className="minimal-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Energy</p>
                <p className="text-2xl font-bold text-foreground">2.4 MW</p>
              </div>
              <Zap className="h-8 w-8 text-primary/60" />
            </div>
          </Card>
          
          <Card className="minimal-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Members</p>
                <p className="text-2xl font-bold text-foreground">1,234</p>
              </div>
              <Users className="h-8 w-8 text-primary/60" />
            </div>
          </Card>
          
          <Card className="minimal-card p-6 india-green">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Rewards</p>
                <p className="text-2xl font-bold">₹45.2L</p>
              </div>
              <Award className="h-8 w-8 text-foreground/80" />
            </div>
          </Card>
        </div>

        {/* Main Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="minimal-card p-6 cursor-pointer hover:border-primary/50 transition-colors" onClick={() => handleNavigation("mining")}>
            <div className="text-center">
              <Sun className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Solar Mining</h3>
              <p className="text-muted-foreground mb-4">Support solar infrastructure and earn rewards</p>
              <Button variant="outline" className="w-full">
                Start Mining
              </Button>
            </div>
          </Card>

          <Card className="minimal-card p-6 cursor-pointer hover:border-primary/50 transition-colors" onClick={() => handleNavigation("community")}>
            <div className="text-center">
              <Users className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Community</h3>
              <p className="text-muted-foreground mb-4">Join discussions and shape the future</p>
              <Button variant="outline" className="w-full">
                Join Community
              </Button>
            </div>
          </Card>

          <Card className="minimal-card p-6 cursor-pointer hover:border-primary/50 transition-colors" onClick={() => handleNavigation("community")}>
            <div className="text-center">
              <Award className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Governance</h3>
              <p className="text-muted-foreground mb-4">Participate in DAO decision-making</p>
              <Button variant="outline" className="w-full">
                View Proposals
              </Button>
            </div>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="minimal-card p-6">
          <h2 className="text-xl font-semibold text-foreground mb-6">Recent Activity</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/30">
              <div className="w-2 h-2 india-saffron rounded-full"></div>
              <div className="flex-1">
                <p className="text-foreground font-medium">New solar project approved in Gujarat</p>
                <p className="text-sm text-muted-foreground">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/30">
              <div className="w-2 h-2 india-green rounded-full"></div>
              <div className="flex-1">
                <p className="text-foreground font-medium">DAO proposal #42 passed with 89% approval</p>
                <p className="text-sm text-muted-foreground">5 hours ago</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/30">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <div className="flex-1">
                <p className="text-foreground font-medium">Rewards distributed for Q4 2023</p>
                <p className="text-sm text-muted-foreground">1 day ago</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-card/80 backdrop-blur-md border-t border-border">
        <div className="grid grid-cols-5 gap-1 p-2 max-w-md mx-auto">
          <Button 
            variant={activeTab === "home" ? "default" : "ghost"} 
            className="flex flex-col items-center gap-1 h-auto py-3"
            onClick={() => handleNavigation("home")}
          >
            <Sun className="h-5 w-5" />
            <span className="text-xs">Home</span>
          </Button>
          <Button 
            variant={activeTab === "mining" ? "default" : "ghost"} 
            className="flex flex-col items-center gap-1 h-auto py-3"
            onClick={() => handleNavigation("mining")}
          >
            <Zap className="h-5 w-5" />
            <span className="text-xs">Mining</span>
          </Button>
          <Button 
            variant={activeTab === "community" ? "default" : "ghost"} 
            className="flex flex-col items-center gap-1 h-auto py-3"
            onClick={() => handleNavigation("community")}
          >
            <Users className="h-5 w-5" />
            <span className="text-xs">Community</span>
          </Button>
          <Button 
            variant={activeTab === "rewards" ? "default" : "ghost"} 
            className="flex flex-col items-center gap-1 h-auto py-3"
            onClick={() => handleNavigation("rewards")}
          >
            <Award className="h-5 w-5" />
            <span className="text-xs">Rewards</span>
          </Button>
          <Button 
            variant={activeTab === "wallet" ? "default" : "ghost"} 
            className="flex flex-col items-center gap-1 h-auto py-3"
            onClick={() => handleNavigation("wallet")}
          >
            <Wallet className="h-5 w-5" />
            <span className="text-xs">Wallet</span>
          </Button>
        </div>
      </div>
    </div>
  );
}