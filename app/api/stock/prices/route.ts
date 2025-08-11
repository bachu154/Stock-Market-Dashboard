import { NextResponse } from "next/server"

// Mock current prices and changes for all companies
const mockPriceData: Record<string, { price: number; change: number; changePercent: number }> = {
  AAPL: { price: 178.25, change: 2.15, changePercent: 1.22 },
  MSFT: { price: 342.87, change: -1.45, changePercent: -0.42 },
  AMZN: { price: 127.74, change: 3.21, changePercent: 2.58 },
  GOOGL: { price: 138.45, change: 1.87, changePercent: 1.37 },
  TSLA: { price: 248.5, change: -5.23, changePercent: -2.06 },
  META: { price: 298.58, change: 4.12, changePercent: 1.4 },
  NVDA: { price: 421.13, change: 8.95, changePercent: 2.17 },
  "BRK.B": { price: 348.92, change: 0.85, changePercent: 0.24 },
  JNJ: { price: 162.34, change: -0.67, changePercent: -0.41 },
  JPM: { price: 154.78, change: 2.34, changePercent: 1.53 },
  PG: { price: 147.89, change: 0.45, changePercent: 0.31 },
  V: { price: 234.56, change: 1.78, changePercent: 0.76 },
}

export async function GET() {
  try {
    // Simulate real-time price updates with small random variations
    const updatedPrices: typeof mockPriceData = {}

    Object.entries(mockPriceData).forEach(([symbol, data]) => {
      const variation = (Math.random() - 0.5) * 0.02 // ±1% variation
      const newPrice = data.price * (1 + variation)
      const newChange = newPrice - data.price + data.change
      const newChangePercent = (newChange / data.price) * 100

      updatedPrices[symbol] = {
        price: Math.round(newPrice * 100) / 100,
        change: Math.round(newChange * 100) / 100,
        changePercent: Math.round(newChangePercent * 100) / 100,
      }
    })

    return NextResponse.json({
      success: true,
      data: updatedPrices,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch stock prices",
      },
      { status: 500 },
    )
  }
}
