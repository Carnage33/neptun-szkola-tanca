"use client";

import { useEffect } from "react";
import { mountBooking } from "@/components/booking";

const STORAGE_KEY = "neptun-wiadomosci";

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

/**
 * Interakcje strony głównej. Montowany w app/page.tsx (a nie w layoucie), żeby efekt
 * uruchamiał się od nowa po każdym powrocie na stronę główną z podstron.
 */
export function Enhance() {
  useEffect(() => {
    const cleanups: Array<() => void> = [];
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    const on = <K extends keyof HTMLElementEventMap>(
      target: EventTarget,
      type: K,
      handler: (event: HTMLElementEventMap[K]) => void,
      options?: AddEventListenerOptions,
    ) => {
      target.addEventListener(type, handler as EventListener, options);
      cleanups.push(() => target.removeEventListener(type, handler as EventListener, options));
    };

    function toast(title: string, text: string) {
      const host = document.querySelector(".toasts");
      if (!host) return;
      const item = document.createElement("div");
      item.className = "toast";
      item.innerHTML = `<strong>${escapeHtml(title)}</strong><span>${escapeHtml(text)}</span>`;
      host.appendChild(item);
      window.setTimeout(() => item.classList.add("is-leaving"), 4200);
      window.setTimeout(() => item.remove(), 4700);
    }

    // ── Pojawianie się sekcji ──
    function bindReveal() {
      const nodes = [...document.querySelectorAll<HTMLElement>("[data-reveal]")];
      if (reduced) {
        nodes.forEach((node) => node.classList.add("is-in"));
        return;
      }
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-in");
            observer.unobserve(entry.target);
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
      );
      nodes.forEach((node) => observer.observe(node));
      document.documentElement.dataset.motion = "ready";
      cleanups.push(() => {
        observer.disconnect();
        delete document.documentElement.dataset.motion;
      });
    }

    // ── Liczniki w statystykach ──
    function bindCounters() {
      const nodes = [...document.querySelectorAll<HTMLElement>("[data-count]")];
      if (reduced || !nodes.length) return;
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            observer.unobserve(entry.target);
            const node = entry.target as HTMLElement;
            const target = Number(node.dataset.count ?? 0);
            const started = performance.now();
            const step = (now: number) => {
              const progress = Math.min(1, (now - started) / 1200);
              const eased = 1 - Math.pow(1 - progress, 3);
              node.textContent = String(Math.round(target * eased));
              if (progress < 1) requestAnimationFrame(step);
            };
            node.textContent = "0";
            requestAnimationFrame(step);
          });
        },
        { threshold: 0.6 },
      );
      nodes.forEach((node) => observer.observe(node));
      cleanups.push(() => observer.disconnect());
    }

    // ── Odliczanie do otwarcia ──
    function bindCountdown() {
      const box = document.querySelector<HTMLElement>("[data-countdown]");
      if (!box) return;
      const target = new Date(box.dataset.countdown ?? "").getTime();
      const units = {
        d: box.querySelector<HTMLElement>('[data-unit="d"]'),
        h: box.querySelector<HTMLElement>('[data-unit="h"]'),
        m: box.querySelector<HTMLElement>('[data-unit="m"]'),
        s: box.querySelector<HTMLElement>('[data-unit="s"]'),
      };
      let timer = 0;
      const tick = () => {
        const diff = target - Date.now();
        if (!Number.isFinite(diff) || diff <= 0) {
          box.dataset.done = "true";
          const title = box.querySelector(".countdown-title");
          const foot = box.querySelector(".countdown-foot");
          if (title) title.textContent = "Jesteśmy otwarci!";
          if (foot) foot.textContent = "Zajęcia trwają — zapisz się online";
          window.clearInterval(timer);
          return;
        }
        const total = Math.floor(diff / 1000);
        const values = {
          d: Math.floor(total / 86400),
          h: Math.floor((total % 86400) / 3600),
          m: Math.floor((total % 3600) / 60),
          s: total % 60,
        };
        (Object.keys(units) as Array<keyof typeof units>).forEach((key) => {
          const node = units[key];
          const next = String(values[key]).padStart(2, "0");
          if (!node || node.textContent === next) return;
          node.textContent = next;
          if (reduced) return;
          node.classList.remove("is-tick");
          void node.offsetWidth;
          node.classList.add("is-tick");
        });
      };
      tick();
      timer = window.setInterval(tick, 1000);
      cleanups.push(() => window.clearInterval(timer));
    }

    // ── Zakładki z kursami ──
    function bindTabs() {
      document.querySelectorAll<HTMLElement>("[data-tabs]").forEach((box) => {
        const tabs = [...box.querySelectorAll<HTMLButtonElement>('[role="tab"]')];
        const select = (tab: HTMLButtonElement, focus = false) => {
          tabs.forEach((item) => {
            const selected = item === tab;
            item.setAttribute("aria-selected", String(selected));
            item.tabIndex = selected ? 0 : -1;
            const panel = document.getElementById(item.getAttribute("aria-controls") ?? "");
            if (panel) panel.hidden = !selected;
          });
          if (focus) tab.focus();
          tab.scrollIntoView({ block: "nearest", inline: "center", behavior: reduced ? "auto" : "smooth" });
        };
        tabs.forEach((tab, index) => {
          on(tab, "click", () => select(tab));
          on(tab, "keydown", (event) => {
            const keys: Record<string, number> = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: 1, ArrowUp: -1 };
            if (event.key in keys) {
              event.preventDefault();
              select(tabs[(index + keys[event.key] + tabs.length) % tabs.length], true);
            } else if (event.key === "Home" || event.key === "End") {
              event.preventDefault();
              select(tabs[event.key === "Home" ? 0 : tabs.length - 1], true);
            }
          });
        });
      });
    }

    // ── Plan zajęć: dzień + poziom ──
    function bindPlan() {
      const plan = document.querySelector<HTMLElement>("[data-plan]");
      if (!plan) return;
      let day = "all";
      let level = "all";
      const paint = () => {
        let total = 0;
        plan.querySelectorAll<HTMLElement>("[data-plan-day]").forEach((group) => {
          let visible = 0;
          const dayMatch = day === "all" || group.dataset.planDay === day;
          group.querySelectorAll<HTMLElement>(".plan-row").forEach((row) => {
            const levelMatch =
              level === "all" ||
              (level === "solo" ? row.dataset.solo === "true" : row.dataset.level === level);
            const show = dayMatch && levelMatch;
            row.hidden = !show;
            if (show) visible += 1;
          });
          group.hidden = visible === 0;
          total += visible;
        });
        const empty = plan.querySelector<HTMLElement>(".plan-empty");
        if (empty) empty.hidden = total > 0;
        plan.dataset.single = day === "all" ? "false" : "true";
      };
      on(plan, "click", (event) => {
        const chip = (event.target as HTMLElement).closest<HTMLButtonElement>(".chip");
        if (!chip) return;
        const group = chip.closest(".chips");
        if (chip.dataset.day) day = chip.dataset.day;
        else if (chip.dataset.level) level = chip.dataset.level;
        else return;
        group?.querySelectorAll<HTMLButtonElement>(".chip").forEach((item) => {
          item.setAttribute("aria-pressed", String(item === chip));
        });
        paint();
      });
      paint();
    }

    // ── Formularz kontaktowy ──
    function bindContact() {
      const form = document.querySelector<HTMLFormElement>("#contact-form");
      if (!form) return;
      const message = form.querySelector<HTMLTextAreaElement>('textarea[name="message"]');
      const counter = form.querySelector<HTMLElement>("[data-counter]");
      if (message && counter) {
        on(message, "input", () => {
          counter.textContent = `${message.value.length}/600`;
        });
      }
      on(form, "input", (event) => {
        const field = event.target as HTMLElement;
        if (field.getAttribute("aria-invalid") === "true") field.setAttribute("aria-invalid", "false");
      });
      on(form, "submit", (event) => {
        event.preventDefault();
        const data = new FormData(form);
        const name = String(data.get("name") ?? "").trim();
        const email = String(data.get("email") ?? "").trim();
        const topic = String(data.get("topic") ?? "").trim();
        const text = String(data.get("message") ?? "").trim();
        const consent = data.get("consent") === "on";
        const checks: Array<[string, boolean]> = [
          ["name", name.length >= 2],
          ["email", emailOk(email)],
          ["message", text.length >= 3],
          ["consent", consent],
        ];
        checks.forEach(([field, ok]) => {
          form.querySelector(`[name="${field}"]`)?.setAttribute("aria-invalid", ok ? "false" : "true");
        });
        const firstBad = checks.find(([, ok]) => !ok);
        if (firstBad) {
          form.querySelector<HTMLElement>(`[name="${firstBad[0]}"]`)?.focus();
          return;
        }
        const submit = form.querySelector<HTMLButtonElement>('button[type="submit"]');
        if (submit) submit.disabled = true;
        void fetch("/api/kontakt", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, topic, message: text, consent }),
        })
          .then((response) => {
            if (!response.ok) throw new Error("reject");
            try {
              const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]") as unknown[];
              saved.push({ name, email, topic, message: text, at: new Date().toISOString() });
              localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
            } catch {
              // Brak dostępu do pamięci przeglądarki nie blokuje potwierdzenia.
            }
            form.reset();
            if (counter) counter.textContent = "0/600";
            toast("Dziękujemy za wiadomość", "Wersja demonstracyjna: zapisaliśmy ją na tym urządzeniu.");
          })
          .catch(() => toast("Nie udało się wysłać", "Sprawdź połączenie i spróbuj ponownie."))
          .finally(() => {
            if (submit) submit.disabled = false;
          });
      });
    }

    // ── Efekty pod kursorem: poświata, magnes, tilt ──
    function bindPointer() {
      if (reduced || !finePointer) return;
      on(document, "pointermove", (event) => {
        const target = event.target as HTMLElement | null;
        const spot = target?.closest<HTMLElement>(".spot");
        if (spot) {
          const rect = spot.getBoundingClientRect();
          spot.style.setProperty("--mx", `${event.clientX - rect.left}px`);
          spot.style.setProperty("--my", `${event.clientY - rect.top}px`);
        }
      });
      document.querySelectorAll<HTMLElement>(".magnetic").forEach((button) => {
        on(button, "pointermove", (event) => {
          const rect = button.getBoundingClientRect();
          const x = (event.clientX - rect.left - rect.width / 2) * 0.25;
          const y = (event.clientY - rect.top - rect.height / 2) * 0.35;
          button.style.transform = `translate(${x}px, ${y}px)`;
        });
        on(button, "pointerleave", () => {
          button.style.transform = "";
        });
      });
      document.querySelectorAll<HTMLElement>("[data-tilt]").forEach((card) => {
        on(card, "pointermove", (event) => {
          const rect = card.getBoundingClientRect();
          const x = (event.clientX - rect.left) / rect.width - 0.5;
          const y = (event.clientY - rect.top) / rect.height - 0.5;
          card.style.setProperty("--rx", `${(-y * 8).toFixed(2)}deg`);
          card.style.setProperty("--ry", `${(x * 10).toFixed(2)}deg`);
          card.style.setProperty("--gx", `${((x + 0.5) * 100).toFixed(1)}%`);
          card.style.setProperty("--gy", `${((y + 0.5) * 100).toFixed(1)}%`);
        });
        on(card, "pointerleave", () => {
          card.style.removeProperty("--rx");
          card.style.removeProperty("--ry");
        });
      });
    }

    // ── Paralaksa zdjęć i linia osi czasu ──
    function bindScroll() {
      const images = [...document.querySelectorAll<HTMLElement>("[data-parallax]")];
      const timeline = document.querySelector<HTMLElement>("[data-timeline]");
      let frame = 0;
      const update = () => {
        frame = 0;
        const view = window.innerHeight;
        if (!reduced) {
          images.forEach((image) => {
            const rect = image.parentElement?.getBoundingClientRect();
            if (!rect || rect.bottom < 0 || rect.top > view) return;
            const factor = Number(image.dataset.parallax ?? 0.05);
            const offset = (rect.top + rect.height / 2 - view / 2) * factor;
            image.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0) scale(1.12)`;
          });
        }
        if (timeline) {
          const rect = timeline.getBoundingClientRect();
          const progress = Math.min(1, Math.max(0, (view * 0.65 - rect.top) / rect.height));
          timeline.style.setProperty("--progress", progress.toFixed(3));
        }
      };
      const onScroll = () => {
        if (!frame) frame = requestAnimationFrame(update);
      };
      update();
      on(window, "scroll", onScroll, { passive: true });
      on(window, "resize", onScroll);
      cleanups.push(() => cancelAnimationFrame(frame));
    }

    // ── Zapisy online i skróty do nich ──
    const host = document.querySelector<HTMLElement>("#booking");
    const booking = host ? mountBooking(host, { toast }) : null;
    if (booking) cleanups.push(() => booking.dispose());

    on(document, "click", (event) => {
      const target = event.target as HTMLElement | null;
      const book = target?.closest<HTMLElement>("[data-book]");
      if (book && booking) {
        event.preventDefault();
        booking.open(book.dataset.book);
        document.querySelector("#zapisy")?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
        return;
      }
      const topic = target?.closest<HTMLElement>("[data-topic]");
      if (topic) {
        const select = document.querySelector<HTMLSelectElement>('#contact-form select[name="topic"]');
        if (select) select.value = topic.dataset.topic ?? select.value;
      }
    });

    bindReveal();
    bindCounters();
    bindCountdown();
    bindTabs();
    bindPlan();
    bindContact();
    bindPointer();
    bindScroll();

    return () => cleanups.forEach((cleanup) => cleanup());
  }, []);

  return null;
}
