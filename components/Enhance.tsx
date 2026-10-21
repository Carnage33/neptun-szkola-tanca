"use client";

import { useEffect } from "react";
import scheduleData from "@/content/schedule.json";
import { mountBooksy } from "@/components/booksy";

type Row = { text: string; html: string; href: string | null };
type Day = { label: string; rows: Row[] };

const schedule = scheduleData as Day[];

const WEEKDAY: Record<string, number> = {
  niedziela: 0,
  poniedziałek: 1,
  wtorek: 2,
  środa: 3,
  czwartek: 4,
  piątek: 5,
  sobota: 6,
};

const DOW_SHORT = ["nd.", "pon.", "wt.", "śr.", "czw.", "pt.", "sob."];
const MONTH_SHORT = ["sty", "lut", "mar", "kwi", "maj", "cze", "lip", "sie", "wrz", "paź", "lis", "gru"];

const OPENING = new Date(2026, 10, 10, 12, 0, 0);
const TANGO_START = new Date(2026, 10, 18, 12, 0, 0);

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

export function Enhance() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".demo-witryna");
    if (!root || root.dataset.page !== undefined && !root.querySelector("#schedule")) {
      return;
    }
    if (!root.querySelector("#start") && !root.querySelector("#schedule")) return;

    const cleanups: Array<() => void> = [];
    let dayIndex = 0;
    let audience = "Wszystkie";
    let bookingAudience = "Wszystkie";
    const panel = root.querySelector<HTMLElement>("#booking-panel");
    const emptyPanel = panel?.innerHTML ?? "";
    let chosenDate = "";

    const on = <K extends keyof HTMLElementEventMap>(
      target: EventTarget,
      type: K,
      handler: (event: HTMLElementEventMap[K]) => void,
    ) => {
      target.addEventListener(type, handler as EventListener);
      cleanups.push(() => target.removeEventListener(type, handler as EventListener));
    };

    function toast(title: string, text: string) {
      const host = root?.querySelector(".toasts");
      if (!host) return;
      const item = document.createElement("div");
      item.className = "toast";
      item.innerHTML = `<div><strong>${escapeHtml(title)}</strong><div>${escapeHtml(text)}</div></div>`;
      host.appendChild(item);
      window.setTimeout(() => item.remove(), 4600);
    }

    function paintSchedule() {
      const box = root?.querySelector<HTMLElement>("#schedule-rows");
      const day = schedule[dayIndex];
      if (!box || !day) return;
      const rows = day.rows.filter((row) => audience === "Wszystkie" || row.html.includes(`>${audience}<`));
      if (!rows.length) {
        box.innerHTML = `<p class="schedule-empty">W tym dniu nie ma zajęć dla wybranego filtra.</p>`;
        return;
      }
      box.innerHTML =
        `<div class="border-t border-[var(--line-2)]"></div>` +
        rows
          .map(
            (row) =>
              `<a href="#booking" class="slot-row" data-track="termin">${row.html}</a>`,
          )
          .join("");
    }

    function setSteps(states: Array<"current" | "done" | "">) {
      const items = root?.querySelectorAll<HTMLLIElement>("#booking .bk-steps li") ?? [];
      items.forEach((item, index) => {
        const state = states[index] ?? "";
        if (state) item.setAttribute("data-state", state);
        else item.removeAttribute("data-state");
      });
    }

    function closeMenu() {
      root?.querySelector(".sheet")?.remove();
      document.body.style.overflow = "";
      root?.querySelector<HTMLButtonElement>("header .burger")?.setAttribute("aria-expanded", "false");
    }

    function openMenu() {
      if (!root || root.querySelector(".sheet")) return;
      const links = [...root.querySelectorAll<HTMLAnchorElement>(".nav-links .nav-link")];
      const sheet = document.createElement("div");
      sheet.className = "sheet";
      sheet.setAttribute("data-open", "true");
      const brand = root.querySelector(".nav .brand")?.cloneNode(true) as HTMLElement | undefined;
      sheet.innerHTML = `<div class="wrap sheet-head"></div><div class="wrap sheet-body"></div>`;
      const head = sheet.querySelector(".sheet-head");
      if (brand && head) head.appendChild(brand);
      const close = document.createElement("button");
      close.type = "button";
      close.className = "burger";
      close.setAttribute("aria-label", "Zamknij menu");
      close.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 256 256" aria-hidden="true"><path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path></svg>';
      head?.appendChild(close);
      const body = sheet.querySelector(".sheet-body");
      links.forEach((link, index) => {
        const anchor = document.createElement("a");
        anchor.className = "sheet-link";
        anchor.href = link.getAttribute("href") || "#";
        anchor.innerHTML = `<span>${String(index + 1).padStart(2, "0")}</span>${link.textContent?.trim() ?? ""}`;
        body?.appendChild(anchor);
      });
      const cta = document.createElement("a");
      cta.className = "btn btn-primary btn-block btn-lg sheet-cta";
      cta.href = "#booking";
      cta.textContent = "Rezerwuj online";
      body?.appendChild(cta);
      root.appendChild(sheet);
      document.body.style.overflow = "hidden";
      root.querySelector<HTMLButtonElement>("header .burger")?.setAttribute("aria-expanded", "true");
    }

    function seatsFor(title: string) {
      for (const day of schedule) {
        for (const row of day.rows) {
          if (!row.html.includes(title)) continue;
          const match = row.html.match(/>(\d+)<!-- --> wolnych miejsc<|>\s*(\d+)\s*wolnych miejsc</);
          const count = match?.[1] || match?.[2];
          if (count) return count;
        }
      }
      return "";
    }

    function upcomingDates(dayName: string, title: string, firstTime: string | null) {
      const weekday = WEEKDAY[dayName.toLowerCase()];
      if (weekday === undefined) return [];
      const cursor = new Date();
      cursor.setHours(12, 0, 0, 0);
      if (cursor < OPENING) cursor.setTime(OPENING.getTime());
      if (/18\.11|18 listopada/.test(title) && TANGO_START > cursor) {
        cursor.setTime(TANGO_START.getTime());
      }
      let guard = 0;
      while (cursor.getDay() !== weekday && guard < 8) {
        cursor.setDate(cursor.getDate() + 1);
        guard += 1;
      }
      if (firstTime) {
        const [hours, minutes] = firstTime.split(":").map(Number);
        const now = new Date();
        const sameDay =
          cursor.getFullYear() === now.getFullYear() &&
          cursor.getMonth() === now.getMonth() &&
          cursor.getDate() === now.getDate();
        if (sameDay && (now.getHours() > hours || (now.getHours() === hours && now.getMinutes() > minutes))) {
          cursor.setDate(cursor.getDate() + 7);
        }
      }
      return Array.from({ length: 6 }, (_, index) => {
        const date = new Date(cursor);
        date.setDate(cursor.getDate() + index * 7);
        return date;
      });
    }

    function showBooking(slot: HTMLElement) {
      if (!panel || !root) return;
      root.querySelectorAll<HTMLElement>("#booking .bk-slot").forEach((item) => {
        const onSlot = item === slot;
        item.setAttribute("data-active", onSlot ? "true" : "false");
        item.setAttribute("aria-pressed", onSlot ? "true" : "false");
      });
      const title = slot.querySelector(".bk-slot-title")?.textContent?.trim() ?? "Zajęcia";
      const meta = slot.querySelector(".bk-slot-meta")?.textContent?.trim() ?? "";
      const dayName = slot.closest(".bk-day")?.querySelector(".bk-day-name")?.textContent?.trim() ?? "";
      const timeNode = slot.querySelector(".bk-slot-time");
      const timeLabel = timeNode?.innerHTML ?? "";
      const firstTime = timeNode?.textContent?.match(/\d{2}:\d{2}/)?.[0] ?? "";
      const seats = seatsFor(title);
      const dates = upcomingDates(dayName, title, firstTime);
      chosenDate = "";
      setSteps(["done", "current", ""]);
      panel.innerHTML = `
        <div class="bk-panel panel">
          <form id="booking-step-3" class="bk-form scroll-mt-24" novalidate>
            <div class="bk-picked">
              <span class="bk-picked-time">${timeLabel}</span>
              <div class="min-w-0 flex-1">
                <p class="bk-picked-title">${escapeHtml(title)}</p>
                <p class="bk-picked-meta">${escapeHtml([dayName, meta].filter(Boolean).join(" · "))}</p>
              </div>
              <button type="button" class="btn btn-ghost btn-sm shrink-0" data-booking-reset>Zmień</button>
            </div>
            <fieldset id="booking-step-2" class="bk-step scroll-mt-24">
              <legend class="bk-step-head"><span class="bk-step-num">2</span>Termin</legend>
              <div class="bk-dates scroller" role="radiogroup" aria-label="Termin">
                ${dates
                  .map((date) => {
                    const iso = date.toISOString().slice(0, 10);
                    const label = `${DOW_SHORT[date.getDay()]} ${date.getDate()} ${MONTH_SHORT[date.getMonth()]}`;
                    return `<button type="button" role="radio" aria-checked="false" class="date-pick" data-active="false" data-date="${iso}" data-label="${escapeHtml(label)}" title="${seats ? `${seats} wolnych miejsc` : "Wolne miejsca"}"><span class="dow">${DOW_SHORT[date.getDay()]}</span><span class="dnum">${date.getDate()}</span><span class="dmon">${MONTH_SHORT[date.getMonth()]}</span></button>`;
                  })
                  .join("")}
              </div>
            </fieldset>
            <fieldset class="bk-step">
              <legend class="bk-step-head"><span class="bk-step-num">3</span>Twoje dane</legend>
              <div class="grid-2">
                <label class="field"><span class="label">Imię</span><input id="booking-firstName" name="firstName" class="input" autocomplete="given-name" placeholder="Jan" aria-invalid="false"></label>
                <label class="field"><span class="label">Nazwisko</span><input id="booking-lastName" name="lastName" class="input" autocomplete="family-name" placeholder="Kowalski" aria-invalid="false"></label>
              </div>
              <label class="field"><span class="label">E-mail</span><input id="booking-email" name="email" class="input" inputmode="email" autocomplete="email" placeholder="jan@example.com" aria-invalid="false" type="email"></label>
              <label class="field"><span class="label">Uwagi<span class="normal-case tracking-normal text-[var(--text-3)]">opcjonalne</span></span><textarea id="booking-notes" name="notes" class="textarea" rows="2" maxlength="400" placeholder="Np. pierwszy raz na zajęciach, kontuzja, zapisuję się z partnerem."></textarea></label>
              <label class="check text-xs sm:text-sm cursor-pointer mt-1"><input id="booking-consent" name="consent" type="checkbox"><span>Zgadzam się na zapis tych danych w tej przeglądarce w sprawie rezerwacji.</span></label>
            </fieldset>
            <div class="bk-submit">
              <button type="submit" class="btn btn-primary btn-block btn-lg">Wyślij zgłoszenie</button>
              <p class="hint mt-2 text-center">Rezerwacja jest bezpłatna i niezobowiązująca. Zapłacisz na miejscu.</p>
            </div>
          </form>
        </div>`;
      panel.dataset.title = title;
      panel.dataset.day = dayName;
      panel.dataset.time = firstTime;
      panel.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }

    function resetBooking() {
      if (!panel) return;
      panel.innerHTML = emptyPanel;
      chosenDate = "";
      delete panel.dataset.title;
      root?.querySelectorAll<HTMLElement>("#booking .bk-slot").forEach((item) => {
        item.setAttribute("data-active", "false");
        item.setAttribute("aria-pressed", "false");
      });
      setSteps(["current", "", ""]);
    }

    function applyBookingFilter() {
      root?.querySelectorAll<HTMLElement>("#booking .bk-day").forEach((day) => {
        let visible = 0;
        day.querySelectorAll<HTMLElement>(".bk-slot").forEach((slot) => {
          const show = bookingAudience === "Wszystkie" || (slot.textContent?.includes(bookingAudience) ?? false);
          slot.hidden = !show;
          if (show) visible += 1;
        });
        day.hidden = visible === 0;
      });
    }

    function markField(id: string, invalid: boolean) {
      root?.querySelector<HTMLInputElement>(id)?.setAttribute("aria-invalid", invalid ? "true" : "false");
    }

    function bindSliders() {
      root?.querySelectorAll<HTMLElement>(".m-slider").forEach((slider) => {
        const ster = slider.nextElementSibling;
        if (!ster?.classList.contains("m-slider-ster")) return;
        const prev = ster.querySelector<HTMLButtonElement>('[aria-label="Poprzednia"]');
        const next = ster.querySelector<HTMLButtonElement>('[aria-label="Następna"]');
        const counter = ster.querySelector<HTMLElement>(".m-slider-licznik b");
        const bar = ster.querySelector<HTMLElement>(".m-slider-tor > span");
        const items = [...slider.children] as HTMLElement[];
        if (!items.length || !prev || !next) return;

        const update = () => {
          const width = items[0].getBoundingClientRect().width || 1;
          const index = Math.min(items.length - 1, Math.max(0, Math.round(slider.scrollLeft / (width + 12))));
          if (counter) counter.textContent = String(index + 1).padStart(2, "0");
          if (bar) {
            bar.style.width = `${100 / items.length}%`;
            bar.style.left = `${(100 / items.length) * index}%`;
          }
          prev.disabled = slider.scrollLeft < 8;
          next.disabled = slider.scrollLeft + slider.clientWidth >= slider.scrollWidth - 8;
        };
        const go = (direction: number) => {
          const width = items[0].getBoundingClientRect().width || slider.clientWidth;
          slider.scrollBy({ left: direction * (width + 12), behavior: "smooth" });
        };
        on(prev, "click", () => go(-1));
        on(next, "click", () => go(1));
        on(slider, "scroll", update);
        update();
      });
    }

    function bindCountdown() {
      const blocks = root?.querySelectorAll<HTMLElement>(".sw-odliczanie-licznik b");
      if (!blocks || blocks.length < 4) return;
      const target = new Date("2026-11-10T17:00:00+01:00").getTime();
      const tick = () => {
        const diff = Math.max(0, target - Date.now());
        const totalSeconds = Math.floor(diff / 1000);
        const days = Math.floor(totalSeconds / 86400);
        const hours = Math.floor((totalSeconds % 86400) / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        const values = [days, hours, minutes, seconds].map((value) => String(value).padStart(2, "0"));
        blocks.forEach((node, index) => {
          const next = values[index] ?? "00";
          if (node.textContent === next) return;
          node.textContent = next;
          node.classList.remove("is-tick");
          void node.offsetWidth;
          node.classList.add("is-tick");
        });
      };
      tick();
      const timer = window.setInterval(tick, 1000);
      cleanups.push(() => window.clearInterval(timer));
    }

    function bindScrollSpy() {
      const links = [...(root?.querySelectorAll<HTMLAnchorElement>(".nav-links .nav-link") ?? [])];
      const sections = links
        .map((link) => root?.querySelector<HTMLElement>(link.getAttribute("href") || ""))
        .filter((section): section is HTMLElement => Boolean(section));
      if (!sections.length) return;
      const observer = new IntersectionObserver(
        (entries) => {
          const visible = entries
            .filter((entry) => entry.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
          if (!visible) return;
          links.forEach((link) => {
            link.setAttribute("data-current", link.getAttribute("href") === `#${visible.target.id}` ? "true" : "false");
          });
        },
        { rootMargin: "-35% 0px -45% 0px", threshold: [0.1, 0.25, 0.5] },
      );
      sections.forEach((section) => observer.observe(section));
      cleanups.push(() => observer.disconnect());
    }

    function bindMotion() {
      const nodes = [...(root?.querySelectorAll<HTMLElement>("[data-reveal]") ?? [])];
      if (!nodes.length || !root) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        nodes.forEach((node) => node.classList.add("is-visible"));
        return;
      }
      const viewHeight = window.innerHeight || 800;
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          });
        },
        { threshold: 0.01, rootMargin: "0px 0px 80px 0px" },
      );
      nodes.forEach((node) => {
        const rect = node.getBoundingClientRect();
        const seen = rect.bottom > 8 && rect.top < viewHeight - 8 && rect.width > 0 && rect.height > 0;
        if (seen) node.classList.add("is-visible", "is-instant");
        else observer.observe(node);
      });
      root.dataset.motionReady = "";
      cleanups.push(() => observer.disconnect());
    }

    function bindNav() {
      const nav = root?.querySelector<HTMLElement>(".nav");
      if (!nav) return;
      const update = () => nav.classList.toggle("is-stuck", window.scrollY > 12);
      update();
      window.addEventListener("scroll", update, { passive: true });
      cleanups.push(() => window.removeEventListener("scroll", update));
    }

    const bookingHost = root.querySelector<HTMLElement>("#booking .wrap");
    const booksy = bookingHost ? mountBooksy(bookingHost, schedule, { toast }) : null;
    if (booksy) cleanups.push(() => booksy.dispose());

    bindSliders();
    bindCountdown();
    bindScrollSpy();
    bindMotion();
    bindNav();

    const message = root.querySelector<HTMLTextAreaElement>('#contact textarea[name="message"]');
    if (message) {
      on(message, "input", () => {
        const counter = message.closest("label")?.querySelector(".normal-case");
        if (counter) counter.textContent = `${message.value.length}/600`;
      });
    }

    on(root, "click", (event) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;

      const tab = target.closest<HTMLElement>('[role="tab"]');
      if (tab && root.contains(tab)) {
        const list = tab.closest(".sw-zakladki");
        if (list) {
          const tabs = [...list.querySelectorAll<HTMLElement>('[role="tab"]')];
          tabs.forEach((item) => {
            const selected = item === tab;
            item.setAttribute("aria-selected", selected ? "true" : "false");
            const panelId = item.getAttribute("aria-controls");
            const controlled = panelId ? root.querySelector<HTMLElement>(`#${CSS.escape(panelId)}`) : null;
            if (controlled) controlled.hidden = !selected;
          });
        }
      }

      const scheduleChip = target.closest<HTMLElement>("#schedule .chip");
      if (scheduleChip) {
        if (scheduleChip.closest(".dni-tygodnia")) {
          const chips = [...root.querySelectorAll<HTMLElement>("#schedule .dni-tygodnia .chip")];
          dayIndex = Math.max(0, chips.indexOf(scheduleChip));
          chips.forEach((chip, index) => chip.setAttribute("data-active", index === dayIndex ? "true" : "false"));
          paintSchedule();
        } else {
          audience = scheduleChip.textContent?.trim() || "Wszystkie";
          root.querySelectorAll<HTMLElement>("#schedule .chip").forEach((chip) => {
            if (chip.closest(".dni-tygodnia")) return;
            chip.setAttribute("data-active", chip === scheduleChip ? "true" : "false");
            chip.setAttribute("aria-pressed", chip === scheduleChip ? "true" : "false");
          });
          paintSchedule();
        }
      }

      const bookingChip = target.closest<HTMLElement>("#booking .bk-filters .chip");
      if (bookingChip) {
        bookingAudience = bookingChip.textContent?.trim() || "Wszystkie";
        root.querySelectorAll<HTMLElement>("#booking .bk-filters .chip").forEach((chip) => {
          const onChip = chip === bookingChip;
          chip.setAttribute("data-active", onChip ? "true" : "false");
          chip.setAttribute("aria-pressed", onChip ? "true" : "false");
        });
        applyBookingFilter();
      }

      const slotRow = target.closest<HTMLElement>(".slot-row");
      if (slotRow) {
        event.preventDefault();
        const title = slotRow.querySelector(".slot-name")?.textContent?.trim();
        booksy?.open(title);
        root.querySelector("#booking")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }

      const slot = target.closest<HTMLElement>("#booking .bk-slot");
      if (slot) {
        const title = slot.querySelector(".bk-slot-title")?.textContent?.trim();
        booksy?.open(title);
        root.querySelector("#booking")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }

      if (target.closest("[data-booking-reset]")) {
        event.preventDefault();
        resetBooking();
      }

      const datePick = target.closest<HTMLButtonElement>(".date-pick");
      if (datePick) {
        root.querySelectorAll<HTMLButtonElement>(".date-pick").forEach((button) => {
          const selected = button === datePick;
          button.setAttribute("data-active", selected ? "true" : "false");
          button.setAttribute("aria-checked", selected ? "true" : "false");
        });
        chosenDate = datePick.dataset.label || datePick.dataset.date || "";
        setSteps(["done", "done", "current"]);
      }

      const burger = target.closest<HTMLButtonElement>("button.burger");
      if (burger) {
        event.preventDefault();
        if (burger.closest(".sheet") || burger.getAttribute("aria-label") === "Zamknij menu") closeMenu();
        else openMenu();
      }

      if (target.closest(".sheet-link, .sheet-cta")) closeMenu();

      if (target.closest(".foot-top")) {
        event.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });

    on(root, "submit", (event) => {
      const form = event.target as HTMLFormElement;
      if (form.id === "booking-step-3") {
        event.preventDefault();
        const firstName = (form.querySelector<HTMLInputElement>("#booking-firstName")?.value ?? "").trim();
        const lastName = (form.querySelector<HTMLInputElement>("#booking-lastName")?.value ?? "").trim();
        const email = (form.querySelector<HTMLInputElement>("#booking-email")?.value ?? "").trim();
        const notes = (form.querySelector<HTMLTextAreaElement>("#booking-notes")?.value ?? "").trim();
        const consent = form.querySelector<HTMLInputElement>("#booking-consent")?.checked ?? false;
        markField("#booking-firstName", firstName.length < 2);
        markField("#booking-lastName", lastName.length < 2);
        markField("#booking-email", !emailOk(email));
        if (!chosenDate || firstName.length < 2 || lastName.length < 2 || !emailOk(email) || !consent) {
          toast("Uzupełnij zgłoszenie", "Wybierz termin i podaj imię, nazwisko, e-mail oraz zgodę.");
          return;
        }
        const submit = form.querySelector<HTMLButtonElement>('button[type="submit"]');
        if (submit) submit.disabled = true;
        void fetch("/api/zapisy", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: panel?.dataset.title,
            day: panel?.dataset.day,
            time: panel?.dataset.time,
            date: chosenDate,
            firstName,
            lastName,
            email,
            notes,
            consent,
          }),
        })
          .then(async (response) => {
            if (!response.ok) throw new Error("reject");
            const savedBookings = JSON.parse(localStorage.getItem("astra-zapisy") || "[]") as unknown[];
            savedBookings.push({
              title: panel?.dataset.title,
              day: panel?.dataset.day,
              time: panel?.dataset.time,
              date: chosenDate,
              firstName,
              lastName,
              email,
              notes,
              at: new Date().toISOString(),
            });
            localStorage.setItem("astra-zapisy", JSON.stringify(savedBookings));
            toast("Rezerwacja przyjęta", "Szczegóły są na ekranie. Opłatę uregulujesz na miejscu.");
            resetBooking();
          })
          .catch(() => {
            toast("Nie udało się zapisać rezerwacji", "Spróbuj ponownie.");
            if (submit) submit.disabled = false;
          });
      }

      if (form.closest("#contact")) {
        event.preventDefault();
        const data = new FormData(form);
        const name = String(data.get("name") ?? "").trim();
        const email = String(data.get("email") ?? "").trim();
        const phone = String(data.get("phone") ?? "").trim();
        const topic = String(data.get("topic") ?? "").trim();
        const messageText = String(data.get("message") ?? "").trim();
        const consent = form.querySelector<HTMLInputElement>('input[name="consent"]')?.checked ?? false;
        const nameInput = form.querySelector<HTMLInputElement>('input[name="name"]');
        const emailInput = form.querySelector<HTMLInputElement>('input[name="email"]');
        const messageInput = form.querySelector<HTMLTextAreaElement>('textarea[name="message"]');
        nameInput?.setAttribute("aria-invalid", name.length < 2 ? "true" : "false");
        emailInput?.setAttribute("aria-invalid", emailOk(email) ? "false" : "true");
        messageInput?.setAttribute("aria-invalid", messageText.length < 3 ? "true" : "false");
        if (name.length < 2 || !emailOk(email) || messageText.length < 3 || !consent) {
          toast("Uzupełnij wiadomość", "Potrzebujemy imienia, e-maila, treści i zgody na kontakt.");
          return;
        }
        const submit = form.querySelector<HTMLButtonElement>('button[type="submit"]');
        if (submit) submit.disabled = true;
        void fetch("/api/kontakt", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, phone, topic, message: messageText, consent }),
        })
          .then(async (response) => {
            if (!response.ok) throw new Error("reject");
            const savedMessages = JSON.parse(localStorage.getItem("astra-wiadomosci") || "[]") as unknown[];
            savedMessages.push({ name, email, phone, topic, message: messageText, at: new Date().toISOString() });
            localStorage.setItem("astra-wiadomosci", JSON.stringify(savedMessages));
            form.reset();
            const counter = messageInput?.closest("label")?.querySelector(".normal-case");
            if (counter) counter.textContent = "0/600";
            toast("Wiadomość zapisana", "Zapisana w tej przeglądarce. Zajęcia rezerwujesz w zapisie online.");
          })
          .catch(() => {
            toast("Nie udało się wysłać", "Spróbuj ponownie albo napisz na taniec.koszalin@wp.pl.");
          })
          .finally(() => {
            if (submit) submit.disabled = false;
          });
      }
    });

    on(document, "keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });

    return () => {
      closeMenu();
      cleanups.forEach((cleanup) => cleanup());
    };
  }, []);

  return null;
}
