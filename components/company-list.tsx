"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Search, TrendingUp, TrendingDown, AlertCircle } from "lucide-react"
import { useStockPrices } from "@/hooks/use-stock-data"
import type { CompanyInfo } from "@/lib/stock-data"

interface CompanyListProps {
  companies: CompanyInfo[]
  selectedCompany: CompanyInfo | null
  onSelectCompany: (company: CompanyInfo) => void
  loading?: boolean
  error?: string | null
}

export function CompanyList({ companies, selectedCompany, onSelectCompany, loading, error }: CompanyListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const { prices, loading: pricesLoading } = useStockPrices()

  const filteredCompanies = useMemo(() => {
    return companies.filter(
      (company) =>
        company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.sector.toLowerCase().includes(searchTerm.toLowerCase()),
    )
  }, [companies, searchTerm])

  const getSectorColor = (sector: string) => {
    const colors: Record<string, string> = {
      Technology: "bg-blue-100 text-blue-800",
      "Consumer Discretionary": "bg-purple-100 text-purple-800",
      "Financial Services": "bg-green-100 text-green-800",
      Healthcare: "bg-red-100 text-red-800",
      "Consumer Staples": "bg-orange-100 text-orange-800",
    }
    return colors[sector] || "bg-gray-100 text-gray-800"
  }

  if (error) {
    return (
      <Card className="h-full">
        <CardContent className="flex items-center justify-center h-full">
          <div className="text-center">
            <AlertCircle className="h-6 w-6 sm:h-8 sm:w-8 text-red-500 mx-auto mb-2" />
            <p className="text-sm text-red-600">{error}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-base sm:text-lg">Companies</CardTitle>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search companies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 text-sm"
            disabled={loading}
          />
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[calc(100vh-320px)] sm:h-[calc(100vh-320px)] lg:h-[calc(100vh-320px)]">
          <div className="space-y-1 p-3 sm:p-4">
            {loading
              ? // Enhanced responsive loading skeletons
                Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="p-2 sm:p-3 space-y-2">
                    <Skeleton className="h-3 sm:h-4 w-12 sm:w-16" />
                    <Skeleton className="h-2 sm:h-3 w-24 sm:w-32" />
                    <div className="flex justify-between">
                      <Skeleton className="h-2 sm:h-3 w-16 sm:w-20" />
                      <Skeleton className="h-2 sm:h-3 w-8 sm:w-12" />
                    </div>
                  </div>
                ))
              : filteredCompanies.map((company) => {
                  const priceData = prices[company.symbol]
                  const isSelected = selectedCompany?.id === company.id
                  const isPositive = priceData?.change >= 0

                  return (
                    <Button
                      key={company.id}
                      variant={isSelected ? "default" : "ghost"}
                      className="w-full justify-start text-left h-auto p-2 sm:p-3 hover:bg-gray-50"
                      onClick={() => onSelectCompany(company)}
                    >
                      <div className="flex flex-col items-start w-full space-y-1">
                        <div className="flex items-center justify-between w-full">
                          <div className="font-medium text-sm">{company.symbol}</div>
                          {priceData && !pricesLoading ? (
                            <div className="flex items-center space-x-1">
                              {isPositive ? (
                                <TrendingUp className="h-2 w-2 sm:h-3 sm:w-3 text-green-600" />
                              ) : (
                                <TrendingDown className="h-2 w-2 sm:h-3 sm:w-3 text-red-600" />
                              )}
                              <span className={`text-xs font-medium ${isPositive ? "text-green-600" : "text-red-600"}`}>
                                {isPositive ? "+" : ""}
                                {priceData.changePercent.toFixed(2)}%
                              </span>
                            </div>
                          ) : (
                            <Skeleton className="h-2 sm:h-3 w-8 sm:w-12" />
                          )}
                        </div>

                        <div className="text-xs text-gray-600 truncate w-full">{company.name}</div>

                        <div className="flex items-center justify-between w-full">
                          <Badge variant="secondary" className={`text-xs ${getSectorColor(company.sector)}`}>
                            {company.sector}
                          </Badge>
                          {priceData && !pricesLoading ? (
                            <div className="text-xs font-medium text-gray-900">${priceData.price.toFixed(2)}</div>
                          ) : (
                            <Skeleton className="h-2 sm:h-3 w-8 sm:w-12" />
                          )}
                        </div>
                      </div>
                    </Button>
                  )
                })}

            {!loading && filteredCompanies.length === 0 && (
              <div className="text-center py-6 sm:py-8 text-gray-500">
                <Search className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">No companies found</p>
                <p className="text-xs">Try adjusting your search terms</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
