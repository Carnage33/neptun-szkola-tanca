// Wszystkie dane szkoły w jednym miejscu: strona główna, plan zajęć i zapisy online
// czytają je stąd, więc godziny, ceny i nazwy grup nie rozjeżdżają się między sekcjami.

export type Weekday = 1 | 2 | 3 | 4 | 5;
export type Style = "Taniec użytkowy" | "Tango" | "Flamenco" | "Latino";
export type Level = "Początkujący" | "Średniozaawansowani" | "Zaawansowani" | "Wszystkie poziomy";

export type Slot = { day: Weekday; start: string; end: string };

export type Course = {
  id: string;
  title: string;
  /** Nazwa grupy w obrębie stylu, np. „Od podstaw”. */
  short: string;
  style: Style;
  level: Level;
  blurb: string;
  /** Można przyjść bez partnera. */
  solo: boolean;
  seats: number;
  price: string;
  priceNote: string;
  /** Pierwsze zajęcia, jeśli grupa rusza później niż reszta. Format YYYY-MM-DD. */
  startsOn?: string;
  slots: Slot[];
};

export const SCHOOL = {
  name: "Szkoła Tańca Neptun",
  short: "Neptun",
  city: "Koszalin",
  place: "nowa sala w centrum Koszalina",
  hours: "pon.–pt. 10:00–21:30",
  closed: "sob.–nd. nieczynne",
};

/** Wielki wieczór otwarcia: wtorek 10 listopada 2026, 17:00 czasu polskiego. */
export const OPENING_ISO = "2026-11-10T17:00:00+01:00";
/** Regularne zajęcia ruszają w czwartek po otwarciu (11.11 to święto). */
export const CLASSES_START = "2026-11-12";

export const DAY_NAMES: Record<Weekday, string> = {
  1: "Poniedziałek",
  2: "Wtorek",
  3: "Środa",
  4: "Czwartek",
  5: "Piątek",
};

export const DAY_SHORT: Record<Weekday, string> = { 1: "Pn", 2: "Wt", 3: "Śr", 4: "Cz", 5: "Pt" };

export const COURSES: Course[] = [
  {
    id: "uzytkowy-podstawowy",
    short: "Od podstaw",
    title: "Taniec użytkowy — od podstaw",
    style: "Taniec użytkowy",
    level: "Początkujący",
    blurb: "PARTY DANCE od zera: jak zatańczyć na weselu, przyjęciu i dyskotece.",
    solo: false,
    seats: 20,
    price: "250 zł",
    priceNote: "miesiąc · 4 spotkania",
    slots: [{ day: 1, start: "17:30", end: "18:45" }],
  },
  {
    id: "uzytkowy-sredni",
    short: "Średniozaawansowani",
    title: "Taniec użytkowy — średniozaawansowany",
    style: "Taniec użytkowy",
    level: "Średniozaawansowani",
    blurb: "Dla par, które już tańczyły: nowe figury i swobodne prowadzenie.",
    solo: false,
    seats: 20,
    price: "250 zł",
    priceNote: "miesiąc · 4 spotkania",
    slots: [{ day: 1, start: "18:50", end: "20:10" }],
  },
  {
    id: "klub-towarzyski",
    short: "Klub tańca towarzyskiego",
    title: "Klub tańca towarzyskiego",
    style: "Taniec użytkowy",
    level: "Zaawansowani",
    blurb: "Tańce standardowe i latynoamerykańskie dla tańczących par.",
    solo: false,
    seats: 16,
    price: "250 zł",
    priceNote: "składka miesięczna",
    slots: [{ day: 3, start: "17:30", end: "19:00" }],
  },
  {
    id: "taniec-60",
    short: "Taniec 60+",
    title: "Taniec 60+ — przedpołudnie",
    style: "Taniec użytkowy",
    level: "Wszystkie poziomy",
    blurb: "Spokojne tempo, popularne tańce i dużo radości. Partner nie jest potrzebny.",
    solo: true,
    seats: 20,
    price: "250 zł",
    priceNote: "miesiąc · 4 spotkania",
    slots: [{ day: 2, start: "10:30", end: "12:00" }],
  },
  {
    id: "tango-podstawy",
    short: "Od podstaw",
    title: "Tango argentyńskie — od podstaw",
    style: "Tango",
    level: "Początkujący",
    blurb: "Nowa grupa od 18 listopada. Systematycznie i od najprostszych kroków.",
    solo: false,
    seats: 16,
    price: "160 zł",
    priceNote: "miesiąc",
    startsOn: "2026-11-18",
    slots: [{ day: 3, start: "19:15", end: "20:15" }],
  },
  {
    id: "tango-sredni",
    short: "Średniozaawansowani",
    title: "Tango argentyńskie — średniozaawansowany",
    style: "Tango",
    level: "Średniozaawansowani",
    blurb: "Dla osób, które znają podstawy tanga i chcą tańczyć swobodniej.",
    solo: false,
    seats: 16,
    price: "160 zł",
    priceNote: "miesiąc",
    slots: [{ day: 2, start: "19:45", end: "21:00" }],
  },
  {
    id: "tango-zaawansowany",
    short: "Zaawansowani",
    title: "Tango argentyńskie — zaawansowany",
    style: "Tango",
    level: "Zaawansowani",
    blurb: "Muzykalność, improwizacja i praca w parze dla doświadczonych.",
    solo: false,
    seats: 16,
    price: "160 zł",
    priceNote: "miesiąc",
    slots: [{ day: 1, start: "20:20", end: "21:20" }],
  },
  {
    id: "flamenco-podstawy",
    short: "Od podstaw",
    title: "Flamenco — od podstaw",
    style: "Flamenco",
    level: "Początkujący",
    blurb: "Pierwsze kroki, praca ramion i rytm stóp. Bez doświadczenia.",
    solo: true,
    seats: 16,
    price: "250 zł",
    priceNote: "cykl 4 spotkań",
    slots: [{ day: 1, start: "15:45", end: "17:00" }],
  },
  {
    id: "flamenco-zaawansowany",
    short: "Zaawansowani",
    title: "Flamenco — zaawansowany",
    style: "Flamenco",
    level: "Zaawansowani",
    blurb: "Dłuższe choreografie i ekspresja dla tańczących flamenco.",
    solo: true,
    seats: 14,
    price: "250 zł",
    priceNote: "miesiąc",
    slots: [{ day: 3, start: "16:00", end: "17:30" }],
  },
  {
    id: "flamenco-technika",
    short: "Technika i kastaniety",
    title: "Flamenco — technika i kastaniety",
    style: "Flamenco",
    level: "Zaawansowani",
    blurb: "Fandango, tangos con castañuelas, farruca i bulería.",
    solo: true,
    seats: 12,
    price: "250 zł",
    priceNote: "miesiąc",
    slots: [{ day: 5, start: "10:00", end: "11:30" }],
  },
  {
    id: "tumbao",
    short: "Fan club — każdy poziom",
    title: "Latino Solo TUMBAO",
    style: "Latino",
    level: "Wszystkie poziomy",
    blurb: "Rytmy latino i afro dla Pań i Panów. Tańczysz sam, w swoim tempie.",
    solo: true,
    seats: 24,
    price: "35 zł",
    priceNote: "wejście · karnet 8 wejść 250 zł",
    slots: [
      { day: 2, start: "17:00", end: "17:55" },
      { day: 4, start: "17:00", end: "17:55" },
    ],
  },
];

