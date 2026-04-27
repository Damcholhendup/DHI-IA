import { NextResponse } from 'next/server'

const CHAT_BACKEND_BASE = process.env.CHAT_BACKEND_BASE ?? 'http://100.85.189.71:8001/chat'
const UPSTREAM_TIMEOUT_MS = 180_000

function buildTarget(path: string[]) {
  const normalized = path.filter(Boolean).map(encodeURIComponent).join('/')
  return `${CHAT_BACKEND_BASE}/${normalized}`
}

export async function POST(
  req: Request,
  context: { params: { path: string[] } }
) {
  const path = context.params.path ?? []
  if (path.length !== 1) {
    return NextResponse.json({ detail: 'Invalid chat endpoint path' }, { status: 400 })
  }

  const body = await req.text()
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT_MS)

  try {
    const upstream = await fetch(buildTarget(path), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'text/event-stream, application/json',
      },
      body,
      signal: controller.signal,
      cache: 'no-store',
    })

    const contentType = upstream.headers.get('content-type') ?? 'application/json'
    return new NextResponse(upstream.body, {
      status: upstream.status,
      headers: {
        'content-type': contentType,
        'cache-control': 'no-cache, no-transform',
        connection: 'keep-alive',
      },
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown upstream error'
    const isAbort = message.includes('aborted') || message.includes('AbortError')
    return NextResponse.json(
      { detail: isAbort ? `Chat upstream timed out after ${UPSTREAM_TIMEOUT_MS / 1000}s` : `Chat upstream error: ${message}` },
      { status: isAbort ? 504 : 502 }
    )
  } finally {
    clearTimeout(timeout)
  }
}

export async function DELETE(
  _req: Request,
  context: { params: { path: string[] } }
) {
  const path = context.params.path ?? []
  if (path.length !== 1) {
    return NextResponse.json({ detail: 'Invalid session path' }, { status: 400 })
  }

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT_MS)

  try {
    const upstream = await fetch(buildTarget(path), {
      method: 'DELETE',
      signal: controller.signal,
      cache: 'no-store',
    })

    const text = await upstream.text()
    const contentType = upstream.headers.get('content-type') ?? 'application/json'
    return new NextResponse(text, {
      status: upstream.status,
      headers: { 'content-type': contentType },
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown upstream error'
    const isAbort = message.includes('aborted') || message.includes('AbortError')
    return NextResponse.json(
      { detail: isAbort ? `Chat upstream timed out after ${UPSTREAM_TIMEOUT_MS / 1000}s` : `Chat upstream error: ${message}` },
      { status: isAbort ? 504 : 502 }
    )
  } finally {
    clearTimeout(timeout)
  }
}
