import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db/drizzle';
import { joinlistTable } from '@/lib/db/schema';
import { sendJoinlistConfirmationEmail } from '@/app/(dashboard)/actions';

export async function POST(request: Request) {
  const body = await request.json();
  const { firstName, email, interest } = body;

  if (!firstName || typeof firstName !== 'string' || !firstName.trim()) {
    return NextResponse.json({ error: 'First name is required.' }, { status: 400 });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || typeof email !== 'string' || !emailRegex.test(email)) {
    return NextResponse.json({ error: 'A valid email is required.' }, { status: 400 });
  }

  const normalizedEmail = email.trim().toLowerCase();

  const existing = await db
    .select({ id: joinlistTable.id })
    .from(joinlistTable)
    .where(eq(joinlistTable.email, normalizedEmail))
    .limit(1);

  if (existing.length > 0) {
    return NextResponse.json(
      { error: 'This email is already on the waitlist.' },
      { status: 409 }
    );
  }

  await db.insert(joinlistTable).values({
    firstName: firstName.trim(),
    email: normalizedEmail,
    interest: interest ?? null,
  });

  await sendJoinlistConfirmationEmail(firstName.trim(), normalizedEmail);

  return NextResponse.json({ success: true }, { status: 201 });
}