'use client'
import { useState } from 'react'
import { Coins, ShoppingBag, Plane, Hotel, Utensils, Gift, ShoppingCart, ArrowRight, CheckCircle2, AlertCircle, Zap, TrendingUp, Package } from 'lucide-react'

interface ExchangeOption {
  id: string
  name: string
  category: 'travel' | 'hotel' | 'food' | 'ecommerce' | 'services'
  icon: React.ComponentType<Record<string, unknown>>
  exchangeRate: number // HHU tokens per unit
  unit: string
  minAmount: number
  maxAmount: number
  description: string
  availability: 'available' | 'limited' | 'coming-soon'
  discount?: number
}

const exchangeOptions: ExchangeOption[] = [
  {
    id: 'flipkart',
    name: 'Flipkart Voucher',
    category: 'ecommerce',
    icon: ShoppingBag,
    exchangeRate: 10,
    unit: '₹100 voucher',
    minAmount: 100,
    maxAmount: 10000,
    description: 'Exchange HHU tokens for Flipkart shopping vouchers',
    availability: 'available',
    discount: 5
  },
  {
    id: 'amazon',
    name: 'Amazon Gift Card',
    category: 'ecommerce',
    icon: Package,
    exchangeRate: 10,
    unit: '₹100 gift card',
    minAmount: 100,
    maxAmount: 10000,
    description: 'Get Amazon gift cards to shop for anything',
    availability: 'available',
    discount: 5
  },
  {
    id: 'flight',
    name: 'Flight Booking Credit',
    category: 'travel',
    icon: Plane,
    exchangeRate: 15,
    unit: '₹100 credit',
    minAmount: 500,
    maxAmount: 50000,
    description: 'Book flights with MakeMyTrip, Goibibo partners',
    availability: 'available',
    discount: 10
  },
  {
    id: 'hotel',
    name: 'Hotel Booking Credit',
    category: 'hotel',
    icon: Hotel,
    exchangeRate: 12,
    unit: '₹100 credit',
    minAmount: 500,
    maxAmount: 25000,
    description: 'Book hotels and stays across India',
    availability: 'available',
    discount: 8
  },
  {
    id: 'zomato',
    name: 'Zomato Voucher',
    category: 'food',
    icon: Utensils,
    exchangeRate: 8,
    unit: '₹100 voucher',
    minAmount: 100,
    maxAmount: 5000,
    description: 'Order food from thousands of restaurants',
    availability: 'available',
    discount: 12
  },
  {
    id: 'swiggy',
    name: 'Swiggy Voucher',
    category: 'food',
    icon: Utensils,
    exchangeRate: 8,
    unit: '₹100 voucher',
    minAmount: 100,
    maxAmount: 5000,
    description: 'Food delivery vouchers for Swiggy',
    availability: 'available',
    discount: 12
  },
  {
    id: 'uber',
    name: 'Uber Credits',
    category: 'travel',
    icon: ArrowRight,
    exchangeRate: 9,
    unit: '₹100 credit',
    minAmount: 100,
    maxAmount: 3000,
    description: 'Get Uber ride credits',
    availability: 'limited'
  },
  {
    id: 'bigbasket',
    name: 'BigBasket Voucher',
    category: 'ecommerce',
    icon: ShoppingCart,
    exchangeRate: 10,
    unit: '₹100 voucher',
    minAmount: 200,
    maxAmount: 5000,
    description: 'Groceries and daily essentials',
    availability: 'available',
    discount: 5
  }
]

interface TokenExchangeHubProps {
  userBalance: number
  onNavigate?: (stage: string) => void
}

