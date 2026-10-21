import Link from "next/link";
import { ArrowUp } from "@/components/icons";
import { PHOTO_CREDITS, SCHOOL } from "@/content/site";

export function SiteFooter({ home = false }: { home?: boolean }) {
  const href = (id: string) => (home ? `#${id}` : `/#${id}`);
  return (
    <footer className="foot">
      <div className="foot-glow" aria-hidden="true" />
      <div className="wrap">
        <div className="foot-grid">
          <div className="foot-brand">
            <Link className="brand" href="/">
              <img src="/logo.svg" alt="" width={40} height={40} />
              <span className="brand-text">
                <span className="brand-name">Neptun</span>
                <span className="brand-sub">Szkoła tańca · Koszalin</span>
              </span>
            </Link>
            <p>
              Nowa szkoła tańca w Koszalinie. Wielkie otwarcie 10 listopada 2026. Taniec użytkowy, tango,
              flamenco i latino — od pierwszego kroku.
            </p>
          </div>
          <nav className="foot-col" aria-label="Taniec">
            <h2>Taniec</h2>
            <ul>
              <li><a href={href("kursy")}>Kursy</a></li>
              <li><a href={href("indywidualnie")}>Lekcje indywidualne</a></li>
              <li><a href={href("plan")}>Plan zajęć</a></li>
              <li><a href={href("cennik")}>Cennik</a></li>
            </ul>
          </nav>
          <nav className="foot-col" aria-label="Szkoła">
            <h2>Szkoła</h2>
            <ul>
              <li><a href={href("o-szkole")}>O szkole</a></li>
              <li><a href={href("otwarcie")}>Otwarcie</a></li>
              <li><a href={href("wydarzenia")}>Wydarzenia</a></li>
              <li><a href={href("faq")}>Pytania</a></li>
            </ul>
          </nav>
          <div className="foot-col">
            <h2>Kontakt</h2>
            <ul>
              <li><a href={href("zapisy")} className="foot-strong">Zapisz się online</a></li>
              <li><a href={href("kontakt")}>Formularz kontaktowy</a></li>
              <li className="foot-muted">{SCHOOL.city}, centrum miasta</li>
              <li className="foot-muted">{SCHOOL.hours}</li>
            </ul>
          </div>
        </div>

        <p className="foot-word" aria-hidden="true">
          {"NEPTUN".split("").map((letter, index) => (
            <span key={index} style={{ "--i": index } as React.CSSProperties}>
              {letter}
            </span>
          ))}
        </p>

        <div className="foot-bottom">
          <p>© 2026 {SCHOOL.name}</p>
          <p className="foot-legal">
            <Link href="/regulamin">Regulamin</Link>
            <Link href="/rodo">RODO i wizerunek</Link>
          </p>
          <details className="foot-credits">
            <summary>Źródła zdjęć</summary>
            <p>Zdjęcia ilustracyjne z Wikimedia Commons, na wolnych licencjach.</p>
            <ul>
              {PHOTO_CREDITS.map((credit) => (
                <li key={credit.href}>
                  <a href={credit.href} rel="noopener noreferrer" target="_blank">
                    {credit.label}
                  </a>{" "}
                  — {credit.author}
                </li>
              ))}
            </ul>
          </details>
          <a href={home ? "#start" : "/"} className="foot-top" aria-label="Wróć na górę strony">
            <ArrowUp size={18} />
          </a>
        </div>
      </div>
    </footer>
  );
}
