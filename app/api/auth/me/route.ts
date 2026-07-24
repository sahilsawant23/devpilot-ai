import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = cookies();
    const userCookie = cookieStore.get('devpilot_user');

    if (!userCookie || !userCookie.value) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const user = JSON.parse(userCookie.value);

    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid session' },
      { status: 400 }
    );
  }
}

export async function DELETE() {
  // Clear cookie (Logout)
  const cookieStore = cookies();
  cookieStore.delete('devpilot_user');
  return NextResponse.json({ message: 'Logged out successfully' });
}
