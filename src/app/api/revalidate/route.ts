import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath, revalidateTag } from 'next/cache'

export async function POST(req: NextRequest) {
  const token = req.headers.get('x-revalidate-token')
  if (token !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { type, slug } = body

    if (type === 'tool' && slug) {
      revalidatePath(`/tools/${slug}`)
      revalidatePath(`/alternatives/to/${slug}`)
      revalidatePath(`/pricing/${slug}`)
    } else if (type === 'comparison' && slug) {
      revalidatePath(`/compare/${slug}`)
    } else if (type === 'integration' && slug) {
      revalidatePath(`/integrations/${slug}`)
    } else if (type === 'all') {
      revalidatePath('/', 'layout')
    }

    return NextResponse.json({ revalidated: true, type, slug })
  } catch (err) {
    return NextResponse.json({ error: 'Revalidation failed' }, { status: 500 })
  }
}
