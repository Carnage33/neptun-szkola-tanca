import Link from "next/link";

export function Subpage({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="demo-witryna" data-motion="standard">
      <header className="nav" data-scrolled="false" data-style="solid">
        <div className="wrap nav-inner">
          <Link className="brand" href="/">
            <span className="brand-logo">
              <img src="/logo.svg" alt="Szkoła Tańca Neptun" />
            </span>
            <span className="brand-text">
              <span className="brand-name">Neptun</span>
              <span className="brand-sub">Koszalin</span>
            </span>
          </Link>
          <div className="nav-actions">
            <Link href="/#contact" className="btn btn-primary btn-nav">
              Kontakt
            </Link>
          </div>
        </div>
      </header>
      <main className="band subpage">
        <div className="wrap">
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="title">{title}</h1>
          <div className="prose">{children}</div>
          <p style={{ marginTop: "2.2rem" }}>
            <Link href="/" className="btn btn-outline">
              Wróć na stronę główną
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
