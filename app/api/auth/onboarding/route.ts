import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';

export async function POST() {
  try {
    const cookieStore = cookies();
    const raw = cookieStore.get('devpilot_user')?.value;
    if (!raw) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const session = JSON.parse(raw);
    await db.user.update({
      where: { id: session.id },
      data: { onboardingComplete: true },
    });

    return NextResponse.json({ message: 'Onboarding complete' });
  } catch (error) {
    console.error('Onboarding error:', error);
    return NextResponse.json({ error: 'Failed to update onboarding status' }, { status: 500 });
  }
}
