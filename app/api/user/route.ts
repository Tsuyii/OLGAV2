import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getUserProfile, updateUserProfile, getUserAddresses, createAddress } from '@/lib/supabase/queries'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const profile = await getUserProfile(user.id)
    const addresses = await getUserAddresses(user.id)

    return NextResponse.json({ profile, addresses })
  } catch (error) {
    console.error('User API error:', error)
    return NextResponse.json({ error: 'Failed to fetch user data' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const updates = await request.json()
    const profile = await updateUserProfile(user.id, updates)

    return NextResponse.json(profile)
  } catch (error) {
    console.error('User API error:', error)
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const address = await request.json()
    const newAddress = await createAddress(user.id, address)

    return NextResponse.json(newAddress)
  } catch (error) {
    console.error('User API error:', error)
    return NextResponse.json({ error: 'Failed to create address' }, { status: 500 })
  }
}