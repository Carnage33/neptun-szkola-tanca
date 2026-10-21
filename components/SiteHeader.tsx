"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Close, Menu } from "@/components/icons";

const LINKS = [
  { id: "o-szkole", label: "O szkole" },
  { id: "kursy", label: "Kursy" },
  { id: "plan", label: "Plan zajęć" },
  { id: "cennik", label: "Cennik" },
  { id: "wydarzenia", label: "Wydarzenia" },
  { id: "faq", label: "FAQ" },
  { id: "kontakt", label: "Kontakt" },
];

export function SiteHeader({ home = false }: { home?: boolean }) {
  const [open, setOpen] = useState(false);
  const [stuck, setStuck] = useState(!home);
  const [current, setCurrent] = useState("");
  const href = (id: string) => (home ? `#${id}` : `/#${id}`);

  // Skok do kotwicy dopiero po zdjęciu blokady przewijania, inaczej przeglądarka go zignoruje.
  const jump = (event: React.MouseEvent, id: string) => {
    setOpen(false);
    if (!home) return;
    const target = document.getElementById(id);
    if (!target) return;
    event.preventDefault();
    document.body.classList.remove("menu-open");
    requestAnimationFrame(() => {
      target.scrollIntoView({ block: "start" });
      history.replaceState(null, "", `#${id}`);
    });
  };

  useEffect(() => {
    const bar = document.querySelector<HTMLElement>(".nav-progress");
    let frame = 0;
    const update = () => {
      frame = 0;
      if (home) setStuck(window.scrollY > 24);
      if (bar) {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        bar.style.transform = `scaleX(${max > 0 ? Math.min(1, window.scrollY / max) : 0})`;
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [home]);

  useEffect(() => {
    if (!home) return;
    const sections = LINKS.map(({ id }) => document.getElementById(id)).filter(
      (section): section is HTMLElement => Boolean(section),
    );
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (visible.length) setCurrent(visible[visible.length - 1].target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [home]);

  useEffect(() => {
    document.body.classList.toggle("menu-open", open);
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const onResize = () => {
      if (window.innerWidth >= 1080) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      document.body.classList.remove("menu-open");
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  return (
    <header className="nav" data-stuck={stuck || open ? "true" : "false"} data-open={open ? "true" : "false"}>
      <div className="wrap nav-inner">
        <Link className="brand" href={home ? "#start" : "/"} onClick={(event) => jump(event, "start")} aria-label="Szkoła Tańca Neptun — strona główna">
          <img src="/logo.svg" alt="" width={40} height={40} />
          <span className="brand-text">
            <span className="brand-name">Neptun</span>
            <span className="brand-sub">Szkoła tańca · Koszalin</span>
          </span>
        </Link>

        <nav className="nav-links" aria-label="Menu główne">
          {LINKS.map((link) => (
            <a key={link.id} href={href(link.id)} className="nav-link" aria-current={current === link.id ? "true" : undefined}>
              {link.label}
            </a>
          ))}
        </nav>

        <div className="nav-actions">
          <a href={href("zapisy")} className="btn btn-primary btn-sm nav-cta">
            Zapisz się
          </a>
          <button
            type="button"
            className="burger"
            aria-label={open ? "Zamknij menu" : "Otwórz menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <Close size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <div id="mobile-menu" className="sheet" hidden={!open}>
        <nav className="wrap sheet-body" aria-label="Menu mobilne">
          {LINKS.map((link, index) => (
            <a
              key={link.id}
              href={href(link.id)}
              className="sheet-link"
              style={{ "--i": index } as React.CSSProperties}
              onClick={(event) => jump(event, link.id)}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              {link.label}
            </a>
          ))}
          <a href={href("zapisy")} className="btn btn-primary btn-lg btn-block sheet-cta" onClick={(event) => jump(event, "zapisy")}>
            Zapisz się online
          </a>
        </nav>
      </div>
      <span className="nav-progress" aria-hidden="true" />
    </header>
  );
}
