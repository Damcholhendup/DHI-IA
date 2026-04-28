import { NextResponse } from 'next/server'

export async function GET() {
  const dataExplorerUrl =
    process.env.DATA_EXPLORER_URL ??
    process.env.NEXT_PUBLIC_DATA_EXPLORER_URL ??
    ''
  return NextResponse.json({ dataExplorerUrl })
}
