import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, website, tagline, category, pricing, hasFree, email } = body

    if (!name || !website || !tagline || !category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()

    const { error } = await supabaseAdmin.from('tool_submissions').upsert({
      slug,
      name,
      website_url: website,
      tagline,
      categories: [category],
      pricing_model: pricing,
      has_free_plan: hasFree,
      submitter_email: email,
      status: 'pending',
      submitted_at: new Date().toISOString(),
    })

    if (error) throw error

    return NextResponse.json({ success: true, slug })
  } catch (err) {
    console.error('Submit tool error:', err)
    return NextResponse.json({ error: 'Submission failed' }, { status: 500 })
  }
}
