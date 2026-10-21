type RawRow = { html: string };
type RawDay = { rows: RawRow[] };

export type BooksyHooks = {
  toast: (title: string, text: string) => void;
};

type Slot = {
  dayIndex: number;
  dayName: string;
  time: string;
  end: string;
  minutes: number;
  seats: string;
};

type Service = {
  id: string;
  title: string;
  category: string;
  tag: string;
  blurb: string;
  priceLabel: string;
  priceNote: string;
  staff: string[];
  slots: Slot[];
  proposal: boolean;
  tangoGate: boolean;
};

type State = {
  step: number;
  category: string;
  serviceId: string;
  staff: string;
  date: string;
  time: string;
  end: string;
  month: Date;
  calendarOpen: boolean;
  first: string;
  last: string;
  email: string;
  notes: string;
  consent: boolean;
  notice: string;
  errors: Record<string, string>;
  pending: boolean;
  done: null | {
    code: string;
    title: string;
    staff: string;
    when: string;
    duration: string;
    price: string;
    name: string;
    email: string;
  };
};

const DAY_NAME = ["niedziela", "poniedziałek", "wtorek", "środa", "czwartek", "piątek", "sobota"];
const DOW_SHORT = ["Nd", "Pn", "Wt", "Śr", "Cz", "Pt", "So"];
const MONTH = [
  "styczeń",
  "luty",
  "marzec",
  "kwiecień",
  "maj",
  "czerwiec",
  "lipiec",
  "sierpień",
  "wrzesień",
  "październik",
  "listopad",
  "grudzień",
];
const MONTH_OF = [
  "stycznia",
  "lutego",
  "marca",
  "kwietnia",
  "maja",
  "czerwca",
  "lipca",
  "sierpnia",
  "września",
  "października",
  "listopada",
  "grudnia",
];
const DOW = ["Pn", "Wt", "Śr", "Cz", "Pt", "So", "Nd"];
const TEACHERS = ["Aleksandra Marlena Krawczyk", "Marlena Krawczyk", "Sławomir Krawczyk"];
const OPENING = new Date(2026, 10, 10, 12, 0, 0);
const TANGO_START = new Date(2026, 10, 18, 12, 0, 0);
const MENU = [
  "Flamenco - grupa początkująca P1",
  "Tango argentyńskie - nowy kurs od 18.11",
  "Latino Solo TUMBAO - fan club",
  "Nowy kurs tańca użytkowego - podstawowy",
];
const GROUP_LABEL: Record<string, string> = {
  Grupowe: "Zajęcia grupowe",
  Indywidualne: "Lekcje indywidualne",
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function emailOk(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function iso(date: Date) {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

function parseIso(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day, 12, 0, 0, 0);
}

function atNoon(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0, 0);
}

function sameMonth(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

function addMonths(date: Date, count: number) {
  return new Date(date.getFullYear(), date.getMonth() + count, 1, 12, 0, 0, 0);
}

function addDays(date: Date, count: number) {
  const next = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0, 0);
  next.setDate(next.getDate() + count);
  return next;
}

function minutesBetween(start: string, end: string) {
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  const diff = eh * 60 + em - (sh * 60 + sm);
  return diff > 0 ? diff : 60;
}

function durationLabel(minutes: number) {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  const hourLabel = hours === 1 ? "1 godz." : `${hours} godz.`;
  return rest ? `${hourLabel} ${rest} min` : hourLabel;
}

function categoryFor(title: string) {
  const name = title.toLowerCase();
  if (name.includes("flamenco")) return "Flamenco";
  if (name.includes("tango")) return "Tango";
  if (name.includes("tumbao") || name.includes("latino")) return "Latino";
  if (name.includes("użytkow")) return "Użytkowy";
  if (name.includes("utw")) return "UTW";
  return "Towarzyski";
}

function priceFor(title: string) {
  const name = title.toLowerCase();
  if (name.includes("tumbao")) return { priceLabel: "250 zł", priceNote: "karnet 8 wejść" };
  if (name.includes("flamenco") && name.includes("początk")) return { priceLabel: "250 zł", priceNote: "cykl 4 spotkań" };
  return { priceLabel: "250 zł", priceNote: "miesiąc" };
}

function staffFor(description: string) {
  const found = TEACHERS.find((name) => description.includes(name));
  return found ? [found] : ["Zespół Neptun"];
}

function initials(name: string) {
  const parts = name.split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ""}${parts[parts.length - 1][0] ?? ""}`.toUpperCase();
}

function buildCatalog(schedule: RawDay[]): Service[] {
  const services: Service[] = [];
  schedule.slice(0, 5).forEach((day, index) => {
    const dayIndex = index + 1;
    const dayName = DAY_NAME[dayIndex] ?? "";
    day.rows.forEach((row) => {
      const doc = new DOMParser().parseFromString(`<div>${row.html}</div>`, "text/html");
      const title = doc.querySelector(".slot-name")?.textContent?.trim() ?? "";
      if (!title || !MENU.includes(title)) return;
      const times = doc.querySelector(".slot-time")?.textContent?.match(/\d{2}:\d{2}/g) ?? [];
      const start = times[0];
      const end = times[1];
      if (!start || !end) return;
      const minutesText = doc.querySelector(".slot-time")?.textContent ?? "";
      const minutes = Number(minutesText.match(/(\d+)\s*min/)?.[1] ?? minutesBetween(start, end));
      const description = doc.querySelector(".slot-desc")?.textContent ?? "";
      const blurb = doc.querySelector("p.mt-1")?.textContent?.trim() || description.replace(/\s+/g, " ").trim();
      const seats = doc.querySelector(".seats")?.textContent?.match(/\d+/)?.[0] ?? "";
      const slot: Slot = { dayIndex, dayName, time: start, end, minutes, seats };
      const existing = services.find((service) => service.title === title);
      if (existing) {
        const duplicate = existing.slots.some((item) => item.dayIndex === dayIndex && item.time === start);
        if (!duplicate) existing.slots.push(slot);
        return;
      }
      const price = priceFor(title);
      services.push({
        id: `s${services.length + 1}`,
        title,
        category: "Grupowe",
        tag: categoryFor(title),
        blurb,
        priceLabel: price.priceLabel,
        priceNote: price.priceNote,
        staff: staffFor(description),
        slots: [slot],
        proposal: false,
        tangoGate: /18\.11|18 listopada/.test(title) || /18\.11|18 listopada/.test(blurb),
      });
    });
  });

  const ordered = MENU.map((title) => services.find((service) => service.title === title)).filter(
    (service): service is Service => Boolean(service),
  );
  const privateSlots: Slot[] = [1, 2, 3, 4, 5].flatMap((dayIndex) => [
    { dayIndex, dayName: DAY_NAME[dayIndex], time: "13:00", end: "14:00", minutes: 60, seats: "" },
    { dayIndex, dayName: DAY_NAME[dayIndex], time: "14:15", end: "15:15", minutes: 60, seats: "" },
  ]);
  return [
    ...ordered,
    {
      id: "indywidualna",
      title: "Lekcja indywidualna",
      category: "Indywidualne",
      tag: "Indywidualne",
      blurb: "60 minut dla osoby albo pary. Godzina jest propozycją — szczegóły potwierdzisz na miejscu.",
      priceLabel: "150 zł",
      priceNote: "60 min",
      staff: ["Marlena Krawczyk", "Sławomir Krawczyk"],
      slots: privateSlots,
      proposal: true,
      tangoGate: false,
    },
    {
      id: "pierwszy",
      title: "Pierwszy taniec",
      category: "Indywidualne",
      tag: "Para",
      blurb: "Lekcja dla Pary Młodej. Godzina jest propozycją — szczegóły potwierdzisz na miejscu.",
      priceLabel: "150 zł",
      priceNote: "60 min",
      staff: ["Marlena Krawczyk", "Sławomir Krawczyk"],
      slots: privateSlots.map((slot) => ({ ...slot })),
      proposal: true,
      tangoGate: false,
    },
  ];
}

function timePassed(date: Date, time: string) {
  const now = new Date();
  if (date.toDateString() !== now.toDateString()) return false;
  const [hours, minutes] = time.split(":").map(Number);
  return now.getHours() > hours || (now.getHours() === hours && now.getMinutes() >= minutes);
}

export function mountBooksy(host: HTMLElement, schedule: RawDay[], hooks: BooksyHooks) {
  host.querySelector("#booksy")?.remove();
  const root = document.createElement("div");
  root.id = "booksy";
  root.className = "bsy";
  host.appendChild(root);

  const services = buildCatalog(schedule);
  const categories = ["Wszystkie", ...new Set(services.map((service) => service.category))];
  const jump = document.querySelector<HTMLElement>(".nav-zadzwon");
  const booking = host.closest("#booking");
  const quietJump = new IntersectionObserver(
    ([entry]) => {
      jump?.classList.toggle("is-quiet", Boolean(entry?.isIntersecting && entry.intersectionRect.height > 220));
    },
    { threshold: [0, 0.2, 0.45, 0.7] },
  );
  if (booking) quietJump.observe(booking);
  const today = atNoon(new Date());
  const state: State = {
    step: 0,
    category: "Wszystkie",
    serviceId: "",
    staff: "",
    date: "",
    time: "",
    end: "",
    month: new Date(today.getFullYear(), today.getMonth(), 1, 12),
    calendarOpen: false,
    first: "",
    last: "",
    email: "",
    notes: "",
    consent: false,
    notice: "",
    errors: {},
    pending: false,
    done: null,
  };

  const serviceById = (id: string) => services.find((service) => service.id === id);
  const current = () => serviceById(state.serviceId);

  function timesFor(service: Service, date: Date) {
    if (atNoon(date) < today || atNoon(date) < OPENING) return [];
    if (service.tangoGate && atNoon(date) < TANGO_START) return [];
    return service.slots.filter((slot) => slot.dayIndex === date.getDay() && !timePassed(date, slot.time));
  }

  function firstOpenDate(service: Service) {
    for (let index = 0; index < 180; index += 1) {
      const date = addDays(today, index);
      if (timesFor(service, date).length) return date;
    }
    return null;
  }

  function focusMonth(service: Service) {
    const first = firstOpenDate(service);
    if (!first) return;
    state.month = new Date(first.getFullYear(), first.getMonth(), 1, 12);
  }

  function whenLabel() {
    if (!state.date || !state.time) return "";
    const date = parseIso(state.date);
    const end = state.end ? `–${state.end}` : "";
    return `${DAY_NAME[date.getDay()]}, ${date.getDate()} ${MONTH_OF[date.getMonth()]} · ${state.time}${end}`;
  }

  function selectedSlot() {
    const service = current();
    if (!service || !state.date || !state.time) return null;
    const date = parseIso(state.date);
    return service.slots.find((slot) => slot.dayIndex === date.getDay() && slot.time === state.time) ?? null;
  }

  function readForm() {
    const form = root.querySelector<HTMLFormElement>("#bsy-form");
    if (!form) return;
    state.first = form.querySelector<HTMLInputElement>('[name="firstName"]')?.value ?? state.first;
    state.last = form.querySelector<HTMLInputElement>('[name="lastName"]')?.value ?? state.last;
    state.email = form.querySelector<HTMLInputElement>('[name="email"]')?.value ?? state.email;
    state.notes = form.querySelector<HTMLTextAreaElement>('[name="notes"]')?.value ?? state.notes;
    state.consent = form.querySelector<HTMLInputElement>('[name="consent"]')?.checked ?? state.consent;
  }

  function canOpen(step: number) {
    if (step <= 0) return true;
    if (!state.serviceId) return false;
    if (step === 1) return true;
    if (!state.staff) return false;
    if (step === 2) return true;
    return Boolean(state.date && state.time);
  }

  function go(step: number) {
    if (!canOpen(step)) return;
    state.step = step;
    state.errors = {};
    render();
  }

  function chooseService(id: string) {
    const service = serviceById(id);
    if (!service) return;
    const changed = state.serviceId !== id;
    state.serviceId = id;
    state.notice = "";
    if (changed) {
      state.staff = service.staff[0] ?? "";
      state.date = "";
      state.time = "";
      state.end = "";
      state.calendarOpen = false;
      focusMonth(service);
    }
    state.step = service.staff.length > 1 ? 1 : 2;
    if (service.staff.length === 1) state.staff = service.staff[0];
    render();
  }

  function next() {
    readForm();
    if (state.step === 0) return go(current()?.staff.length === 1 ? 2 : 1);
    if (state.step === 1) return go(2);
    if (state.step === 2) return go(3);
    void submit();
  }

  async function submit() {
    readForm();
    const errors: Record<string, string> = {};
    if (state.first.trim().length < 2) errors.first = "Podaj imię.";
    if (state.last.trim().length < 2) errors.last = "Podaj nazwisko.";
    if (!emailOk(state.email.trim())) errors.email = "Podaj poprawny e-mail.";
    if (!state.consent) errors.consent = "Zaznacz zgodę, żeby zapisać rezerwację.";
    if (!state.date || !state.time) errors.when = "Wybierz dzień i godzinę.";
    state.errors = errors;
    if (Object.keys(errors).length) {
      state.step = errors.when ? 2 : 3;
      render();
      return;
    }
    const service = current();
    if (!service) return;
    state.pending = true;
    render();
    const slot = selectedSlot();
    const payload = {
      title: service.title,
      day: state.date ? DAY_NAME[parseIso(state.date).getDay()] : "",
      time: state.end ? `${state.time}–${state.end}` : state.time,
      date: state.date,
      firstName: state.first.trim(),
      lastName: state.last.trim(),
      email: state.email.trim(),
      notes: state.notes.trim(),
      consent: true,
    };
    try {
      const response = await fetch("/api/zapisy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("reject");
      const code = `NP-${state.date.replaceAll("-", "")}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
      try {
        const saved = JSON.parse(localStorage.getItem("astra-zapisy") || "[]") as unknown[];
        saved.push({ ...payload, staff: state.staff, price: service.priceLabel, code, at: new Date().toISOString() });
        localStorage.setItem("astra-zapisy", JSON.stringify(saved));
      } catch {
        // Receipt still shows when the browser blocks storage.
      }
      state.done = {
        code,
        title: service.title,
        staff: state.staff,
        when: whenLabel(),
        duration: durationLabel(slot?.minutes ?? service.slots[0]?.minutes ?? 60),
        price: `${service.priceLabel} / ${service.priceNote}`,
        name: `${payload.firstName} ${payload.lastName}`,
        email: payload.email,
      };
      state.pending = false;
      hooks.toast("Rezerwacja przyjęta", "Szczegóły są na ekranie. Opłatę uregulujesz na miejscu.");
      render();
    } catch {
      state.pending = false;
      hooks.toast("Nie udało się zapisać rezerwacji", "Spróbuj ponownie.");
      render();
    }
  }

  function reset() {
    state.step = 0;
    state.category = "Wszystkie";
    state.serviceId = "";
    state.staff = "";
    state.date = "";
    state.time = "";
    state.end = "";
    state.calendarOpen = false;
    state.first = "";
    state.last = "";
    state.email = "";
    state.notes = "";
    state.consent = false;
    state.notice = "";
    state.errors = {};
    state.pending = false;
    state.done = null;
    state.month = new Date(today.getFullYear(), today.getMonth(), 1, 12);
    render();
  }

  function open(title?: string) {
    reset();
    if (!title) return;
    const service = services.find((item) => item.title === title);
    if (!service) {
      state.notice = "Te zajęcia są w grafiku. Online rezerwujesz nowe kursy i lekcje indywidualne.";
      render();
      return;
    }
    state.serviceId = service.id;
    state.staff = service.staff[0] ?? "";
    state.step = 2;
    state.calendarOpen = false;
    focusMonth(service);
    render();
  }

  function summaryBits() {
    const service = current();
    const rows = [
      ["Usługa", service?.title ?? ""],
      ["Prowadzący", state.staff],
      ["Termin", whenLabel()],
      ["Czas", service ? durationLabel(selectedSlot()?.minutes ?? service.slots[0]?.minutes ?? 60) : ""],
    ].filter((row) => row[1]);
    return rows
      .map(
        ([label, value]) =>
          `<div class="bsy-sum-row"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></div>`,
      )
      .join("");
  }

  function actionLabel() {
    if (state.pending) return "Rezerwuję…";
    if (state.step === 3) return "Zarezerwuj";
    if (state.step === 0 && !state.serviceId) return "Wybierz usługę";
    if (state.step === 2 && (!state.date || !state.time)) return "Wybierz godzinę";
    return "Dalej";
  }

  function actionDisabled() {
    if (state.pending) return true;
    if (state.step === 0) return !state.serviceId;
    if (state.step === 1) return !state.staff;
    if (state.step === 2) return !state.date || !state.time;
    return false;
  }

  function scrollStrip() {
    const strip = root.querySelector<HTMLElement>(".bsy-strip");
    const target =
      strip?.querySelector<HTMLElement>(".bsy-date.is-on") || strip?.querySelector<HTMLElement>(".bsy-date.is-free");
    if (!strip || !target) return;
    strip.scrollLeft = Math.max(0, target.offsetLeft - (strip.clientWidth - target.clientWidth) / 2);
  }

  function renderDone() {
    const done = state.done;
    if (!done) return;
    root.classList.remove("is-picking");
    root.innerHTML = `
      <div class="bsy-done">
        <div class="bsy-check" aria-hidden="true">✓</div>
        <p class="bsy-kicker">Potwierdzenie</p>
        <h3>Rezerwacja przyjęta</h3>
        <p class="bsy-lead">Opłatę uregulujesz na miejscu, na pierwszych zajęciach.</p>
        <div class="bsy-receipt">
          <div class="bsy-sum-row"><span>Numer</span><strong>${escapeHtml(done.code)}</strong></div>
          <div class="bsy-sum-row"><span>Usługa</span><strong>${escapeHtml(done.title)}</strong></div>
          <div class="bsy-sum-row"><span>Prowadzący</span><strong>${escapeHtml(done.staff)}</strong></div>
          <div class="bsy-sum-row"><span>Termin</span><strong>${escapeHtml(done.when)}</strong></div>
          <div class="bsy-sum-row"><span>Czas</span><strong>${escapeHtml(done.duration)}</strong></div>
          <div class="bsy-sum-row"><span>Cena</span><strong>${escapeHtml(done.price)}</strong></div>
          <div class="bsy-sum-row"><span>Uczestnik</span><strong>${escapeHtml(done.name)}</strong></div>
          <div class="bsy-sum-row"><span>E-mail</span><strong>${escapeHtml(done.email)}</strong></div>
        </div>
        <p class="bsy-note">Potwierdzenie jest zapisane na tym urządzeniu. Formularz nie wysyła maila do szkoły.</p>
        <button type="button" class="bsy-btn" data-bsy="again">Zarezerwuj kolejne</button>
      </div>`;
  }

  function renderServices() {
    const list = services.filter((service) => state.category === "Wszystkie" || service.category === state.category);
    const chips = categories
      .map((category) => {
        const on = category === state.category;
        const label = category;
        return `<button type="button" class="bsy-pill${on ? " is-on" : ""}" data-bsy="cat" data-value="${escapeHtml(category)}" aria-pressed="${on ? "true" : "false"}">${escapeHtml(label)}</button>`;
      })
      .join("");
    const groups = ["Grupowe", "Indywidualne"].filter((category) => list.some((service) => service.category === category));
    const cards = groups
      .map((category) => {
        const rows = list.filter((service) => service.category === category);
        const heading = state.category === "Wszystkie" ? `<h4>${GROUP_LABEL[category]}</h4>` : "";
        const items = rows
          .map((service) => {
            const minutes = service.slots[0]?.minutes ?? 60;
            const on = service.id === state.serviceId;
            return `<button type="button" class="bsy-service${on ? " is-on" : ""}" data-bsy="service" data-value="${escapeHtml(service.id)}" aria-pressed="${on ? "true" : "false"}">
              <span class="bsy-service-main">
                <span class="bsy-service-top">
                  <span>
                    <span class="bsy-kicker">${escapeHtml(service.tag)}</span>
                    <span class="bsy-service-title">${escapeHtml(service.title)}</span>
                  </span>
                  <span class="bsy-service-price">${escapeHtml(service.priceLabel)}<small>${escapeHtml(service.priceNote)}</small></span>
                </span>
                <span class="bsy-service-meta">${durationLabel(minutes)}</span>
                <span class="bsy-service-blurb">${escapeHtml(service.blurb)}</span>
              </span>
              <span class="bsy-chev" aria-hidden="true">›</span>
            </button>`;
          })
          .join("");
        return `<section class="bsy-group">${heading}<div class="bsy-list">${items}</div></section>`;
      })
      .join("");
    const notice = state.notice ? `<p class="bsy-notice">${escapeHtml(state.notice)}</p>` : "";
    return `${notice}<div class="bsy-pills" role="toolbar" aria-label="Kategorie">${chips}</div>${cards || `<p class="bsy-empty">Brak zajęć w tej kategorii.</p>`}`;
  }

  function renderStaff() {
    const service = current();
    if (!service) return "";
    return `<div class="bsy-staff">${service.staff
      .map((name) => {
        const on = name === state.staff;
        return `<button type="button" class="bsy-person${on ? " is-on" : ""}" data-bsy="staff" data-value="${escapeHtml(name)}" aria-pressed="${on ? "true" : "false"}">
          <span class="bsy-avatar" aria-hidden="true">${escapeHtml(initials(name))}</span>
          <span class="bsy-service-title">${escapeHtml(name)}</span>
          <span class="bsy-service-meta">Prowadzący</span>
        </button>`;
      })
      .join("")}</div>`;
  }

  function dayButton(service: Service, date: Date, mode: "strip" | "month") {
    const openTimes = timesFor(service, date);
    const key = iso(date);
    const on = key === state.date;
    const todayMark = key === iso(today) ? " is-today" : "";
    if (mode === "strip") {
      const label = `${DOW_SHORT[date.getDay()]} ${date.getDate()} ${MONTH_OF[date.getMonth()]}`;
      if (!openTimes.length) {
        return `<span class="bsy-date is-off${todayMark}"><small>${DOW_SHORT[date.getDay()]}</small><b>${date.getDate()}</b></span>`;
      }
      return `<button type="button" class="bsy-date is-free${on ? " is-on" : ""}${todayMark}" data-bsy="day" data-value="${key}" aria-pressed="${on ? "true" : "false"}" aria-label="${label}"><small>${DOW_SHORT[date.getDay()]}</small><b>${date.getDate()}</b></button>`;
    }
    if (!openTimes.length) return `<span class="bsy-day is-off" aria-hidden="true">${date.getDate()}</span>`;
    return `<button type="button" class="bsy-day is-free${on ? " is-on" : ""}${todayMark}" data-bsy="day" data-value="${key}" aria-pressed="${on ? "true" : "false"}" aria-label="${date.getDate()} ${MONTH_OF[date.getMonth()]}">${date.getDate()}</button>`;
  }

  function renderCalendar() {
    const service = current();
    if (!service) return "";
    const strip = Array.from({ length: 42 }, (_, index) => dayButton(service, addDays(today, index), "strip")).join("");
    const year = state.month.getFullYear();
    const month = state.month.getMonth();
    const first = new Date(year, month, 1, 12);
    const pad = (first.getDay() + 6) % 7;
    const days = new Date(year, month + 1, 0).getDate();
    const cells: Array<Date | null> = [];
    for (let index = 0; index < pad; index += 1) cells.push(null);
    for (let day = 1; day <= days; day += 1) cells.push(new Date(year, month, day, 12));
    while (cells.length % 7) cells.push(null);
    const prevOff = sameMonth(state.month, today) || state.month < today;
    const maxMonth = addMonths(today, 5);
    const nextOff = state.month >= maxMonth;
    const monthHtml = `
      <div class="bsy-cal-head">
        <strong>${MONTH[month]} ${year}</strong>
        <span class="bsy-cal-nav">
          <button type="button" class="bsy-icon" data-bsy="prev-month" aria-label="Poprzedni miesiąc" ${prevOff ? "disabled" : ""}>‹</button>
          <button type="button" class="bsy-icon" data-bsy="next-month" aria-label="Następny miesiąc" ${nextOff ? "disabled" : ""}>›</button>
        </span>
      </div>
      <div class="bsy-cal-dow">${DOW.map((day) => `<span>${day}</span>`).join("")}</div>
      <div class="bsy-cal">${cells
        .map((date) => (date ? dayButton(service, date, "month") : `<span class="bsy-day is-pad"></span>`))
        .join("")}</div>`;
    let times = "";
    if (state.date) {
      const date = parseIso(state.date);
      const openTimes = timesFor(service, date);
      times = `<p class="bsy-hours-label">Godziny</p><div class="bsy-times" role="radiogroup" aria-label="Godzina">${openTimes
        .map((slot) => {
          const on = slot.time === state.time;
          const seats = slot.seats ? ` · ${slot.seats} miejsc` : "";
          return `<button type="button" class="bsy-time${on ? " is-on" : ""}" role="radio" aria-checked="${on ? "true" : "false"}" data-bsy="time" data-value="${escapeHtml(slot.time)}" data-end="${escapeHtml(slot.end)}">${escapeHtml(slot.time)}<small>${durationLabel(slot.minutes)}${escapeHtml(seats)}</small></button>`;
        })
        .join("")}</div>`;
    }
    const hint = service.proposal
      ? `<p class="bsy-hint">To propozycja terminu w tygodniu. Dokładną godzinę potwierdzisz na miejscu.</p>`
      : service.tangoGate
        ? `<p class="bsy-hint">Pierwsze zajęcia tego kursu: 18 listopada 2026.</p>`
        : "";
    const picker = state.calendarOpen
      ? monthHtml
      : `<div class="bsy-strip" aria-label="Najbliższe dni">${strip}</div>`;
    return `
      ${picker}
      <button type="button" class="bsy-link" data-bsy="calendar">${state.calendarOpen ? "Najbliższe dni" : "Kalendarz"}</button>
      ${hint}
      ${times}
      ${state.errors.when ? `<p class="bsy-error">${escapeHtml(state.errors.when)}</p>` : ""}`;
  }

  function field(name: string, label: string, value: string, extra: string, error?: string) {
    return `<label class="bsy-field"><span>${label}</span><input class="bsy-input" name="${name}" value="${escapeHtml(value)}" ${extra} aria-invalid="${error ? "true" : "false"}">${error ? `<small>${escapeHtml(error)}</small>` : ""}</label>`;
  }

  function renderDetails() {
    return `<form id="bsy-form" class="bsy-form" novalidate>
      <div class="bsy-grid">
        ${field("firstName", "Imię", state.first, `autocomplete="given-name" placeholder="Jan"`, state.errors.first)}
        ${field("lastName", "Nazwisko", state.last, `autocomplete="family-name" placeholder="Kowalski"`, state.errors.last)}
      </div>
      ${field("email", "E-mail", state.email, `type="email" inputmode="email" autocomplete="email" placeholder="jan@example.com"`, state.errors.email)}
      <label class="bsy-field"><span>Uwagi <em>opcjonalnie</em></span><textarea class="bsy-input bsy-area" name="notes" rows="3" maxlength="400" placeholder="Np. pierwszy raz, zapisuję się z partnerem.">${escapeHtml(state.notes)}</textarea></label>
      <label class="bsy-check"><input type="checkbox" name="consent" ${state.consent ? "checked" : ""}><span>Zgadzam się na zapis tych danych w tej przeglądarce w sprawie rezerwacji.</span></label>
      ${state.errors.consent ? `<p class="bsy-error">${escapeHtml(state.errors.consent)}</p>` : ""}
    </form>`;
  }

  function render() {
    if (state.done) {
      renderDone();
      return;
    }
    const service = current();
    const titles = ["Usługa", "Prowadzący", "Termin", "Dane"];
    const steps = titles
      .map((label, index) => {
        const cls = index === state.step ? " is-on" : index < state.step ? " is-done" : "";
        return `<button type="button" class="bsy-step${cls}" data-bsy="step" data-value="${index}" ${canOpen(index) ? "" : "disabled"}><span>${label}</span></button>`;
      })
      .join("");
    const body =
      state.step === 0 ? renderServices() : state.step === 1 ? renderStaff() : state.step === 2 ? renderCalendar() : renderDetails();
    const head =
      state.step === 0 ? "Usługi" : state.step === 1 ? "Prowadzący" : state.step === 2 ? "Data i godzina" : "Twoje dane";
    const price = service?.priceLabel ?? "—";
    const disabled = actionDisabled() ? "disabled" : "";
    root.classList.toggle("is-picking", state.step === 0);
    root.innerHTML = `
      <div class="bsy-layout">
        <div class="bsy-main">
          <div class="bsy-progress" aria-label="Kroki rezerwacji">${steps}</div>
          <div class="bsy-panel">
            <div class="bsy-panel-head">
              ${state.step > 0 ? `<button type="button" class="bsy-back" data-bsy="back" aria-label="Wstecz">‹</button>` : ""}
              <h3>${head}</h3>
            </div>
            ${body}
          </div>
        </div>
        <aside class="bsy-summary">
          <p class="bsy-kicker">Podsumowanie</p>
          <p class="bsy-total">${escapeHtml(price)}<span>${escapeHtml(service?.priceNote ?? "wybierz usługę")}</span></p>
          ${summaryBits() || `<p class="bsy-empty">Wybierz usługę, żeby zobaczyć podsumowanie.</p>`}
          <button type="button" class="bsy-btn" data-bsy="next" ${disabled}>${actionLabel()}</button>
          <p class="bsy-note">Opłata na miejscu. Potwierdzenie zapisujemy na tym urządzeniu.</p>
        </aside>
      </div>
      <div class="bsy-bar">
        <div><strong>${escapeHtml(price)}</strong><span>${escapeHtml(service?.priceNote ?? "wybierz usługę")}</span></div>
        <button type="button" class="bsy-btn" data-bsy="next" ${disabled}>${actionLabel()}</button>
      </div>`;
    if (state.step === 2) requestAnimationFrame(scrollStrip);
  }

  const onClick = (event: Event) => {
    const target = event.target as HTMLElement | null;
    const node = target?.closest<HTMLElement>("[data-bsy]");
    if (!node || !root.contains(node)) return;
    const action = node.dataset.bsy;
    const value = node.dataset.value ?? "";
    if (action === "again") {
      reset();
      return;
    }
    readForm();
    if (action === "cat") {
      state.category = value;
      render();
    } else if (action === "service") {
      chooseService(value);
    } else if (action === "staff") {
      state.staff = value;
      state.step = 2;
      render();
    } else if (action === "back") {
      let previous = state.step - 1;
      if (previous === 1 && (current()?.staff.length ?? 0) < 2) previous = 0;
      go(Math.max(0, previous));
    } else if (action === "step") {
      let step = Number(value);
      if (step === 1 && (current()?.staff.length ?? 0) < 2) step = 2;
      go(step);
    } else if (action === "calendar") {
      state.calendarOpen = !state.calendarOpen;
      render();
    } else if (action === "prev-month") {
      const previous = addMonths(state.month, -1);
      if (previous >= new Date(today.getFullYear(), today.getMonth(), 1)) {
        state.month = previous;
        render();
      }
    } else if (action === "next-month") {
      const nextMonth = addMonths(state.month, 1);
      if (nextMonth <= addMonths(today, 5)) {
        state.month = nextMonth;
        render();
      }
    } else if (action === "day") {
      const service = current();
      if (!service) return;
      state.date = value;
      const openTimes = timesFor(service, parseIso(value));
      if (!openTimes.some((slot) => slot.time === state.time)) {
        state.time = "";
        state.end = "";
      }
      render();
    } else if (action === "time") {
      state.time = value;
      state.end = node.dataset.end ?? "";
      render();
    } else if (action === "next") {
      next();
    }
  };

  root.addEventListener("click", onClick);
  render();

  return {
    open,
    dispose() {
      quietJump.disconnect();
      jump?.classList.remove("is-quiet");
      root.removeEventListener("click", onClick);
      root.remove();
    },
  };
}
