import { NextResponse } from "next/server";
import { CLASSES_START, COURSES } from "@/content/site";

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

const TITLES = new Set([...COURSES.map((course) => course.title), "Lekcja indywidualna", "Pierwszy taniec"]);
const emailOk = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
const digits = (value: string) => value.replace(/\D/g, "");

function dateOk(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T12:00:00Z`);
  if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== value) return false;
  const yesterday = new Date(Date.now() - 86_400_000).toISOString().slice(0, 10);
  return value >= CLASSES_START && value >= yesterday;
}

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
  const time = body.time?.trim() ?? "";
  const notes = body.notes?.trim() ?? "";

  if (
    firstName.length < 2 ||
    lastName.length < 2 ||
    !emailOk(email) ||
    !TITLES.has(title) ||
    !dateOk(date) ||
    !/^\d{2}:\d{2}/.test(time) ||
    body.consent !== true
  ) {
    return NextResponse.json({ ok: false, error: "Uzupełnij wymagane pola." }, { status: 400 });
  }
  if (phone && digits(phone).length < 9) {
    return NextResponse.json({ ok: false, error: "Niepoprawny numer telefonu." }, { status: 400 });
  }
  if (notes.length > 400 || firstName.length > 60 || lastName.length > 80) {
    return NextResponse.json({ ok: false, error: "Za długa treść." }, { status: 400 });
  }

  // Wersja demonstracyjna: rezerwacja nie trafia jeszcze do bazy ani skrzynki szkoły.
  return NextResponse.json({ ok: true });
}
