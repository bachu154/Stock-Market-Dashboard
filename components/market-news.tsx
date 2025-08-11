"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Newspaper, Clock, ExternalLink } from "lucide-react"

interface NewsItem {
  id: number
  title: string
  summary: string
  source: string
  timestamp: string
  category: "market" | "company" | "economic" | "tech"
  impact: "high" | "medium" | "low"
}

// Mock news data generator
const generateMockNews = (): NewsItem[] => [
  {
    id: 1,
    title: "Federal Reserve Signals Potential Rate Changes",
    summary: "The Fed indicates possible monetary policy adjustments in response to current economic indicators.",
    source: "Financial Times",
    timestamp: "2 hours ago",
    category: "economic",
    impact: "high",
  },
  {
    id: 2,
    title: "Tech Sector Shows Strong Q4 Performance",
    summary: "Major technology companies report better-than-expected earnings for the fourth quarter.",
    source: "Reuters",
    timestamp: "4 hours ago",
    category: "tech",
    impact: "medium",
  },
  {
    id: 3,
    title: "Oil Prices Surge on Supply Concerns",
    summary: "Crude oil futures climb as geopolitical tensions raise supply disruption fears.",
    source: "Bloomberg",
    timestamp: "6 hours ago",
    category: "market",
    impact: "high",
  },
  {
    id: 4,
    title: "Electric Vehicle Sales Hit Record High",
    summary: "EV manufacturers report unprecedented sales figures, driving stock prices higher.",
    source: "Wall Street Journal",
    timestamp: "8 hours ago",
    category: "company",
    impact: "medium",
  },
  {
    id: 5,
    title: "Inflation Data Beats Expectations",
    summary: "Latest CPI figures come in lower than anticipated, boosting market sentiment.",
    source: "CNBC",
    timestamp: "12 hours ago",
    category: "economic",
    impact: "high",
  },
]

export function MarketNews() {
  const [news, setNews] = useState<NewsItem[]>([])

  useEffect(() => {
    // Simulate fetching news
    setNews(generateMockNews())
  }, [])

  const getCategoryColor = (category: string) => {
    const colors = {
      market: "bg-blue-100 text-blue-800",
      company: "bg-green-100 text-green-800",
      economic: "bg-purple-100 text-purple-800",
      tech: "bg-orange-100 text-orange-800",
    }
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  const getImpactColor = (impact: string) => {
    const colors = {
      high: "bg-red-100 text-red-800",
      medium: "bg-yellow-100 text-yellow-800",
      low: "bg-green-100 text-green-800",
    }
    return colors[impact as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Newspaper className="h-5 w-5 text-blue-600" />
          <span>Market News</span>
          <Badge variant="secondary" className="bg-red-100 text-red-800">
            Live
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96">
          <div className="space-y-4">
            {news.map((item) => (
              <div key={item.id} className="border-b border-gray-100 pb-4 last:border-b-0">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className={`text-xs ${getCategoryColor(item.category)}`}>
                      {item.category.toUpperCase()}
                    </Badge>
                    <Badge variant="secondary" className={`text-xs ${getImpactColor(item.impact)}`}>
                      {item.impact.toUpperCase()} IMPACT
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-1 text-xs text-gray-500">
                    <Clock className="h-3 w-3" />
                    <span>{item.timestamp}</span>
                  </div>
                </div>

                <h3 className="font-medium text-sm mb-2 hover:text-blue-600 cursor-pointer">{item.title}</h3>

                <p className="text-xs text-gray-600 mb-2 line-clamp-2">{item.summary}</p>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">{item.source}</span>
                  <ExternalLink className="h-3 w-3 text-gray-400 cursor-pointer hover:text-blue-600" />
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
