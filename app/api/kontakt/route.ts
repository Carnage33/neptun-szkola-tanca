import { NextResponse } from "next/server";

type Body = {
  name?: string;
  email?: string;
  phone?: string;
  topic?: string;
  message?: string;
  consent?: boolean;
};

const emailOk = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export async function POST(request: Request) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ ok: false, error: "Niepoprawne dane." }, { status: 400 });
  }

  const name = body.name?.trim() ?? "";
  const email = body.email?.trim() ?? "";
  const message = body.message?.trim() ?? "";
  const phone = body.phone?.trim() ?? "";
  const topic = body.topic?.trim() ?? "";

  if (name.length < 2 || !emailOk(email) || message.length < 3 || !body.consent) {
    return NextResponse.json({ ok: false, error: "Uzupełnij wymagane pola." }, { status: 400 });
  }
  if (message.length > 600 || phone.length > 40 || name.length > 120) {
    return NextResponse.json({ ok: false, error: "Za długa treść." }, { status: 400 });
  }

  return NextResponse.json({
    ok: true,
    received: { name, email, phone, topic, message },
  });
}
