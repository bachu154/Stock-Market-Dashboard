import { type NextRequest, NextResponse } from "next/server"
import { generateMockStockData, getCurrentStockStats } from "@/lib/stock-data"

export async function GET(request: NextRequest, { params }: { params: { symbol: string } }) {
  try {
    const { symbol } = params
    const { searchParams } = new URL(request.url)
    const days = Number.parseInt(searchParams.get("days") || "30")

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 200))

    // Generate mock stock data
    const stockData = generateMockStockData(symbol, days)
    const stats = getCurrentStockStats(stockData)

    return NextResponse.json({
      success: true,
      data: {
        symbol,
        historical: stockData,
        stats,
        lastUpdated: new Date().toISOString(),
      },
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch stock data",
      },
      { status: 500 },
    )
  }
}
