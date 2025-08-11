// Mock stock data generator
export interface StockDataPoint {
  date: string
  open: number
  high: number
  low: number
  close: number
  volume: number
}

export interface CompanyInfo {
  id: number
  name: string
  symbol: string
  sector: string
  marketCap?: string
  pe?: number
  dividend?: number
}

// Generate mock historical stock data
export function generateMockStockData(symbol: string, days = 30): StockDataPoint[] {
  const data: StockDataPoint[] = []
  const basePrice = Math.random() * 200 + 50 // Random base price between 50-250
  let currentPrice = basePrice

  for (let i = days; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)

    // Generate realistic price movements
    const change = (Math.random() - 0.5) * 0.1 // ±5% daily change
    currentPrice = currentPrice * (1 + change)

    const open = currentPrice
    const high = open * (1 + Math.random() * 0.05) // Up to 5% higher
    const low = open * (1 - Math.random() * 0.05) // Up to 5% lower
    const close = low + Math.random() * (high - low)
    const volume = Math.floor(Math.random() * 10000000) + 1000000 // 1M-11M volume

    data.push({
      date: date.toISOString().split("T")[0],
      open: Math.round(open * 100) / 100,
      high: Math.round(high * 100) / 100,
      low: Math.round(low * 100) / 100,
      close: Math.round(close * 100) / 100,
      volume,
    })

    currentPrice = close
  }

  return data
}

// Get current stock price and stats
export function getCurrentStockStats(data: StockDataPoint[]) {
  if (data.length === 0) return null

  const latest = data[data.length - 1]
  const previous = data[data.length - 2]

  const change = latest.close - previous.close
  const changePercent = (change / previous.close) * 100

  const high52Week = Math.max(...data.map((d) => d.high))
  const low52Week = Math.min(...data.map((d) => d.low))
  const avgVolume = data.reduce((sum, d) => sum + d.volume, 0) / data.length

  return {
    currentPrice: latest.close,
    change,
    changePercent,
    high52Week,
    low52Week,
    avgVolume: Math.floor(avgVolume),
    volume: latest.volume,
  }
}
