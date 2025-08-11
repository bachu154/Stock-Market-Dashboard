"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Menu } from "lucide-react"
import { CompanyList } from "@/components/company-list"
import { StockChart } from "@/components/stock-chart"
import { Watchlist } from "@/components/watchlist"
import { MarketNews } from "@/components/market-news"
import { useCompanies } from "@/hooks/use-stock-data"
import type { CompanyInfo } from "@/lib/stock-data"

export default function StockDashboard() {
  const { companies, loading, error } = useCompanies()
  const [selectedCompany, setSelectedCompany] = useState<CompanyInfo | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Set default selected company when companies load
  useEffect(() => {
    if (companies.length > 0 && !selectedCompany) {
      setSelectedCompany(companies[0])
    }
  }, [companies, selectedCompany])

  const handleCompanySelect = (company: CompanyInfo) => {
    setSelectedCompany(company)
    setMobileMenuOpen(false) // Close mobile menu when company is selected
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Enhanced Responsive Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3 sm:py-4">
            <div className="flex items-center space-x-3">
              {/* Mobile Menu Button */}
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="lg:hidden">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80 p-0">
                  <div className="h-full">
                    <CompanyList
                      companies={companies}
                      selectedCompany={selectedCompany}
                      onSelectCompany={handleCompanySelect}
                      loading={loading}
                      error={error}
                    />
                  </div>
                </SheetContent>
              </Sheet>

              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Stock Market Dashboard</h1>
                <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">
                  Real-time stock market analysis with AI predictions
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="text-xs sm:text-sm text-gray-500">
                <span className="hidden sm:inline">Market Status: </span>
                <span className="text-green-600 font-medium">Open</span>
              </div>
              <div className="text-xs sm:text-sm text-gray-500 hidden md:block">
                Last Updated: {new Date().toLocaleTimeString()}
              </div>
            </div>
          </div>

          {/* Mobile Company Selector */}
          {selectedCompany && (
            <div className="lg:hidden pb-3 border-t border-gray-100 mt-3 pt-3">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-semibold text-gray-900">{selectedCompany.symbol}</h2>
                  <p className="text-sm text-gray-600 truncate">{selectedCompany.name}</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => setMobileMenuOpen(true)}>
                  Change
                </Button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Enhanced Responsive Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6 min-h-[calc(100vh-200px)]">
          {/* Desktop Sidebar - Hidden on Mobile */}
          <div className="hidden lg:block lg:col-span-1 space-y-6">
            <Tabs defaultValue="companies" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="companies" className="text-xs">
                  Companies
                </TabsTrigger>
                <TabsTrigger value="watchlist" className="text-xs">
                  Watchlist
                </TabsTrigger>
                <TabsTrigger value="news" className="text-xs">
                  News
                </TabsTrigger>
              </TabsList>

              <TabsContent value="companies" className="mt-4">
                <CompanyList
                  companies={companies}
                  selectedCompany={selectedCompany}
                  onSelectCompany={setSelectedCompany}
                  loading={loading}
                  error={error}
                />
              </TabsContent>

              <TabsContent value="watchlist" className="mt-4">
                <Watchlist companies={companies} onSelectCompany={setSelectedCompany} />
              </TabsContent>

              <TabsContent value="news" className="mt-4">
                <MarketNews />
              </TabsContent>
            </Tabs>
          </div>

          {/* Stock Chart - Full Width on Mobile */}
          <div className="col-span-1 lg:col-span-4">
            <Card className="h-full">
              <CardContent className="p-3 sm:p-6">
                {selectedCompany ? (
                  <StockChart company={selectedCompany} />
                ) : (
                  <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                      <p className="text-gray-500 mb-2">Select a company to view stock data</p>
                      <Button onClick={() => setMobileMenuOpen(true)} className="lg:hidden">
                        Choose Company
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
