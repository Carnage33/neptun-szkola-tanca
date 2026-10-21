import {
  CLASSES_START,
  COURSES,
  PRIVATE_PRICE,
  privateSlots,
  toMinutes,
  type Slot,
  type Style,
} from "@/content/site";

export type BookingHooks = {
  toast: (title: string, text: string) => void;
};

type Service = {
  id: string;
  title: string;
  group: "Grupowe" | "Indywidualne";
  tag: Style | "Indywidualnie";
  blurb: string;
  price: string;
  priceNote: string;
  seats: number | null;
  /** Najwcześniejszy dzień zajęć, YYYY-MM-DD. */
  from: string;
  slots: Slot[];
  /** Godzina lekcji indywidualnej jest propozycją do potwierdzenia. */
  proposal: boolean;
};

type State = {
  step: number;
  filter: string;
  serviceId: string;
  date: string;
  time: string;
  end: string;
  month: Date;
  first: string;
  last: string;
  email: string;
  notes: string;
  consent: boolean;
  errors: Record<string, string>;
  pending: boolean;
  done: null | { code: string; rows: Array<[string, string]> };
};

const DAY_NAME = ["niedziela", "poniedziałek", "wtorek", "środa", "czwartek", "piątek", "sobota"];
const DOW = ["Pn", "Wt", "Śr", "Cz", "Pt", "So", "Nd"];
const MONTH = [
  "Styczeń",
  "Luty",
  "Marzec",
  "Kwiecień",
  "Maj",
  "Czerwiec",
  "Lipiec",
  "Sierpień",
  "Wrzesień",
  "Październik",
  "Listopad",
  "Grudzień",
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
const FILTERS = ["Wszystkie", "Taniec użytkowy", "Tango", "Flamenco", "Latino", "Indywidualnie"];
const STEPS = ["Zajęcia", "Termin", "Dane"];
const STORAGE_KEY = "neptun-zapisy";
/** Jak daleko w przód da się zarezerwować termin. */
const HORIZON_DAYS = 120;

const ARROW =
  '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
const BACK =
  '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg>';
const NEXT =
  '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>';

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
  return new Date(year, month - 1, day, 12);
}

function atNoon(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12);
}

function addDays(date: Date, count: number) {
  const next = atNoon(date);
  next.setDate(next.getDate() + count);
  return next;
}

function monthStart(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1, 12);
}

function addMonths(date: Date, count: number) {
  return new Date(date.getFullYear(), date.getMonth() + count, 1, 12);
}

function durationLabel(start: string, end: string) {
  const minutes = toMinutes(end) - toMinutes(start);
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest ? `${hours} h ${rest} min` : `${hours} h`;
}

function buildCatalog(): Service[] {
  const groups: Service[] = COURSES.map((course) => ({
    id: course.id,
    title: course.title,
    group: "Grupowe",
    tag: course.style,
    blurb: course.blurb,
    price: course.price,
    priceNote: course.priceNote,
    seats: course.seats,
    from: course.startsOn && course.startsOn > CLASSES_START ? course.startsOn : CLASSES_START,
    slots: course.slots,
    proposal: false,
  }));
  const slots = privateSlots();
  return [
    ...groups,
    {
      id: "indywidualna",
      title: "Lekcja indywidualna",
      group: "Indywidualne",
      tag: "Indywidualnie",
      blurb: "60 minut dla osoby albo pary, dowolny styl i poziom.",
      price: PRIVATE_PRICE.price,
      priceNote: "60 min",
      seats: null,
      from: CLASSES_START,
      slots,
      proposal: true,
    },
    {
      id: "pierwszy-taniec",
      title: "Pierwszy taniec",
      group: "Indywidualne",
      tag: "Indywidualnie",
      blurb: "Lekcja dla Pary Młodej, do wybranej przez Was muzyki.",
      price: PRIVATE_PRICE.price,
      priceNote: "60 min · para",
      seats: null,
      from: CLASSES_START,
      slots,
      proposal: true,
    },
  ];
}

function timePassed(date: Date, time: string) {
  const now = new Date();
  if (date.toDateString() !== now.toDateString()) return false;
  return now.getHours() * 60 + now.getMinutes() >= toMinutes(time);
}

