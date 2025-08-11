"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { TrendingUp, TrendingDown, DollarSign, BarChart3, Activity, AlertCircle } from "lucide-react"
import { useStockData } from "@/hooks/use-stock-data"
import { AIPredictions } from "@/components/ai-predictions"
import type { CompanyInfo } from "@/lib/stock-data"

interface StockChartProps {
  company: CompanyInfo
}

const timePeriods = [
  { label: "1D", days: 1 },
  { label: "1W", days: 7 },
  { label: "1M", days: 30 },
  { label: "3M", days: 90 },
  { label: "1Y", days: 365 },
]

export function StockChart({ company }: StockChartProps) {
  const [selectedPeriod, setSelectedPeriod] = useState("1M")
  const [chartType, setChartType] = useState<"line" | "area">("area")

  const period = timePeriods.find((p) => p.label === selectedPeriod)
  const { stockData, loading, error } = useStockData(company.symbol, period?.days || 30)

  const chartData = useMemo(() => {
    if (!stockData) return []
    return stockData.historical.map((item) => ({
      ...item,
      dateFormatted: new Date(item.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
    }))
  }, [stockData])

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-2 sm:p-3 border rounded-lg shadow-lg text-xs sm:text-sm">
          <p className="font-medium">{new Date(data.date).toLocaleDateString()}</p>
          <div className="space-y-1">
            <p>
              Open: <span className="font-medium">${data.open.toFixed(2)}</span>
            </p>
            <p>
              High: <span className="font-medium text-green-600">${data.high.toFixed(2)}</span>
            </p>
            <p>
              Low: <span className="font-medium text-red-600">${data.low.toFixed(2)}</span>
            </p>
            <p>
              Close: <span className="font-medium">${data.close.toFixed(2)}</span>
            </p>
            <p>
              Volume: <span className="font-medium">{(data.volume / 1000000).toFixed(1)}M</span>
            </p>
          </div>
        </div>
      )
    }
    return null
  }

  if (error) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <Card>
          <CardContent className="flex items-center justify-center h-48 sm:h-64">
            <div className="text-center">
              <AlertCircle className="h-6 w-6 sm:h-8 sm:w-8 text-red-500 mx-auto mb-2" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (loading || !stockData) {
    return (
      <div className="space-y-4 sm:space-y-6">
        {/* Enhanced responsive loading skeletons for stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-3 sm:p-4">
                <Skeleton className="h-3 sm:h-4 w-16 sm:w-20 mb-2" />
                <Skeleton className="h-6 sm:h-8 w-12 sm:w-16 mb-1" />
                <Skeleton className="h-2 sm:h-3 w-20 sm:w-24" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Loading skeleton for chart */}
        <Card>
          <CardHeader>
            <Skeleton className="h-5 sm:h-6 w-32 sm:w-48" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 sm:h-80 lg:h-[400px] w-full" />
          </CardContent>
        </Card>
      </div>
    )
  }

  const { stats } = stockData
  const isPositive = stats.change >= 0

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Enhanced Responsive Stock Stats Header */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-start space-x-2">
              <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500 mt-1" />
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-gray-600">Current Price</p>
                <p className="text-lg sm:text-2xl font-bold truncate">${stats.currentPrice.toFixed(2)}</p>
                <div className="flex items-center space-x-1">
                  {isPositive ? (
                    <TrendingUp className="h-2 w-2 sm:h-3 sm:w-3 text-green-600 flex-shrink-0" />
                  ) : (
                    <TrendingDown className="h-2 w-2 sm:h-3 sm:w-3 text-red-600 flex-shrink-0" />
                  )}
                  <span
                    className={`text-xs sm:text-sm font-medium truncate ${isPositive ? "text-green-600" : "text-red-600"}`}
                  >
                    {isPositive ? "+" : ""}${stats.change.toFixed(2)} ({isPositive ? "+" : ""}
                    {stats.changePercent.toFixed(2)}%)
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-start space-x-2">
              <Activity className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500 mt-1" />
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-gray-600">52W High</p>
                <p className="text-sm sm:text-lg font-semibold truncate">${stats.high52Week.toFixed(2)}</p>
                <p className="text-xs sm:text-sm text-gray-600">52W Low</p>
                <p className="text-sm sm:text-lg font-semibold truncate">${stats.low52Week.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-start space-x-2">
              <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500 mt-1" />
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-gray-600">Volume</p>
                <p className="text-sm sm:text-lg font-semibold truncate">{(stats.volume / 1000000).toFixed(1)}M</p>
                <p className="text-xs sm:text-sm text-gray-600">Avg Volume</p>
                <p className="text-sm sm:text-lg font-semibold truncate">{(stats.avgVolume / 1000000).toFixed(1)}M</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="min-w-0">
              <p className="text-xs sm:text-sm text-gray-600">Market Cap</p>
              <p className="text-sm sm:text-lg font-semibold truncate">{company.marketCap}</p>
              <p className="text-xs sm:text-sm text-gray-600">P/E Ratio</p>
              <p className="text-sm sm:text-lg font-semibold">{company.pe}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Responsive Chart Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-3 sm:space-y-0">
        <div className="flex flex-wrap gap-1">
          {timePeriods.map((period) => (
            <Button
              key={period.label}
              variant={selectedPeriod === period.label ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedPeriod(period.label)}
              className="text-xs sm:text-sm"
            >
              {period.label}
            </Button>
          ))}
        </div>
        <div className="flex space-x-1">
          <Button
            variant={chartType === "line" ? "default" : "outline"}
            size="sm"
            onClick={() => setChartType("line")}
            className="text-xs sm:text-sm"
          >
            Line
          </Button>
          <Button
            variant={chartType === "area" ? "default" : "outline"}
            size="sm"
            onClick={() => setChartType("area")}
            className="text-xs sm:text-sm"
          >
            Area
          </Button>
        </div>
      </div>

      {/* Enhanced Responsive Main Chart */}
      <Tabs defaultValue="price" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="price" className="text-xs sm:text-sm">
            Price Chart
          </TabsTrigger>
          <TabsTrigger value="volume" className="text-xs sm:text-sm">
            Volume Chart
          </TabsTrigger>
          {/* Added AI Predictions tab */}
          <TabsTrigger value="ai" className="text-xs sm:text-sm">
            AI Predictions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="price" className="space-y-4">
          <Card>
            <CardHeader className="pb-2 sm:pb-4">
              <CardTitle className="text-sm sm:text-lg">
                {company.symbol} - {selectedPeriod} Price Movement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 sm:h-80 lg:h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  {chartType === "area" ? (
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="dateFormatted" tick={{ fontSize: 12 }} interval="preserveStartEnd" />
                      <YAxis domain={["dataMin - 5", "dataMax + 5"]} tick={{ fontSize: 12 }} />
                      <Tooltip content={<CustomTooltip />} />
                      <Area
                        type="monotone"
                        dataKey="close"
                        stroke="#3b82f6"
                        fillOpacity={1}
                        fill="url(#colorPrice)"
                        strokeWidth={2}
                      />
                    </AreaChart>
                  ) : (
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="dateFormatted" tick={{ fontSize: 12 }} interval="preserveStartEnd" />
                      <YAxis domain={["dataMin - 5", "dataMax + 5"]} tick={{ fontSize: 12 }} />
                      <Tooltip content={<CustomTooltip />} />
                      <Line type="monotone" dataKey="close" stroke="#3b82f6" strokeWidth={2} dot={false} />
                    </LineChart>
                  )}
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="volume" className="space-y-4">
          <Card>
            <CardHeader className="pb-2 sm:pb-4">
              <CardTitle className="text-sm sm:text-lg">
                {company.symbol} - {selectedPeriod} Volume
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 sm:h-80 lg:h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="dateFormatted" tick={{ fontSize: 12 }} interval="preserveStartEnd" />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip
                      formatter={(value: number) => [`${(value / 1000000).toFixed(1)}M`, "Volume"]}
                      labelFormatter={(label) => `Date: ${label}`}
                    />
                    <Bar dataKey="volume" fill="#6b7280" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Added AI Predictions tab content */}
        <TabsContent value="ai" className="space-y-4">
          <AIPredictions company={company} currentPrice={stats.currentPrice} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
