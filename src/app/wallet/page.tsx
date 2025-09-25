"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Wallet, Send, Download, TrendingUp, ArrowUpRight, ArrowDownRight, Copy, Gift } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

interface WalletBalance {
  currency: string;
  symbol: string;
  balance: number;
  valueInr: number;
  change24h: number;
  icon: string;
}

interface Transaction {
  id: string;
  type: "send" | "receive" | "mining" | "reward";
  amount: number;
  currency: string;
  timestamp: string;
  status: "completed" | "pending" | "failed";
  address: string;
  description: string;
}

export default function WalletPage() {
  const [balances, setBalances] = useState<WalletBalance[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setBalances([
        {
          currency: "HeliosHash",
          symbol: "HLX",
          balance: 15420.5,
          valueInr: 385512.5,
          change24h: 5.2,
          icon: "⚡"
        },
        {
          currency: "Bitcoin",
          symbol: "BTC",
          balance: 0.025,
          valueInr: 112500,
          change24h: 2.1,
          icon: "₿"
        },
        {
          currency: "Ethereum",
          symbol: "ETH",
          balance: 1.2,
          valueInr: 264000,
          change24h: -1.5,
          icon: "Ξ"
        },
        {
          currency: "Internet Computer",
          symbol: "ICP",
          balance: 45.5,
          valueInr: 22750,
          change24h: 8.7,
          icon: "🔷"
        }
      ]);

      setTransactions([
        {
          id: "1",
          type: "mining",
          amount: 125.5,
          currency: "HLX",
          timestamp: "2 hours ago",
          status: "completed",
          address: "Mining Reward",
          description: "Daily mining rewards"
        },
        {
          id: "2",
          type: "receive",
          amount: 500,
          currency: "HLX",
          timestamp: "5 hours ago",
          status: "completed",
          address: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
          description: "From DAO treasury"
        },
        {
          id: "3",
          type: "send",
          amount: 0.01,
          currency: "BTC",
          timestamp: "1 day ago",
          status: "completed",
          address: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
          description: "To exchange wallet"
        },
        {
          id: "4",
          type: "reward",
          amount: 1000,
          currency: "HLX",
          timestamp: "2 days ago",
          status: "completed",
          address: "Reward System",
          description: "Community participation reward"
        },
        {
          id: "5",
          type: "mining",
          amount: 98.2,
          currency: "HLX",
          timestamp: "3 days ago",
          status: "completed",
          address: "Mining Reward",
          description: "Daily mining rewards"
        }
      ]);

      setLoading(false);
    }, 1000);
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatCrypto = (amount: number, symbol: string) => {
    return `${amount.toFixed(symbol === 'BTC' ? 6 : 2)} ${symbol}`;
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "send": return <ArrowUpRight className="h-4 w-4 text-red-500" />;
      case "receive": return <ArrowDownRight className="h-4 w-4 text-green-500" />;
      case "mining": return <Gift className="h-4 w-4 text-yellow-500" />;
      case "reward": return <TrendingUp className="h-4 w-4 text-purple-500" />;
      default: return <Wallet className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "failed": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const totalValue = balances.reduce((sum, balance) => sum + balance.valueInr, 0);

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Wallet className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold text-foreground">Wallet</h1>
              <p className="text-muted-foreground">Manage your crypto assets</p>
            </div>
          </div>
          <div className="flex gap-2">
            <ThemeToggle />
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Receive
            </Button>
            <Button>
              <Send className="h-4 w-4 mr-2" />
              Send
            </Button>
          </div>
        </div>

        {/* Portfolio Overview */}
        <Card className="minimal-card p-6 mb-8">
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Total Portfolio Value</p>
              <p className="text-3xl font-bold text-foreground">{formatCurrency(totalValue)}</p>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-green-600">+12.5% this month</span>
            </div>
          </div>
        </Card>

        {/* Asset Balances */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {balances.map((balance, index) => (
            <Card key={balance.currency} className={`minimal-card p-6 ${index === 0 ? 'india-saffron' : index === 3 ? 'india-green' : ''}`}>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{balance.icon}</span>
                    <span className={`font-medium ${index === 0 || index === 3 ? '' : 'text-foreground'}`}>{balance.currency}</span>
                  </div>
                  <Badge className={balance.change24h >= 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                    {balance.change24h >= 0 ? "+" : ""}{balance.change24h}%
                  </Badge>
                </div>
                <div>
                  <p className={`text-xl font-bold ${index === 0 || index === 3 ? '' : 'text-foreground'}`}>{formatCrypto(balance.balance, balance.symbol)}</p>
                  <p className={`text-sm ${index === 0 || index === 3 ? 'font-medium' : 'text-muted-foreground'}`}>{formatCurrency(balance.valueInr)}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="transactions" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="remittances">Remittances</TabsTrigger>
            <TabsTrigger value="staking">Staking</TabsTrigger>
            <TabsTrigger value="nfts">NFTs</TabsTrigger>
          </TabsList>

          <TabsContent value="transactions" className="space-y-4">
            <Card className="minimal-card p-6">
              <h2 className="text-xl font-semibold text-foreground mb-6">Recent Transactions</h2>
              <div className="space-y-4">
                {transactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                    <div className="flex items-center gap-3">
                      {getTransactionIcon(transaction.type)}
                      <div>
                        <p className="font-medium text-foreground">{transaction.description}</p>
                        <p className="text-sm text-muted-foreground">{transaction.timestamp}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-foreground">
                        {transaction.type === "send" ? "-" : "+"}
                        {formatCrypto(transaction.amount, transaction.currency)}
                      </p>
                      <div className="flex items-center gap-2 justify-end mt-1">
                        <Badge className={getStatusColor(transaction.status)}>
                          {transaction.status}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="remittances" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="minimal-card p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Send Remittance</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 rounded-lg bg-muted/30">
                      <p className="text-2xl font-bold text-foreground">$0.50</p>
                      <p className="text-sm text-muted-foreground">Transfer Fee</p>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-muted/30">
                      <p className="text-2xl font-bold text-foreground">&lt;5 min</p>
                      <p className="text-sm text-muted-foreground">Delivery Time</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Button className="w-full">Send New Remittance</Button>
                    <Button variant="outline" className="w-full">Save Recipient</Button>
                  </div>
                </div>
              </Card>

              <Card className="minimal-card p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Recent Remittances</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <div className="flex items-center gap-3">
                      <ArrowDownRight className="h-4 w-4 text-green-500" />
                      <div>
                        <p className="font-medium text-foreground">To: Priya Sharma</p>
                        <p className="text-sm text-muted-foreground">2 hours ago</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-foreground">$500</p>
                      <p className="text-sm text-muted-foreground">₹41,250</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <div className="flex items-center gap-3">
                      <ArrowDownRight className="h-4 w-4 text-green-500" />
                      <div>
                        <p className="font-medium text-foreground">To: Rajesh Kumar</p>
                        <p className="text-sm text-muted-foreground">1 day ago</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-foreground">$200</p>
                      <p className="text-sm text-muted-foreground">₹16,500</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            <Card className="minimal-card p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Remittance Statistics</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 rounded-lg bg-muted/30">
                  <p className="text-2xl font-bold text-foreground">$3,450</p>
                  <p className="text-sm text-muted-foreground">Total Sent</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-muted/30">
                  <p className="text-2xl font-bold text-foreground">15</p>
                  <p className="text-sm text-muted-foreground">Transactions</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-muted/30">
                  <p className="text-2xl font-bold text-foreground">₹17.25</p>
                  <p className="text-sm text-muted-foreground">Total Fees</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-muted/30">
                  <p className="text-2xl font-bold text-foreground">4.2</p>
                  <p className="text-sm text-muted-foreground">Avg. Minutes</p>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="staking" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="minimal-card p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Staking Overview</h3>
                <div className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Total Staked</span>
                      <span className="font-medium text-foreground">5,000 HLX</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Daily Rewards</span>
                      <span className="font-medium text-foreground">25 HLX</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">APY</span>
                      <span className="font-medium text-foreground">182.5%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Unstaking Period</span>
                      <span className="font-medium text-foreground">7 days</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Button className="w-full">Stake More</Button>
                    <Button variant="outline" className="w-full">Unstake</Button>
                  </div>
                </div>
              </Card>

              <Card className="minimal-card p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Staking Rewards</h3>
                <div className="space-y-4">
                  <div className="text-center p-4 rounded-lg india-saffron">
                    <p className="text-2xl font-bold">₹45,230</p>
                    <p className="text-sm font-medium">Total Rewards Earned</p>
                  </div>
                  <div className="text-center p-4 rounded-lg india-green">
                    <p className="text-2xl font-bold">₹750</p>
                    <p className="text-sm font-medium">Monthly Average</p>
                  </div>
                  <Button variant="outline" className="w-full">View History</Button>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="nfts" className="space-y-6">
            <Card className="minimal-card p-8 text-center">
              <Gift className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">NFT Collection</h3>
              <p className="text-muted-foreground mb-4">Your NFT collection will appear here</p>
              <Button variant="outline">Explore NFTs</Button>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}