export function mountBooking(host: HTMLElement, hooks: BookingHooks) {
  host.querySelector(".bk")?.remove();
  const root = document.createElement("div");
  root.className = "bk";
  host.appendChild(root);

  const services = buildCatalog();
  const today = atNoon(new Date());
  const lastDay = addDays(today, HORIZON_DAYS);
  const state: State = {
    step: 0,
    filter: "Wszystkie",
    serviceId: "",
    date: "",
    time: "",
    end: "",
    month: monthStart(today),
    first: "",
    last: "",
    email: "",
    notes: "",
    consent: false,
    errors: {},
    pending: false,
    done: null,
  };
  let animate = false;

  const current = () => services.find((service) => service.id === state.serviceId);

  function slotsOn(service: Service, date: Date) {
    const day = atNoon(date);
    if (day < today || day > lastDay || day < parseIso(service.from)) return [];
    return service.slots
      .filter((slot) => slot.day === day.getDay() && !timePassed(day, slot.start))
      .sort((a, b) => toMinutes(a.start) - toMinutes(b.start));
  }

  function firstOpenDate(service: Service) {
    const start = parseIso(service.from) > today ? parseIso(service.from) : today;
    for (let index = 0; index <= HORIZON_DAYS; index += 1) {
      const date = addDays(start, index);
      if (slotsOn(service, date).length) return date;
    }
    return null;
  }

  function monthBounds(service: Service) {
    const first = firstOpenDate(service) ?? today;
    return { min: monthStart(first), max: monthStart(lastDay) };
  }

  function whenLabel() {
    if (!state.date || !state.time) return "";
    const date = parseIso(state.date);
    return `${DAY_NAME[date.getDay()]}, ${date.getDate()} ${MONTH_OF[date.getMonth()]} · ${state.time}–${state.end}`;
  }

  function readForm() {
    const form = root.querySelector<HTMLFormElement>(".bk-form");
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
    return Boolean(state.date && state.time);
  }

  function go(step: number) {
    if (!canOpen(step)) return;
    state.step = step;
    state.errors = {};
    animate = true;
    render();
    root.querySelector<HTMLElement>(".bk-panel-head h3")?.focus({ preventScroll: true });
  }

  function chooseService(id: string) {
    const service = services.find((item) => item.id === id);
    if (!service) return;
    if (state.serviceId !== id) {
      state.serviceId = id;
      state.date = "";
      state.time = "";
      state.end = "";
      const first = firstOpenDate(service);
      state.month = monthStart(first ?? today);
    }
    go(1);
  }

  function chooseDate(value: string) {
    const service = current();
    if (!service) return;
    state.date = value;
    const open = slotsOn(service, parseIso(value));
    const keep = open.find((slot) => slot.start === state.time);
    const only = open.length === 1 ? open[0] : undefined;
    const pick = keep ?? only;
    state.time = pick?.start ?? "";
    state.end = pick?.end ?? "";
    render();
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
      state.step = errors.when ? 1 : 2;
      render();
      root.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
      return;
    }
    const service = current();
    if (!service) return;
    state.pending = true;
    render();
    const payload = {
      title: service.title,
      day: DAY_NAME[parseIso(state.date).getDay()],
      time: `${state.time}–${state.end}`,
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
      const code = `NP-${state.date.replaceAll("-", "").slice(2)}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
      try {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]") as unknown[];
        saved.push({ ...payload, price: service.price, code, at: new Date().toISOString() });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
      } catch {
        // Potwierdzenie i tak pokazujemy, nawet gdy przeglądarka blokuje zapis.
      }
      state.done = {
        code,
        rows: [
          ["Zajęcia", service.title],
          ["Termin", whenLabel()],
          ["Czas", durationLabel(state.time, state.end)],
          ["Cena", `${service.price} · ${service.priceNote}`],
          ["Uczestnik", `${payload.firstName} ${payload.lastName}`],
          ["E-mail", payload.email],
        ],
      };
      state.pending = false;
      animate = true;
      hooks.toast("Rezerwacja przyjęta", "Płacisz na miejscu, na pierwszych zajęciach.");
      render();
    } catch {
      state.pending = false;
      hooks.toast("Nie udało się zapisać", "Sprawdź połączenie i spróbuj ponownie.");
      render();
    }
  }

  function reset() {
    Object.assign(state, {
      step: 0,
      filter: "Wszystkie",
      serviceId: "",
      date: "",
      time: "",
      end: "",
      month: monthStart(today),
      first: "",
      last: "",
      email: "",
      notes: "",
      consent: false,
      errors: {},
      pending: false,
      done: null,
    } satisfies State);
    animate = true;
    render();
  }

  function open(id?: string) {
    // Dane osobowe zostają, gdy ktoś przeskakuje między zajęciami.
    readForm();
    const keep = { first: state.first, last: state.last, email: state.email, consent: state.consent };
    reset();
    Object.assign(state, keep);
    if (id) chooseService(id);
  }

  function renderDone() {
    const done = state.done;
    if (!done) return "";
    return `
      <div class="bk-done">
        <div class="bk-check" aria-hidden="true"><svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7"/></svg></div>
        <p class="bk-kicker">Numer ${escapeHtml(done.code)}</p>
        <h3 tabindex="-1">Do zobaczenia na parkiecie!</h3>
        <p class="bk-lead">Rezerwacja przyjęta. Opłatę uregulujesz na miejscu, na pierwszych zajęciach.</p>
        <dl class="bk-receipt">${done.rows
          .map(([label, value]) => `<div><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value)}</dd></div>`)
          .join("")}</dl>
        <p class="bk-note">Wersja demonstracyjna: potwierdzenie zapisało się na tym urządzeniu.</p>
        <button type="button" class="btn btn-dark" data-bk="again">Zarezerwuj kolejne zajęcia</button>
      </div>`;
  }

  function renderServices() {
    const list = services.filter((service) => state.filter === "Wszystkie" || service.tag === state.filter);
    const pills = FILTERS.map((filter) => {
      const on = filter === state.filter;
      return `<button type="button" class="chip" data-bk="filter" data-value="${escapeHtml(filter)}" aria-pressed="${on}">${escapeHtml(filter)}</button>`;
    }).join("");
    const cards = list
      .map((service) => {
        const on = service.id === state.serviceId;
        const first = firstOpenDate(service);
        const when = service.proposal
          ? "Wybierasz z wolnych okien"
          : service.slots
              .map((slot) => `${DAY_NAME[slot.day].slice(0, 3)}. ${slot.start}`)
              .join(" · ");
        const start = first ? `najbliżej ${first.getDate()} ${MONTH_OF[first.getMonth()]}` : "brak wolnych terminów";
        return `<button type="button" class="bk-service${on ? " is-on" : ""}" data-bk="service" data-value="${escapeHtml(service.id)}" aria-pressed="${on}">
            <span class="bk-service-tag">${escapeHtml(service.tag)}</span>
            <span class="bk-service-title">${escapeHtml(service.title)}</span>
            <span class="bk-service-meta">${escapeHtml(when)} · ${escapeHtml(start)}</span>
            <span class="bk-service-foot">
              <span class="bk-service-price">${escapeHtml(service.price)}<small>${escapeHtml(service.priceNote.split(" · ")[0])}</small></span>
              <span class="bk-service-go">Wybierz ${ARROW}</span>
            </span>
          </button>`;
      })
      .join("");
    return `<div class="chips chips-soft bk-filters" role="toolbar" aria-label="Rodzaj zajęć">${pills}</div>
      <div class="bk-services">${cards || `<p class="bk-empty">Brak zajęć w tej kategorii.</p>`}</div>`;
  }

  function renderCalendar() {
    const service = current();
    if (!service) return "";
    const { min, max } = monthBounds(service);
    if (state.month < min) state.month = min;
    if (state.month > max) state.month = max;
    const year = state.month.getFullYear();
    const month = state.month.getMonth();
    const pad = (new Date(year, month, 1, 12).getDay() + 6) % 7;
    const count = new Date(year, month + 1, 0).getDate();
    const cells: string[] = [];
    for (let index = 0; index < pad; index += 1) cells.push(`<span class="bk-day is-pad"></span>`);
    for (let day = 1; day <= count; day += 1) {
      const date = new Date(year, month, day, 12);
      const key = iso(date);
      const free = slotsOn(service, date).length > 0;
      const today_ = key === iso(today) ? " is-today" : "";
      if (!free) {
        cells.push(`<span class="bk-day is-off${today_}">${day}</span>`);
        continue;
      }
      const on = key === state.date;
      cells.push(
        `<button type="button" class="bk-day is-free${on ? " is-on" : ""}${today_}" data-bk="day" data-value="${key}" aria-pressed="${on}" aria-label="${day} ${MONTH_OF[month]}, ${DAY_NAME[date.getDay()]}">${day}</button>`,
      );
    }

    let times = "";
    if (state.date) {
      const open = slotsOn(service, parseIso(state.date));
      times = `<div class="bk-times-wrap">
        <p class="bk-label">Godzina</p>
        <div class="bk-times" role="radiogroup" aria-label="Godzina">${open
          .map((slot) => {
            const on = slot.start === state.time;
            return `<button type="button" class="bk-time${on ? " is-on" : ""}" role="radio" aria-checked="${on}" data-bk="time" data-value="${slot.start}" data-end="${slot.end}">${slot.start}<small>do ${slot.end}</small></button>`;
          })
          .join("")}</div></div>`;
    }

    const hint = service.proposal
      ? "Godzina lekcji indywidualnej jest propozycją — potwierdzimy ją mailowo."
      : service.from > CLASSES_START
        ? `Pierwsze zajęcia tej grupy: ${parseIso(service.from).getDate()} ${MONTH_OF[parseIso(service.from).getMonth()]}.`
        : service.seats
          ? `Grupa do ${service.seats} osób. Dołączyć możesz na dowolnych zajęciach.`
          : "";

    return `
      <div class="bk-cal-head">
        <strong>${MONTH[month]} ${year}</strong>
        <span class="bk-cal-nav">
          <button type="button" class="bk-icon" data-bk="prev-month" aria-label="Poprzedni miesiąc" ${state.month <= min ? "disabled" : ""}>${BACK}</button>
          <button type="button" class="bk-icon" data-bk="next-month" aria-label="Następny miesiąc" ${state.month >= max ? "disabled" : ""}>${NEXT}</button>
        </span>
      </div>
      <div class="bk-cal-dow" aria-hidden="true">${DOW.map((day) => `<span>${day}</span>`).join("")}</div>
      <div class="bk-cal">${cells.join("")}</div>
      ${hint ? `<p class="bk-hint">${escapeHtml(hint)}</p>` : ""}
      ${times}
      ${state.errors.when ? `<p class="bk-error">${escapeHtml(state.errors.when)}</p>` : ""}`;
  }

  function field(name: string, label: string, value: string, extra: string, error?: string) {
    return `<label class="field"><span class="label">${label}</span><input class="input" name="${name}" value="${escapeHtml(value)}" ${extra} aria-invalid="${error ? "true" : "false"}">${error ? `<span class="field-error is-shown">${escapeHtml(error)}</span>` : ""}</label>`;
  }

  function renderDetails() {
    return `<form class="bk-form" novalidate>
      <div class="grid-2">
        ${field("firstName", "Imię", state.first, `autocomplete="given-name" placeholder="Jan" maxlength="60"`, state.errors.first)}
        ${field("lastName", "Nazwisko", state.last, `autocomplete="family-name" placeholder="Kowalski" maxlength="80"`, state.errors.last)}
      </div>
      ${field("email", "E-mail", state.email, `type="email" inputmode="email" autocomplete="email" placeholder="jan@example.com"`, state.errors.email)}
      <label class="field"><span class="label">Uwagi <em>opcjonalnie</em></span><textarea class="input" name="notes" rows="3" maxlength="400" placeholder="Np. pierwszy raz, zapisuję się z partnerem.">${escapeHtml(state.notes)}</textarea></label>
      <label class="check"><input type="checkbox" name="consent" ${state.consent ? "checked" : ""} aria-invalid="${state.errors.consent ? "true" : "false"}"><span>Zgadzam się na przetwarzanie moich danych w celu obsługi rezerwacji.</span></label>
      ${state.errors.consent ? `<p class="bk-error">${escapeHtml(state.errors.consent)}</p>` : ""}
      <button type="submit" hidden></button>
    </form>`;
  }

  function actionLabel() {
    if (state.pending) return "Rezerwuję…";
    if (state.step === 0) return state.serviceId ? "Dalej" : "Wybierz zajęcia";
    if (state.step === 1) return state.date && state.time ? "Dalej" : "Wybierz termin";
    return "Zarezerwuj";
  }

  function actionDisabled() {
    if (state.pending) return true;
    if (state.step === 0) return !state.serviceId;
    if (state.step === 1) return !state.date || !state.time;
    return false;
  }

  function render() {
    root.classList.toggle("is-done", Boolean(state.done));
    if (state.done) {
      root.innerHTML = renderDone();
      if (animate) root.querySelector<HTMLElement>(".bk-done h3")?.focus({ preventScroll: true });
      animate = false;
      return;
    }
    const service = current();
    const steps = STEPS.map((label, index) => {
      const cls = index === state.step ? " is-on" : index < state.step ? " is-done" : "";
      return `<li><button type="button" class="bk-step${cls}" data-bk="step" data-value="${index}" ${canOpen(index) ? "" : "disabled"} ${index === state.step ? 'aria-current="step"' : ""}><span>${index + 1}</span>${label}</button></li>`;
    }).join("");
    const body = state.step === 0 ? renderServices() : state.step === 1 ? renderCalendar() : renderDetails();
    const head = state.step === 0 ? "Wybierz zajęcia" : state.step === 1 ? "Wybierz termin" : "Twoje dane";
    const summary = [
      ["Zajęcia", service?.title ?? ""],
      ["Termin", whenLabel()],
    ]
      .filter(([, value]) => value)
      .map(([label, value]) => `<div><dt>${label}</dt><dd>${escapeHtml(value)}</dd></div>`)
      .join("");
    const disabled = actionDisabled() ? "disabled" : "";
    root.innerHTML = `
      <div class="bk-main">
        <ol class="bk-steps" aria-label="Kroki rezerwacji">${steps}</ol>
        <div class="bk-panel${animate ? " is-entering" : ""}">
          <div class="bk-panel-head">
            ${state.step > 0 ? `<button type="button" class="bk-icon" data-bk="back" aria-label="Wstecz">${BACK}</button>` : ""}
            <h3 tabindex="-1">${head}</h3>
          </div>
          ${body}
        </div>
      </div>
      <aside class="bk-summary" aria-label="Podsumowanie rezerwacji">
        <p class="bk-kicker">Podsumowanie</p>
        <p class="bk-total">${escapeHtml(service?.price ?? "—")}<span>${escapeHtml(service?.priceNote ?? "wybierz zajęcia")}</span></p>
        ${summary ? `<dl class="bk-sum">${summary}</dl>` : `<p class="bk-sum-empty">Tu zobaczysz wybrane zajęcia i termin.</p>`}
        <button type="button" class="btn btn-primary btn-block bk-next" data-bk="next" ${disabled}>${actionLabel()} ${state.pending ? "" : ARROW}</button>
        <p class="bk-note">Bezpłatna rezerwacja · płacisz na miejscu</p>
      </aside>`;
    animate = false;
  }

  const onClick = (event: Event) => {
    const node = (event.target as HTMLElement | null)?.closest<HTMLElement>("[data-bk]");
    if (!node || !root.contains(node) || node.hasAttribute("disabled")) return;
    const action = node.dataset.bk;
    const value = node.dataset.value ?? "";
    if (action === "again") return reset();
    readForm();
    switch (action) {
      case "filter":
        state.filter = value;
        render();
        break;
      case "service":
        chooseService(value);
        break;
      case "back":
        go(Math.max(0, state.step - 1));
        break;
      case "step":
        go(Number(value));
        break;
      case "prev-month":
        state.month = addMonths(state.month, -1);
        render();
        break;
      case "next-month":
        state.month = addMonths(state.month, 1);
        render();
        break;
      case "day":
        chooseDate(value);
        break;
      case "time":
        state.time = value;
        state.end = node.dataset.end ?? "";
        render();
        break;
      case "next":
        if (state.step < 2) go(state.step + 1);
        else void submit();
        break;
    }
  };

  const onSubmit = (event: Event) => {
    event.preventDefault();
    void submit();
  };

  root.addEventListener("click", onClick);
  root.addEventListener("submit", onSubmit);
  render();

  return {
    open,
    dispose() {
      root.removeEventListener("click", onClick);
      root.removeEventListener("submit", onSubmit);
      root.remove();
    },
  };
}
