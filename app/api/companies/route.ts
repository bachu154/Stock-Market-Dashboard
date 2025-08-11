import { NextResponse } from "next/server"
import type { CompanyInfo } from "@/lib/stock-data"

// Enhanced company data with more realistic information
const companies: CompanyInfo[] = [
  { id: 1, name: "Apple Inc.", symbol: "AAPL", sector: "Technology", marketCap: "$2.8T", pe: 28.5, dividend: 0.53 },
  {
    id: 2,
    name: "Microsoft Corp.",
    symbol: "MSFT",
    sector: "Technology",
    marketCap: "$2.5T",
    pe: 32.1,
    dividend: 0.68,
  },
  {
    id: 3,
    name: "Amazon.com Inc.",
    symbol: "AMZN",
    sector: "Consumer Discretionary",
    marketCap: "$1.3T",
    pe: 45.2,
    dividend: 0,
  },
  { id: 4, name: "Alphabet Inc.", symbol: "GOOGL", sector: "Technology", marketCap: "$1.7T", pe: 24.8, dividend: 0 },
  {
    id: 5,
    name: "Tesla Inc.",
    symbol: "TSLA",
    sector: "Consumer Discretionary",
    marketCap: "$789B",
    pe: 65.3,
    dividend: 0,
  },
  {
    id: 6,
    name: "Meta Platforms Inc.",
    symbol: "META",
    sector: "Technology",
    marketCap: "$756B",
    pe: 22.9,
    dividend: 0.5,
  },
  { id: 7, name: "NVIDIA Corp.", symbol: "NVDA", sector: "Technology", marketCap: "$1.0T", pe: 71.2, dividend: 0.16 },
  {
    id: 8,
    name: "Berkshire Hathaway",
    symbol: "BRK.B",
    sector: "Financial Services",
    marketCap: "$768B",
    pe: 8.9,
    dividend: 0,
  },
  {
    id: 9,
    name: "Johnson & Johnson",
    symbol: "JNJ",
    sector: "Healthcare",
    marketCap: "$428B",
    pe: 15.7,
    dividend: 2.95,
  },
  {
    id: 10,
    name: "JPMorgan Chase & Co.",
    symbol: "JPM",
    sector: "Financial Services",
    marketCap: "$456B",
    pe: 12.4,
    dividend: 4.0,
  },
  {
    id: 11,
    name: "Procter & Gamble Co.",
    symbol: "PG",
    sector: "Consumer Staples",
    marketCap: "$347B",
    pe: 24.1,
    dividend: 3.65,
  },
  { id: 12, name: "Visa Inc.", symbol: "V", sector: "Financial Services", marketCap: "$498B", pe: 31.8, dividend: 1.8 },
]

export async function GET() {
  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 100))

    return NextResponse.json({
      success: true,
      data: companies,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch companies",
      },
      { status: 500 },
    )
  }
}
