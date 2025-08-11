"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Heart, HeartOff, TrendingUp, TrendingDown, Star } from "lucide-react"
import { useStockPrices } from "@/hooks/use-stock-data"
import type { CompanyInfo } from "@/lib/stock-data"

interface WatchlistProps {
  companies: CompanyInfo[]
  onSelectCompany: (company: CompanyInfo) => void
}

export function Watchlist({ companies, onSelectCompany }: WatchlistProps) {
  const [watchlist, setWatchlist] = useState<number[]>([])
  const { prices } = useStockPrices()

  // Load watchlist from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("stock-watchlist")
    if (saved) {
      setWatchlist(JSON.parse(saved))
    }
  }, [])

  // Save watchlist to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("stock-watchlist", JSON.stringify(watchlist))
  }, [watchlist])

  const toggleWatchlist = (companyId: number) => {
    setWatchlist((prev) => (prev.includes(companyId) ? prev.filter((id) => id !== companyId) : [...prev, companyId]))
  }

  const watchlistCompanies = companies.filter((company) => watchlist.includes(company.id))

  const getTopMovers = () => {
    return companies
      .map((company) => ({
        ...company,
        priceData: prices[company.symbol],
      }))
      .filter((company) => company.priceData)
      .sort((a, b) => Math.abs(b.priceData.changePercent) - Math.abs(a.priceData.changePercent))
      .slice(0, 5)
  }

  const topMovers = getTopMovers()

  return (
    <div className="space-y-4">
      {/* Watchlist */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Heart className="h-5 w-5 text-red-500" />
            <span>My Watchlist</span>
            <Badge variant="secondary">{watchlist.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {watchlistCompanies.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              <Heart className="h-8 w-8 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">No companies in watchlist</p>
              <p className="text-xs">Click the heart icon to add companies</p>
            </div>
          ) : (
            <ScrollArea className="h-48">
              <div className="space-y-2">
                {watchlistCompanies.map((company) => {
                  const priceData = prices[company.symbol]
                  const isPositive = priceData?.change >= 0

                  return (
                    <div key={company.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleWatchlist(company.id)}
                          className="p-1 h-auto"
                        >
                          <HeartOff className="h-4 w-4 text-red-500" />
                        </Button>
                        <div>
                          <p className="font-medium text-sm">{company.symbol}</p>
                          <p className="text-xs text-gray-600 truncate">{company.name}</p>
                        </div>
                      </div>
                      {priceData && (
                        <div className="text-right">
                          <p className="text-sm font-medium">${priceData.price.toFixed(2)}</p>
                          <div className="flex items-center space-x-1">
                            {isPositive ? (
                              <TrendingUp className="h-3 w-3 text-green-600" />
                            ) : (
                              <TrendingDown className="h-3 w-3 text-red-600" />
                            )}
                            <span className={`text-xs ${isPositive ? "text-green-600" : "text-red-600"}`}>
                              {isPositive ? "+" : ""}
                              {priceData.changePercent.toFixed(2)}%
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      {/* Top Movers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Star className="h-5 w-5 text-yellow-500" />
            <span>Top Movers</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {topMovers.map((company, index) => {
              const isPositive = company.priceData.change >= 0

              return (
                <div
                  key={company.id}
                  className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                  onClick={() => onSelectCompany(company)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-medium text-gray-500">#{index + 1}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleWatchlist(company.id)
                        }}
                        className="p-1 h-auto"
                      >
                        {watchlist.includes(company.id) ? (
                          <HeartOff className="h-4 w-4 text-red-500" />
                        ) : (
                          <Heart className="h-4 w-4 text-gray-400" />
                        )}
                      </Button>
                    </div>
                    <div>
                      <p className="font-medium text-sm">{company.symbol}</p>
                      <p className="text-xs text-gray-600">{company.sector}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">${company.priceData.price.toFixed(2)}</p>
                    <div className="flex items-center space-x-1">
                      {isPositive ? (
                        <TrendingUp className="h-3 w-3 text-green-600" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-red-600" />
                      )}
                      <span className={`text-xs font-medium ${isPositive ? "text-green-600" : "text-red-600"}`}>
                        {isPositive ? "+" : ""}
                        {company.priceData.changePercent.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
