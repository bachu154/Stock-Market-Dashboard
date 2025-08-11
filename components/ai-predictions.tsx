"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Brain, TrendingUp, TrendingDown, Target, Zap, AlertTriangle } from "lucide-react"
import type { CompanyInfo } from "@/lib/stock-data"

interface AIPredictionsProps {
  company: CompanyInfo
  currentPrice: number
}

// Mock AI prediction generator
function generateAIPredictions(symbol: string, currentPrice: number) {
  const baseVariation = (Math.random() - 0.5) * 0.1 // ±5% base variation

  const predictions = {
    nextDay: {
      price: currentPrice * (1 + baseVariation * 0.3),
      confidence: 75 + Math.random() * 20, // 75-95% confidence
      direction: baseVariation > 0 ? "up" : "down",
    },
    nextWeek: {
      price: currentPrice * (1 + baseVariation * 0.7),
      confidence: 65 + Math.random() * 25, // 65-90% confidence
      direction: baseVariation > 0 ? "up" : "down",
    },
    nextMonth: {
      price: currentPrice * (1 + baseVariation * 1.2),
      confidence: 55 + Math.random() * 30, // 55-85% confidence
      direction: baseVariation > 0 ? "up" : "down",
    },
  }

  const technicalIndicators = {
    rsi: 30 + Math.random() * 40, // 30-70 RSI
    macd: (Math.random() - 0.5) * 2, // -1 to 1
    bollinger: Math.random() > 0.5 ? "upper" : "lower",
    sentiment: Math.random() > 0.5 ? "bullish" : "bearish",
  }

  const riskLevel =
    predictions.nextMonth.confidence > 75 ? "low" : predictions.nextMonth.confidence > 60 ? "medium" : "high"

  return { predictions, technicalIndicators, riskLevel }
}

export function AIPredictions({ company, currentPrice }: AIPredictionsProps) {
  const [selectedTimeframe, setSelectedTimeframe] = useState<"nextDay" | "nextWeek" | "nextMonth">("nextDay")

  const aiData = useMemo(() => generateAIPredictions(company.symbol, currentPrice), [company.symbol, currentPrice])

  const { predictions, technicalIndicators, riskLevel } = aiData
  const selectedPrediction = predictions[selectedTimeframe]

  const getRSIStatus = (rsi: number) => {
    if (rsi > 70) return { status: "Overbought", color: "text-red-600", bg: "bg-red-100" }
    if (rsi < 30) return { status: "Oversold", color: "text-green-600", bg: "bg-green-100" }
    return { status: "Neutral", color: "text-gray-600", bg: "bg-gray-100" }
  }

  const rsiStatus = getRSIStatus(technicalIndicators.rsi)

  return (
    <div className="space-y-4 sm:space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-blue-600" />
            <span>AI Price Predictions</span>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              Beta
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedTimeframe} onValueChange={(value) => setSelectedTimeframe(value as any)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="nextDay" className="text-xs sm:text-sm">
                Next Day
              </TabsTrigger>
              <TabsTrigger value="nextWeek" className="text-xs sm:text-sm">
                Next Week
              </TabsTrigger>
              <TabsTrigger value="nextMonth" className="text-xs sm:text-sm">
                Next Month
              </TabsTrigger>
            </TabsList>

            <div className="mt-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600">Predicted Price</p>
                  <p className="text-2xl font-bold">${selectedPrediction.price.toFixed(2)}</p>
                  <div className="flex items-center justify-center space-x-1 mt-1">
                    {selectedPrediction.direction === "up" ? (
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-600" />
                    )}
                    <span
                      className={`text-sm font-medium ${
                        selectedPrediction.direction === "up" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {selectedPrediction.direction === "up" ? "+" : ""}
                      {(((selectedPrediction.price - currentPrice) / currentPrice) * 100).toFixed(2)}%
                    </span>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-sm text-gray-600">Confidence</p>
                  <p className="text-2xl font-bold">{selectedPrediction.confidence.toFixed(0)}%</p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${selectedPrediction.confidence}%` }}
                    ></div>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-sm text-gray-600">Risk Level</p>
                  <Badge
                    variant="secondary"
                    className={`text-sm ${
                      riskLevel === "low"
                        ? "bg-green-100 text-green-800"
                        : riskLevel === "medium"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                    }`}
                  >
                    {riskLevel.toUpperCase()}
                  </Badge>
                  <p className="text-xs text-gray-500 mt-1">Based on volatility analysis</p>
                </div>
              </div>

              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="flex items-start space-x-2">
                  <Zap className="h-4 w-4 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-900">AI Insight</p>
                    <p className="text-xs text-blue-700">
                      Based on technical analysis, market sentiment, and historical patterns,
                      {company.symbol} shows {technicalIndicators.sentiment} signals for the selected timeframe.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Tabs>
        </CardContent>
      </Card>

      {/* Technical Indicators */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5 text-purple-600" />
            <span>Technical Indicators</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">RSI (14)</p>
              <p className="text-xl font-bold">{technicalIndicators.rsi.toFixed(1)}</p>
              <Badge variant="secondary" className={`text-xs ${rsiStatus.bg} ${rsiStatus.color}`}>
                {rsiStatus.status}
              </Badge>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600">MACD</p>
              <p className="text-xl font-bold">{technicalIndicators.macd.toFixed(3)}</p>
              <Badge
                variant="secondary"
                className={`text-xs ${
                  technicalIndicators.macd > 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                }`}
              >
                {technicalIndicators.macd > 0 ? "Bullish" : "Bearish"}
              </Badge>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600">Bollinger Bands</p>
              <p className="text-sm font-medium">
                {technicalIndicators.bollinger === "upper" ? "Near Upper" : "Near Lower"}
              </p>
              <Badge
                variant="secondary"
                className={`text-xs ${
                  technicalIndicators.bollinger === "upper" ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                }`}
              >
                {technicalIndicators.bollinger === "upper" ? "Resistance" : "Support"}
              </Badge>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600">Market Sentiment</p>
              <p className="text-sm font-medium capitalize">{technicalIndicators.sentiment}</p>
              <Badge
                variant="secondary"
                className={`text-xs ${
                  technicalIndicators.sentiment === "bullish"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {technicalIndicators.sentiment === "bullish" ? "Buy Signal" : "Sell Signal"}
              </Badge>
            </div>
          </div>

          <div className="mt-4 bg-yellow-50 p-3 rounded-lg">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-yellow-900">Disclaimer</p>
                <p className="text-xs text-yellow-700">
                  AI predictions and technical indicators are for educational purposes only. Always conduct your own
                  research before making investment decisions.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
