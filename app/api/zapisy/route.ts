import { NextResponse } from "next/server";

type Body = {
  title?: string;
  day?: string;
  time?: string;
  date?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  notes?: string;
  consent?: boolean;
};

const emailOk = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
const digits = (value: string) => value.replace(/\D/g, "");

export async function POST(request: Request) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ ok: false, error: "Niepoprawne dane." }, { status: 400 });
  }

  const firstName = body.firstName?.trim() ?? "";
  const lastName = body.lastName?.trim() ?? "";
  const email = body.email?.trim() ?? "";
  const phone = body.phone?.trim() ?? "";
  const title = body.title?.trim() ?? "";
  const date = body.date?.trim() ?? "";
  const notes = body.notes?.trim() ?? "";

  if (
    firstName.length < 2 ||
    lastName.length < 2 ||
    !emailOk(email) ||
    !title ||
    !date ||
    !body.consent
  ) {
    return NextResponse.json({ ok: false, error: "Uzupełnij wymagane pola." }, { status: 400 });
  }
  if (phone && digits(phone).length < 9) {
    return NextResponse.json({ ok: false, error: "Uzupełnij wymagane pola." }, { status: 400 });
  }
  if (notes.length > 400) {
    return NextResponse.json({ ok: false, error: "Za długa treść." }, { status: 400 });
  }

  return NextResponse.json({
    ok: true,
    received: {
      title,
      day: body.day ?? "",
      time: body.time ?? "",
      date,
      firstName,
      lastName,
      email,
      phone,
      notes,
    },
  });
}