export default function TokenExchangeHub({ userBalance = 2450, onNavigate }: TokenExchangeHubProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedOption, setSelectedOption] = useState<ExchangeOption | null>(null)
  const [exchangeAmount, setExchangeAmount] = useState<number>(100)
  const [showConfirmation, setShowConfirmation] = useState(false)
  // `onNavigate` is currently unused in this component; reference it to avoid lint error
  void onNavigate

  const categories = [
    { id: 'all', label: 'All', icon: Gift },
    { id: 'ecommerce', label: 'E-Commerce', icon: ShoppingBag },
    { id: 'travel', label: 'Travel', icon: Plane },
    { id: 'hotel', label: 'Hotels', icon: Hotel },
    { id: 'food', label: 'Food', icon: Utensils }
  ]

  const filteredOptions = selectedCategory === 'all' 
    ? exchangeOptions 
    : exchangeOptions.filter(opt => opt.category === selectedCategory)

  const calculateTokensNeeded = (amount: number, rate: number) => {
    return Math.ceil((amount / 100) * rate)
  }

  const handleExchange = () => {
    if (!selectedOption) return
    const tokensNeeded = calculateTokensNeeded(exchangeAmount, selectedOption.exchangeRate)
    if (tokensNeeded <= userBalance) {
      setShowConfirmation(true)
      setTimeout(() => {
        setShowConfirmation(false)
        setSelectedOption(null)
        setExchangeAmount(100)
      }, 3000)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Token Exchange Hub
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Exchange your HHU tokens for vouchers, credits, and more
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 dark:text-gray-400">Your Balance</p>
              <div className="flex items-center gap-2">
                <Coins className="w-6 h-6 text-amber-500" />
                <span className="text-3xl font-bold text-gray-900 dark:text-white">
                  {userBalance.toLocaleString()}
                </span>
                <span className="text-gray-600 dark:text-gray-400">HHU</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-green-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Total Exchanged</span>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">1,240 HHU</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-2">
                <Gift className="w-5 h-5 text-purple-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Vouchers Claimed</span>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">8</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-5 h-5 text-amber-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Avg. Savings</span>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">8%</p>
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map(cat => {
              const Icon = cat.icon
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                    selectedCategory === cat.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {cat.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Exchange Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredOptions.map(option => {
            const Icon = option.icon
            return (
              <div
                key={option.id}
                className={`bg-white dark:bg-gray-800 rounded-xl p-6 border-2 transition-all cursor-pointer ${
                  selectedOption?.id === option.id
                    ? 'border-blue-500 shadow-lg'
                    : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700'
                }`}
                onClick={() => setSelectedOption(option)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                      <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{option.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{option.unit}</p>
                    </div>
                  </div>
                  {option.discount && (
                    <span className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs font-semibold px-2 py-1 rounded">
                      {option.discount}% OFF
                    </span>
                  )}
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{option.description}</p>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-500">Exchange Rate</p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {option.exchangeRate} HHU = ₹100
                    </p>
                  </div>
                  <div className={`px-3 py-1 rounded text-xs font-medium ${
                    option.availability === 'available' 
                      ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                      : option.availability === 'limited'
                      ? 'bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                  }`}>
                    {option.availability === 'available' ? 'Available' : option.availability === 'limited' ? 'Limited' : 'Coming Soon'}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Exchange Panel */}
        {selectedOption && (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Exchange Tokens for {selectedOption.name}
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Voucher Amount (₹)
                </label>
                <input
                  type="number"
                  min={selectedOption.minAmount}
                  max={selectedOption.maxAmount}
                  step={100}
                  value={exchangeAmount}
                  onChange={(e) => setExchangeAmount(Math.max(selectedOption.minAmount, Math.min(selectedOption.maxAmount, Number(e.target.value))))}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Min: ₹{selectedOption.minAmount} • Max: ₹{selectedOption.maxAmount}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tokens Required
                </label>
                <div className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900">
                  <div className="flex items-center gap-2">
                    <Coins className="w-5 h-5 text-amber-500" />
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                      {calculateTokensNeeded(exchangeAmount, selectedOption.exchangeRate)}
                    </span>
                    <span className="text-gray-600 dark:text-gray-400">HHU</span>
                  </div>
                </div>
                {calculateTokensNeeded(exchangeAmount, selectedOption.exchangeRate) > userBalance && (
                  <div className="flex items-center gap-2 mt-2 text-red-600 dark:text-red-400">
                    <AlertCircle className="w-4 h-4" />
                    <p className="text-xs">Insufficient balance</p>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 flex gap-4">
              <button
                onClick={handleExchange}
                disabled={calculateTokensNeeded(exchangeAmount, selectedOption.exchangeRate) > userBalance}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                Exchange Tokens
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => setSelectedOption(null)}
                className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Confirmation Message */}
        {showConfirmation && (
          <div className="fixed bottom-8 right-8 bg-green-600 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 animate-slide-up">
            <CheckCircle2 className="w-6 h-6" />
            <div>
              <p className="font-semibold">Exchange Successful!</p>
              <p className="text-sm">Your voucher will be sent to your registered email</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
