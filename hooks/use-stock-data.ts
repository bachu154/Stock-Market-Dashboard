"use client"

import { useState, useEffect } from "react"
import type { CompanyInfo, StockDataPoint } from "@/lib/stock-data"

interface StockStats {
  currentPrice: number
  change: number
  changePercent: number
  high52Week: number
  low52Week: number
  avgVolume: number
  volume: number
}

interface StockData {
  symbol: string
  historical: StockDataPoint[]
  stats: StockStats
  lastUpdated: string
}

export function useCompanies() {
  const [companies, setCompanies] = useState<CompanyInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchCompanies() {
      try {
        setLoading(true)
        const response = await fetch("/api/companies")
        const result = await response.json()

        if (result.success) {
          setCompanies(result.data)
        } else {
          setError(result.error)
        }
      } catch (err) {
        setError("Failed to fetch companies")
      } finally {
        setLoading(false)
      }
    }

    fetchCompanies()
  }, [])

  return { companies, loading, error }
}

export function useStockData(symbol: string, days = 30) {
  const [stockData, setStockData] = useState<StockData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchStockData() {
      try {
        setLoading(true)
        const response = await fetch(`/api/stock/${symbol}?days=${days}`)
        const result = await response.json()

        if (result.success) {
          setStockData(result.data)
        } else {
          setError(result.error)
        }
      } catch (err) {
        setError("Failed to fetch stock data")
      } finally {
        setLoading(false)
      }
    }

    if (symbol) {
      fetchStockData()
    }
  }, [symbol, days])

  return { stockData, loading, error }
}

export function useStockPrices() {
  const [prices, setPrices] = useState<Record<string, { price: number; change: number; changePercent: number }>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchPrices() {
      try {
        const response = await fetch("/api/stock/prices")
        const result = await response.json()

        if (result.success) {
          setPrices(result.data)
        } else {
          setError(result.error)
        }
      } catch (err) {
        setError("Failed to fetch stock prices")
      } finally {
        setLoading(false)
      }
    }

    fetchPrices()

    // Update prices every 30 seconds
    const interval = setInterval(fetchPrices, 30000)
    return () => clearInterval(interval)
  }, [])

  return { prices, loading, error }
}