/** Okna na lekcje indywidualne. Nie nachodzą na zajęcia grupowe — sala jest jedna. */
export const PRIVATE_HOURS: Array<{ day: Weekday; from: string; to: string }> = [
  { day: 1, from: "10:00", to: "13:00" },
  { day: 2, from: "16:00", to: "17:00" },
  { day: 3, from: "10:00", to: "13:00" },
  { day: 4, from: "10:00", to: "13:00" },
  { day: 4, from: "19:30", to: "21:30" },
  { day: 5, from: "15:00", to: "16:00" },
  { day: 5, from: "16:30", to: "17:30" },
];

export const PRIVATE_PRICE = { price: "150 zł", note: "60 min · osoba lub para" };

export function toMinutes(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

export function fromMinutes(total: number) {
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}

/** Godzinne lekcje mieszczące się w oknach PRIVATE_HOURS. */
export function privateSlots(): Slot[] {
  return PRIVATE_HOURS.flatMap(({ day, from, to }) => {
    const slots: Slot[] = [];
    for (let start = toMinutes(from); start + 60 <= toMinutes(to); start += 60) {
      slots.push({ day, start: fromMinutes(start), end: fromMinutes(start + 60) });
    }
    return slots;
  });
}

export type ScheduleRow = Slot & { course: Course };

export function scheduleRows(): ScheduleRow[] {
  return COURSES.flatMap((course) => course.slots.map((slot) => ({ ...slot, course }))).sort(
    (a, b) => a.day - b.day || toMinutes(a.start) - toMinutes(b.start),
  );
}

export const IMAGES = {
  hero: { src: "/images/latin-kopniecie.webp", alt: "Para w dynamicznym tańcu latynoamerykańskim" },
  about: { src: "/images/tango-noc.webp", alt: "Para tańcząca tango wieczorem na ulicy" },
  uzytkowy: { src: "/images/lekcja-sala.webp", alt: "Para podczas lekcji tańca w sali z lustrem" },
  tango: { src: "/images/tango-ulica.webp", alt: "Para tańcząca tango argentyńskie" },
  flamenco: { src: "/images/flamenco-solo.webp", alt: "Tancerka flamenco w czerwonej sukni" },
  wedding: { src: "/images/wesele-para.webp", alt: "Para młoda w pierwszym tańcu" },
};

export const PHOTO_CREDITS = [
  {
    label: "Taniec latynoamerykański",
    href: "https://commons.wikimedia.org/wiki/File%3A20151121_WDSF_Austrian_Open_2015_7166.jpg",
    author: "Ailura, CC BY-SA 3.0",
  },
  {
    label: "Tango na nocnej ulicy",
    href: "https://commons.wikimedia.org/wiki/File%3ATango_Porte%C3%B1o.jpg",
    author: "Manticora87, CC BY-SA 4.0",
  },
  {
    label: "Lekcja w sali z lustrem",
    href: "https://commons.wikimedia.org/wiki/File%3ABachata_dip.jpg",
    author: "Salsauom, CC0",
  },
  {
    label: "Tango na ulicy",
    href: "https://commons.wikimedia.org/wiki/File%3ATango%2C_Argentina.jpg",
    author: "Sagitarius Plus, CC BY-SA 4.0",
  },
  {
    label: "Tancerka flamenco",
    href: "https://commons.wikimedia.org/wiki/File%3AWoman_Flamenco_dancer.jpg",
    author: "Raymonst3, CC BY-SA 4.0",
  },
  {
    label: "Pierwszy taniec pary młodej",
    href: "https://commons.wikimedia.org/wiki/File%3AWedding_dance_couple.jpg",
    author: "Wikiamy000, CC BY-SA 4.0",
  },
];
