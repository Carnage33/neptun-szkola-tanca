import { Enhance } from "@/components/Enhance";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import {
  ArrowRight,
  Bolt,
  Calendar,
  Check,
  Clock,
  Crown,
  Heart,
  Mic,
  Music,
  Pin,
  Plus,
  Sparkle,
  User,
  Users,
  Wallet,
} from "@/components/icons";
import {
  COURSES,
  DAY_NAMES,
  DAY_SHORT,
  IMAGES,
  OPENING_ISO,
  PRIVATE_HOURS,
  PRIVATE_PRICE,
  SCHOOL,
  scheduleRows,
  type Level,
  type Style,
  type Weekday,
} from "@/content/site";

type Vars = React.CSSProperties & Record<`--${string}`, number | string>;
const vars = (value: Record<string, number | string>) =>
  Object.fromEntries(Object.entries(value).map(([key, item]) => [`--${key}`, item])) as Vars;

const DANCES = [
  "Taniec użytkowy",
  "Tango argentyńskie",
  "Flamenco",
  "Latino Solo TUMBAO",
  "Walc angielski",
  "Cha-cha-cha",
  "Disco fox",
  "Salsa",
  "Rumba",
  "Jive",
  "Pierwszy taniec",
];

const STYLES: Array<{
  id: string;
  tab: string;
  style: Style;
  eyebrow: string;
  title: string;
  image: { src: string; alt: string } | null;
  text: string[];
  book: string;
  bookLabel: string;
  program?: Array<{ title: string; items: string[] }>;
}> = [
  {
    id: "uzytkowy",
    tab: "Taniec użytkowy",
    style: "Taniec użytkowy",
    eyebrow: "W parach · 18–80+",
    title: "Zatańczysz na każdej imprezie",
    image: IMAGES.uzytkowy,
    text: [
      "Uniwersalny kurs tańca w parach: PARTY DANCE, czyli jak tańczyć na weselu, przyjęciu czy dyskotece i jak prowadzić partnerkę bez stresu.",
      "Trzy poziomy, cykl 3 miesięcy po 4 spotkania. Zaczynasz od zera albo dołączasz do grupy na swoim poziomie.",
    ],
    book: "uzytkowy-podstawowy",
    bookLabel: "Zapisz się od podstaw",
    program: [
      {
        title: "Program: poziom podstawowy",
        items: [
          "1. miesiąc: czwórkrok, walc angielski, swing & blues, disco samba",
          "2. miesiąc: nowe figury, disco fox, cha-cha-cha, rock & roll",
          "3. miesiąc: walc wiedeński, rumba, jive, salsa",
        ],
      },
      {
        title: "Program: poziom średniozaawansowany",
        items: [
          "1. miesiąc: po 4 figury walca angielskiego, swing & blues i disco samby",
          "2. miesiąc: po 4 figury disco fox, cha-cha-cha i rock & rolla",
          "3. miesiąc: walc wiedeński oraz figury rumby, jive'a i salsy",
        ],
      },
      {
        title: "Program: klub tańca",
        items: [
          "Standard: walc angielski, tango, walc wiedeński, slowfox, quickstep",
          "Latino: samba, cha-cha-cha, rumba, paso doble, jive, salsa",
        ],
      },
    ],
  },
  {
    id: "tango",
    tab: "Tango argentyńskie",
    style: "Tango",
    eyebrow: "W parach · nowa grupa od 18.11",
    title: "Tango, które zaczyna się od objęcia",
    image: IMAGES.tango,
    text: [
      "Kurs tanga argentyńskiego od pierwszego kroku: systematycznie, klarownie, od najprostszych rzeczy.",
      "Zajęcia co tydzień. Uczymy słuchania partnera i muzyki, a nie tylko figur — dlatego tango wciąga na lata.",
    ],
    book: "tango-podstawy",
    bookLabel: "Zapisz się na tango",
  },
  {
    id: "flamenco",
    tab: "Flamenco",
    style: "Flamenco",
    eyebrow: "Solo · bez partnera",
    title: "Flamenco i tajemnicze duende",
    image: IMAGES.flamenco,
    text: [
      "Taniec z Andaluzji: praca ramion, dłoni i palców, a stopy grają jak instrument perkusyjny.",
      "Artyści flamenco mówią o duende — chwili, w której znika trema i zostaje czysta ekspresja. Pokażemy Ci, jak do niej dojść. Zajęcia raz w tygodniu, 75–90 minut.",
    ],
    book: "flamenco-podstawy",
    bookLabel: "Zapisz się na flamenco",
  },
  {
    id: "tumbao",
    tab: "Latino Solo TUMBAO",
    style: "Latino",
    eyebrow: "Solo · taniec indywidualistów",
    title: "Latino Solo TUMBAO",
    image: null,
    text: [
      "Rytmy latino i afro dla Pań i Panów: salsa, merengue, cumbia, cha-cha-cha, samba, reggaeton, rumba i bachata. Partner nie jest potrzebny.",
      "Proste układy, żywiołowa muzyka i porządna dawka ruchu. Taneczna alternatywa aerobiku, po której poczujesz się pewnie na każdej imprezie.",
    ],
    book: "tumbao",
    bookLabel: "Zapisz się na TUMBAO",
  },
];

const LEVEL_FILTERS = [
  { id: "all", label: "Wszystkie" },
  { id: "Początkujący", label: "Od podstaw" },
  { id: "Średniozaawansowani", label: "Średniozaawansowani" },
  { id: "Zaawansowani", label: "Zaawansowani" },
  { id: "solo", label: "Bez partnera" },
];

const LEVEL_SHORT: Record<Level, string> = {
  Początkujący: "Od podstaw",
  Średniozaawansowani: "Średni",
  Zaawansowani: "Zaawansowani",
  "Wszystkie poziomy": "Każdy poziom",
};

const FAQ = [
  {
    q: "Czy muszę umieć tańczyć?",
    a: "Nie. Szkoła jest nowa i większość grup rusza od zera. Jeśli tańczyłeś wcześniej, wybierz grupę średniozaawansowaną albo zaawansowaną.",
  },
  {
    q: "Czy trzeba mieć partnera?",
    a: "Nie zawsze. Flamenco, Latino Solo TUMBAO i Taniec 60+ tańczysz solo. Na kursy tańca w parach najlepiej przyjść we dwoje — w planie zajęć każda grupa ma oznaczenie „Solo” albo „W parach”.",
  },
  {
    q: "Kiedy startują zajęcia?",
    a: "Wielkie otwarcie jest we wtorek 10 listopada 2026 o 17:00. Regularne zajęcia ruszają w czwartek 12 listopada, a nowa grupa tanga argentyńskiego — w środę 18 listopada.",
  },
  {
    q: "Ile kosztuje kurs i kiedy płacę?",
    a: "Kurs tańca to 250 zł za miesiąc (4 spotkania) albo 690 zł za 12 spotkań. Rezerwacja online jest bezpłatna — płacisz na miejscu, na pierwszych zajęciach.",
  },
  {
    q: "Jak umówić lekcję indywidualną?",
    a: "Wybierz „Lekcja indywidualna” w zapisach online i jeden z wolnych terminów. Lekcja trwa 60 minut i kosztuje 150 zł od osoby albo od pary.",
  },
  {
    q: "Przygotujecie nas do pierwszego tańca?",
    a: "Tak. Od pierwszego tygodnia prowadzimy lekcje dla Par Młodych — zwykle walc wiedeński albo angielski, ale dopasujemy się do Waszej muzyki.",
  },
  {
    q: "Gdzie odbywają się zajęcia?",
    a: "W nowej sali w centrum Koszalina. Dokładny adres i wskazówki dojazdu dostaniesz razem z potwierdzeniem zapisu.",
  },
];

function groupPrivateHours() {
  const days = new Map<Weekday, string[]>();
  PRIVATE_HOURS.forEach(({ day, from, to }) => {
    days.set(day, [...(days.get(day) ?? []), `${from}–${to}`]);
  });
  return [...days.entries()];
}

export default function HomePage() {
  const rows = scheduleRows();
  const days = ([1, 2, 3, 4, 5] as Weekday[]).map((day) => ({ day, rows: rows.filter((row) => row.day === day) }));

  return (
    <>
      <SiteHeader home />
      <main id="tresc">
        {/* HERO */}
        <section id="start" className="hero dark">
          <div className="hero-bg" aria-hidden="true">
            <span className="blob blob-1" />
            <span className="blob blob-2" />
            <span className="blob blob-3" />
            <span className="hero-lines" />
          </div>
          <div className="wrap hero-inner">
            <div className="hero-copy">
              <p className="pill hero-in" style={vars({ d: 0 })}>
                <span className="pulse" aria-hidden="true" />
                Wielkie otwarcie · 10.11.2026
              </p>
              <h1 className="hero-title">
                <span className="line">
                  <span className="hero-in" style={vars({ d: 1 })}>
                    Nowa szkoła.
                  </span>
                </span>
                <span className="line">
                  <span className="hero-in grad" style={vars({ d: 2 })}>
                    Nowa energia.
                  </span>
                </span>
              </h1>
              <p className="hero-lead hero-in" style={vars({ d: 3 })}>
                10 listopada otwieramy Szkołę Tańca Neptun w Koszalinie. Taniec użytkowy, tango, flamenco
                i latino — od pierwszego kroku, solo albo w parze.
              </p>
              <div className="actions hero-in" style={vars({ d: 4 })}>
                <a href="#zapisy" className="btn btn-primary btn-lg magnetic">
                  Zapisz się online <ArrowRight size={18} />
                </a>
                <a href="#plan" className="btn btn-glass btn-lg">
                  Zobacz plan zajęć
                </a>
              </div>
              <ul className="hero-facts hero-in" style={vars({ d: 5 })}>
                <li>
                  <Check size={16} /> Bez doświadczenia
                </li>
                <li>
                  <Check size={16} /> Bez partnera też
                </li>
                <li>
                  <Check size={16} /> Płacisz na miejscu
                </li>
              </ul>
            </div>

            <div className="hero-visual">
              <div className="hero-frame" data-tilt>
                <img
                  src={IMAGES.hero.src}
                  alt={IMAGES.hero.alt}
                  width={1330}
                  height={2000}
                  fetchPriority="high"
                  data-parallax="0.06"
                />
                <span className="hero-frame-shine" aria-hidden="true" />
              </div>
              <svg className="hero-badge" viewBox="0 0 200 200" aria-hidden="true">
                <defs>
                  <path id="badge-circle" d="M100,100 m-72,0 a72,72 0 1,1 144,0 a72,72 0 1,1 -144,0" />
                </defs>
                <circle cx="100" cy="100" r="98" className="hero-badge-bg" />
                <g className="hero-badge-ring">
                  <text>
                    <textPath href="#badge-circle" textLength="448" lengthAdjust="spacing">
                      WIELKIE OTWARCIE • 10.11.2026 •
                    </textPath>
                  </text>
                </g>
                <path className="hero-badge-star" d="M100 72l6.5 21.5L128 100l-21.5 6.5L100 128l-6.5-21.5L72 100l21.5-6.5z" />
              </svg>

              <div className="countdown" data-countdown={OPENING_ISO} role="timer" aria-label="Odliczanie do otwarcia">
                <p className="countdown-title">Do otwarcia zostało</p>
                <div className="countdown-grid">
                  <div>
                    <b data-unit="d">--</b>
                    <span>dni</span>
                  </div>
                  <div>
                    <b data-unit="h">--</b>
                    <span>godz.</span>
                  </div>
                  <div>
                    <b data-unit="m">--</b>
                    <span>min</span>
                  </div>
                  <div>
                    <b data-unit="s">--</b>
                    <span>sek</span>
                  </div>
                </div>
                <p className="countdown-foot">wt. 10.11 · 17:00 · wstęp wolny</p>
              </div>
            </div>
          </div>
          <a href="#o-szkole" className="scroll-cue" aria-label="Przewiń do sekcji O szkole">
            <span />
          </a>
        </section>

        {/* MARQUEE */}
        <div className="marquee" role="img" aria-label={`Style tańca: ${DANCES.join(", ")}`}>
          {[0, 1].map((row) => (
            <div key={row} className={row ? "marquee-row is-reverse" : "marquee-row"} aria-hidden="true">
              <div className="marquee-track">
                {[...DANCES, ...DANCES].map((dance, index) => (
                  <span key={index}>
                    {dance}
                    <Sparkle size={18} />
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* O SZKOLE */}
        <section id="o-szkole" className="band">
          <div className="wrap">
            <div className="about">
              <div className="about-copy">
                <p className="eyebrow" data-reveal>
                  O szkole
                </p>
                <h2 className="title" data-reveal>
                  Nauczymy tańczyć <em>każdego</em>
                </h2>
                <p className="lead" data-reveal>
                  Neptun to zupełnie nowa szkoła tańca w Koszalinie. Świeża sala, nowe grupy i instruktorzy,
                  którzy pamiętają, jak wygląda pierwszy raz na parkiecie.
                </p>
                <p className="body" data-reveal>
                  Nie musisz umieć tańczyć ani przychodzić w parze. Większość grup rusza od zera, a jeśli
                  tańczyłeś wcześniej — znajdziesz grupę na swoim poziomie.
                </p>
              </div>
              <figure className="about-media" data-reveal="clip">
                <img src={IMAGES.about.src} alt={IMAGES.about.alt} width={1920} height={1274} loading="lazy" data-parallax="0.05" />
                <figcaption className="float-card">
                  <span className="feature-icon">
                    <Heart size={18} />
                  </span>
                  <span>
                    <strong>Bez doświadczenia?</strong>
                    Idealnie. Od tego jesteśmy.
                  </span>
                </figcaption>
              </figure>
            </div>

            <div className="features">
              {[
                { icon: <Sparkle />, title: "Od pierwszego kroku", text: "W każdym stylu jest grupa od podstaw." },
                { icon: <User />, title: "Solo albo w parze", text: "Flamenco, TUMBAO i 60+ bez partnera." },
                { icon: <Users />, title: "Dla dorosłych 18–80+", text: "Także grupa 60+ przed południem." },
                { icon: <Wallet />, title: "Płacisz na miejscu", text: "Rezerwacja online jest bezpłatna." },
              ].map((feature, index) => (
                <div key={feature.title} className="feature spot" data-reveal style={vars({ i: index })}>
                  <span className="feature-icon">{feature.icon}</span>
                  <h3>{feature.title}</h3>
                  <p>{feature.text}</p>
                </div>
              ))}
            </div>

            <dl className="stats" data-reveal>
              <div>
                <dt>wielkie otwarcie</dt>
                <dd>10.11</dd>
              </div>
              <div>
                <dt>grup na start</dt>
                <dd data-count={COURSES.length}>{COURSES.length}</dd>
              </div>
              <div>
                <dt>style tańca</dt>
                <dd data-count={4}>4</dd>
              </div>
              <div>
                <dt>zł za rezerwację</dt>
                <dd>0</dd>
              </div>
            </dl>
          </div>
        </section>

        {/* KURSY */}
        <section id="kursy" className="band dark courses">
          <div className="section-glow" aria-hidden="true" />
          <div className="wrap">
            <div className="head head-center">
              <p className="eyebrow" data-reveal>
                Kursy
              </p>
              <h2 className="title" data-reveal>
                Cztery rytmy <em>na start</em>
              </h2>
              <p className="lead" data-reveal>
                Od otwarcia tańczymy użytkowy, tango, flamenco i Latino Solo TUMBAO. Wybierz styl, a potem
                grupę na swoim poziomie.
              </p>
            </div>

            <div className="tabs" data-tabs data-reveal>
              <div className="tab-list" role="tablist" aria-label="Style tańca">
                {STYLES.map((style, index) => (
                  <button
                    key={style.id}
                    type="button"
                    role="tab"
                    id={`tab-${style.id}`}
                    aria-controls={`panel-${style.id}`}
                    aria-selected={index === 0}
                    tabIndex={index === 0 ? 0 : -1}
                    className="tab"
                  >
                    {style.tab}
                  </button>
                ))}
              </div>

              {STYLES.map((style, index) => {
                const groups = COURSES.filter((course) => course.style === style.style);
                return (
                  <div
                    key={style.id}
                    id={`panel-${style.id}`}
                    role="tabpanel"
                    aria-labelledby={`tab-${style.id}`}
                    className="tab-panel"
                    hidden={index !== 0}
                  >
                    <div className="course">
                      <div className="course-media">
                        {style.image ? (
                          <img src={style.image.src} alt={style.image.alt} loading="lazy" />
                        ) : (
                          <div className="tumbao" aria-hidden="true">
                            <span className="tumbao-word">TUMBAO</span>
                            <span className="tumbao-eq">
                              {Array.from({ length: 18 }, (_, bar) => (
                                <i key={bar} style={vars({ b: bar })} />
                              ))}
                            </span>
                            <span className="tumbao-tags">salsa · merengue · cumbia · samba · reggaeton · bachata</span>
                          </div>
                        )}
                        <span className="course-chip">{style.eyebrow}</span>
                      </div>
                      <div className="course-body">
                        <h3 className="title-sm">{style.title}</h3>
                        {style.text.map((paragraph) => (
                          <p key={paragraph.slice(0, 32)}>{paragraph}</p>
                        ))}
                        <p className="course-label">Grupy — kliknij, żeby się zapisać</p>
                        <ul className="course-groups">
                          {groups.map((course) => (
                            <li key={course.id}>
                              <button type="button" className="course-group" data-book={course.id}>
                                <span className="course-group-main">
                                  <strong>{course.short}</strong>
                                  <span>
                                    {course.slots.map((slot) => `${DAY_SHORT[slot.day]} ${slot.start}–${slot.end}`).join(" · ")}
                                    {course.startsOn ? " · start 18.11" : ""}
                                  </span>
                                </span>
                                <span className="course-group-price">
                                  {course.price}
                                  <small>{course.priceNote.split(" · ")[0]}</small>
                                </span>
                                <ArrowRight size={16} />
                              </button>
                            </li>
                          ))}
                        </ul>
                        {style.program ? (
                          <div className="accordion">
                            {style.program.map((level) => (
                              <details key={level.title} className="qa">
                                <summary>
                                  {level.title}
                                  <Plus size={18} />
                                </summary>
                                <ul className="qa-body ticks">
                                  {level.items.map((item) => (
                                    <li key={item}>{item}</li>
                                  ))}
                                </ul>
                              </details>
                            ))}
                          </div>
                        ) : null}
                        <div className="actions">
                          <button type="button" className="btn btn-primary" data-book={style.book}>
                            {style.bookLabel} <ArrowRight size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* INDYWIDUALNIE */}
        <section id="indywidualnie" className="band">
          <div className="wrap">
            <div className="head">
              <p className="eyebrow" data-reveal>
                Indywidualnie
              </p>
              <h2 className="title" data-reveal>
                Sala i instruktor <em>tylko dla Was</em>
              </h2>
              <p className="lead" data-reveal>
                Lekcje dla osoby albo pary, w Waszym tempie. Także przygotowanie do pierwszego tańca.
              </p>
            </div>

            <div className="private">
              <article className="card private-card spot" data-reveal style={vars({ i: 0 })}>
                <span className="feature-icon">
                  <User />
                </span>
                <h3 className="title-sm">Lekcja indywidualna</h3>
                <p>
                  Dowolny styl, dowolny poziom. Pojedyncze godziny albo stały cykl spotkań — dopasujemy się do
                  Ciebie.
                </p>
                <p className="price-line">
                  <strong>{PRIVATE_PRICE.price}</strong> {PRIVATE_PRICE.note}
                </p>
                <div className="hours">
                  <p className="hours-title">
                    <Clock size={16} /> Wolne okna sali
                  </p>
                  <dl>
                    {groupPrivateHours().map(([day, ranges]) => (
                      <div key={day}>
                        <dt>{DAY_NAMES[day]}</dt>
                        <dd>{ranges.join(", ")}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
                <div className="actions">
                  <button type="button" className="btn btn-dark" data-book="indywidualna">
                    Zarezerwuj lekcję <ArrowRight size={16} />
                  </button>
                </div>
              </article>

              <article className="card wedding" data-reveal style={vars({ i: 1 })}>
                <div className="wedding-media">
                  <img src={IMAGES.wedding.src} alt={IMAGES.wedding.alt} loading="lazy" />
                </div>
                <div className="wedding-body">
                  <span className="feature-icon">
                    <Heart />
                  </span>
                  <h3 className="title-sm">Pierwszy taniec</h3>
                  <p>
                    Przygotujemy Was do pierwszego tańca do wybranej muzyki — najczęściej walc wiedeński albo
                    angielski. Harmonogram ustalamy tak, żeby spokojnie zdążyć przed weselem.
                  </p>
                  <p className="price-line">
                    <strong>{PRIVATE_PRICE.price}</strong> 60 min · para
                  </p>
                  <div className="actions">
                    <button type="button" className="btn btn-primary" data-book="pierwszy-taniec">
                      Umów pierwszą lekcję <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* PLAN ZAJĘĆ */}
        <section id="plan" className="band band-alt">
          <div className="wrap">
            <div className="head head-split">
              <div>
                <p className="eyebrow" data-reveal>
                  Plan zajęć
                </p>
                <h2 className="title" data-reveal>
                  Tydzień w <em>Neptunie</em>
                </h2>
                <p className="lead" data-reveal>
                  Regularne zajęcia od czwartku 12 listopada. Kliknij grupę, żeby od razu przejść do zapisu.
                </p>
              </div>
            </div>

            <div className="plan" data-plan>
              <div className="plan-controls" data-reveal>
                <div className="chips" role="toolbar" aria-label="Dzień tygodnia">
                  <button type="button" className="chip" data-day="all" aria-pressed="true">
                    Cały tydzień <span className="chip-count">{rows.length}</span>
                  </button>
                  {days.map(({ day, rows: dayRows }) => (
                    <button key={day} type="button" className="chip" data-day={day} aria-pressed="false">
                      <span className="only-wide">{DAY_NAMES[day]}</span>
                      <span className="only-narrow">{DAY_SHORT[day]}</span>
                      <span className="chip-count">{dayRows.length}</span>
                    </button>
                  ))}
                </div>
                <div className="chips chips-soft" role="toolbar" aria-label="Poziom">
                  {LEVEL_FILTERS.map((filter, index) => (
                    <button key={filter.id} type="button" className="chip" data-level={filter.id} aria-pressed={index === 0}>
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="plan-days">
                {days.map(({ day, rows: dayRows }) => (
                  <div key={day} className="plan-day" data-plan-day={day}>
                    <h3 className="plan-day-name">{DAY_NAMES[day]}</h3>
                    <div className="plan-rows">
                      {dayRows.map((row) => (
                        <button
                          key={`${row.course.id}-${row.day}`}
                          type="button"
                          className="plan-row"
                          data-book={row.course.id}
                          data-level={row.course.level}
                          data-solo={row.course.solo ? "true" : "false"}
                        >
                          <span className="plan-time">
                            {row.start}
                            <small>do {row.end}</small>
                          </span>
                          <span className="plan-main">
                            <strong>{row.course.title}</strong>
                            <span>{row.course.blurb}</span>
                          </span>
                          <span className="plan-tags">
                            <span className="tag" data-tone={row.course.level === "Początkujący" ? "new" : undefined}>
                              {LEVEL_SHORT[row.course.level]}
                            </span>
                            <span className="tag" data-tone={row.course.solo ? "solo" : undefined}>
                              {row.course.solo ? "Solo" : "W parach"}
                            </span>
                            {row.course.startsOn ? (
                              <span className="tag" data-tone="hot">
                                Od 18.11
                              </span>
                            ) : null}
                          </span>
                          <span className="plan-cta" aria-hidden="true">
                            <ArrowRight size={18} />
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
                <p className="plan-empty" role="status" hidden>
                  Brak zajęć dla wybranych filtrów. Zmień dzień albo poziom.
                </p>
              </div>
              <p className="plan-note">
                <Clock size={16} />
                <span>
                  Raz w miesiącu robimy praktykę taneczną dla wszystkich grup — termin podajemy z wyprzedzeniem.
                  Lekcje indywidualne umawiasz w wolnych oknach sali.
                </span>
              </p>
            </div>
          </div>
        </section>

        {/* CENNIK */}
        <section id="cennik" className="band dark">
          <div className="section-glow is-right" aria-hidden="true" />
          <div className="wrap">
            <div className="head head-center">
              <p className="eyebrow" data-reveal>
                Cennik
              </p>
              <h2 className="title" data-reveal>
                Proste ceny, <em>bez haczyków</em>
              </h2>
              <p className="lead" data-reveal>
                Ceny od osoby, chyba że zaznaczono inaczej. Rezerwujesz online za darmo, płacisz na miejscu.
              </p>
            </div>

            <div className="prices">
              <article className="price-card is-featured spot" data-reveal style={vars({ i: 0 })}>
                <span className="price-badge">Najczęściej wybierany</span>
                <h3>Kurs tańca</h3>
                <p className="price-value">
                  250 zł<span>/ miesiąc</span>
                </p>
                <ul className="ticks">
                  <li>4 spotkania w miesiącu</li>
                  <li>Taniec użytkowy i Taniec 60+</li>
                  <li>
                    albo <strong>690 zł za 12 spotkań</strong> — oszczędzasz 60 zł
                  </li>
                </ul>
                <button type="button" className="btn btn-primary btn-block" data-book="uzytkowy-podstawowy">
                  Zapisz się
                </button>
              </article>
              <article className="price-card spot" data-reveal style={vars({ i: 1 })}>
                <h3>Lekcja indywidualna</h3>
                <p className="price-value">
                  150 zł<span>/ 60 min</span>
                </p>
                <ul className="ticks">
                  <li>Osoba albo para — ta sama cena</li>
                  <li>Dowolny styl i poziom</li>
                  <li>Także pierwszy taniec</li>
                </ul>
                <button type="button" className="btn btn-glass btn-block" data-book="indywidualna">
                  Zarezerwuj
                </button>
              </article>
              <article className="price-card spot" data-reveal style={vars({ i: 2 })}>
                <h3>Latino Solo TUMBAO</h3>
                <p className="price-value">
                  35 zł<span>/ wejście</span>
                </p>
                <ul className="ticks">
                  <li>Karnet 8 wejść — 250 zł</li>
                  <li>Karnet 10 wejść — 300 zł</li>
                  <li>Wtorki i czwartki, 17:00</li>
                </ul>
                <button type="button" className="btn btn-glass btn-block" data-book="tumbao">
                  Zapisz się
                </button>
              </article>
            </div>

            <div className="price-list" data-reveal>
              {[
                ["Tango argentyńskie", "każdy poziom · miesiąc", "160 zł"],
                ["Flamenco od podstaw", "cykl 4 spotkań", "250 zł"],
                ["Flamenco zaawansowane", "każda grupa · miesiąc", "250 zł"],
                ["Klub tańca towarzyskiego", "składka miesięczna", "250 zł"],
              ].map(([name, note, price]) => (
                <div key={name} className="price-row">
                  <span>
                    <strong>{name}</strong>
                    <small>{note}</small>
                  </span>
                  <i aria-hidden="true" />
                  <b>{price}</b>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* WYDARZENIA */}
        <section id="wydarzenia" className="band">
          <div className="wrap">
            <div className="head head-split">
              <div>
                <p className="eyebrow" data-reveal>
                  Wydarzenia
                </p>
                <h2 className="title" data-reveal>
                  Taniec na Twoje <em>wydarzenie</em>
                </h2>
                <p className="lead" data-reveal>
                  Wesele, studniówka, firmowy wieczór? Przygotujemy pokaz, krótką naukę albo cały program.
                </p>
              </div>
              <div className="actions" data-reveal>
                <a href="#kontakt" className="btn btn-dark" data-topic="Wydarzenie">
                  Zapytaj o termin <ArrowRight size={16} />
                </a>
              </div>
            </div>

            <div className="events">
              {[
                {
                  icon: <Mic />,
                  title: "Programy pokazowe",
                  text: "Show w tańcach latynoamerykańskich lub standardowych, flamenco solo albo w grupie 3–5 osób.",
                },
                {
                  icon: <Bolt />,
                  title: "Ekspresowa nauka tańca",
                  text: "Dwie półgodzinne lekcje w trakcie imprezy: salsa, merengue, cumbia, cha-cha-cha, disco fox.",
                },
                {
                  icon: <Music />,
                  title: "Warsztaty taneczne",
                  text: "Co najmniej dwie godziny jednego stylu — salsy, flamenco albo tańca towarzyskiego.",
                },
                {
                  icon: <Crown />,
                  title: "Polonez na studniówkę",
                  text: "Choreografia figur zbiorowych na każdym poziomie. Próby prowadzimy w Waszej szkole.",
                },
              ].map((event, index) => (
                <article key={event.title} className="card event spot" data-reveal style={vars({ i: index })}>
                  <span className="event-num">{String(index + 1).padStart(2, "0")}</span>
                  <span className="feature-icon">{event.icon}</span>
                  <h3>{event.title}</h3>
                  <p>{event.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* OTWARCIE */}
        <section id="otwarcie" className="band band-alt">
          <div className="wrap">
            <div className="head head-center">
              <p className="eyebrow" data-reveal>
                Otwarcie
              </p>
              <h2 className="title" data-reveal>
                Tak <em>ruszamy</em>
              </h2>
            </div>
            <ol className="timeline" data-timeline>
              {[
                {
                  date: "10.11",
                  day: "wtorek, 17:00",
                  title: "Wielkie otwarcie",
                  text: "Pokazy, krótkie lekcje próbne i poznanie instruktorów. Wstęp wolny — wpadnij ze znajomymi.",
                },
                {
                  date: "12.11",
                  day: "czwartek",
                  title: "Start grup",
                  text: "Ruszają taniec użytkowy, flamenco, Latino Solo TUMBAO i Taniec 60+.",
                },
                {
                  date: "18.11",
                  day: "środa, 19:15",
                  title: "Tango od podstaw",
                  text: "Pierwsze zajęcia nowej grupy tanga argentyńskiego.",
                },
                {
                  date: "Sezon",
                  day: "cały rok",
                  title: "Lekcje indywidualne",
                  text: "Także pierwszy taniec. Termin wybierasz online, w wolnych oknach sali.",
                },
              ].map((step, index) => (
                <li key={step.title} data-reveal style={vars({ i: index })}>
                  <span className="timeline-dot" aria-hidden="true" />
                  <p className="timeline-date">
                    {step.date}
                    <small>{step.day}</small>
                  </p>
                  <div className="timeline-card">
                    <h3>{step.title}</h3>
                    <p>{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* CTA */}
        <section className="cta-band dark" aria-labelledby="cta-title">
          <div className="cta-rings" aria-hidden="true">
            <i />
            <i />
            <i />
          </div>
          <div className="wrap cta-inner" data-reveal>
            <p className="eyebrow">10 listopada · Koszalin</p>
            <h2 className="title" id="cta-title">
              Pierwszy krok jest najtrudniejszy. <em>Resztę zrobimy razem.</em>
            </h2>
            <div className="actions">
              <a href="#zapisy" className="btn btn-light btn-lg magnetic">
                Zapisz się online <ArrowRight size={18} />
              </a>
              <a href="#plan" className="btn btn-glass btn-lg">
                Plan zajęć
              </a>
            </div>
          </div>
        </section>

        {/* ZAPISY */}
        <section id="zapisy" className="band">
          <div className="wrap">
            <div className="head">
              <p className="eyebrow" data-reveal>
                Zapisy online
              </p>
              <h2 className="title" data-reveal>
                Zarezerwuj miejsce <em>w minutę</em>
              </h2>
              <p className="lead" data-reveal>
                Wybierz zajęcia, termin i zostaw dane. Rezerwacja jest bezpłatna — płacisz na miejscu.
              </p>
            </div>
            <div id="booking" className="booking-host" data-reveal>
              <noscript>
                <p className="booking-noscript">Zapisy online wymagają włączonej obsługi JavaScript.</p>
              </noscript>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="band band-alt">
          <div className="wrap faq">
            <div className="head">
              <p className="eyebrow" data-reveal>
                Pytania
              </p>
              <h2 className="title" data-reveal>
                Zanim wejdziesz <em>na parkiet</em>
              </h2>
              <p className="lead" data-reveal>
                Najczęstsze pytania przed otwarciem.
              </p>
              <div className="actions" data-reveal>
                <a href="#kontakt" className="btn btn-dark">
                  Inne pytanie? Napisz <ArrowRight size={16} />
                </a>
              </div>
            </div>
            <div className="faq-list">
              {FAQ.map((item, index) => (
                <details key={item.q} className="qa" data-reveal style={vars({ i: index })}>
                  <summary>
                    {item.q}
                    <Plus size={18} />
                  </summary>
                  <div className="qa-body">
                    <p>{item.a}</p>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* KONTAKT */}
        <section id="kontakt" className="band dark">
          <div className="section-glow" aria-hidden="true" />
          <div className="wrap contact">
            <div>
              <div className="head">
                <p className="eyebrow" data-reveal>
                  Kontakt
                </p>
                <h2 className="title" data-reveal>
                  Napisz, <em>odpowiemy</em>
                </h2>
                <p className="lead" data-reveal>
                  Pytanie o grupę, wydarzenie albo pierwszy taniec? Zostaw wiadomość. Na zajęcia zapiszesz się
                  od razu w zapisach online.
                </p>
              </div>
              <ul className="contact-list" data-reveal>
                <li>
                  <span className="feature-icon">
                    <Pin />
                  </span>
                  <span>
                    <small>Gdzie</small>
                    Nowa sala w centrum Koszalina
                    <em>Dokładny adres dostaniesz w potwierdzeniu zapisu</em>
                  </span>
                </li>
                <li>
                  <span className="feature-icon">
                    <Clock />
                  </span>
                  <span>
                    <small>Sala czynna</small>
                    {SCHOOL.hours}
                    <em>{SCHOOL.closed}</em>
                  </span>
                </li>
                <li>
                  <span className="feature-icon">
                    <Calendar />
                  </span>
                  <span>
                    <small>Zapisy</small>
                    <a href="#zapisy">Online, przez całą dobę</a>
                  </span>
                </li>
              </ul>
            </div>

            <form className="form" id="contact-form" noValidate data-reveal>
              <h3 className="title-sm">Formularz kontaktowy</h3>
              <div className="grid-2">
                <label className="field">
                  <span className="label">Imię i nazwisko</span>
                  <input className="input" name="name" placeholder="Jan Kowalski" autoComplete="name" maxLength={120} required />
                  <span className="field-error">Podaj imię i nazwisko.</span>
                </label>
                <label className="field">
                  <span className="label">E-mail</span>
                  <input
                    className="input"
                    name="email"
                    type="email"
                    inputMode="email"
                    placeholder="jan@example.com"
                    autoComplete="email"
                    required
                  />
                  <span className="field-error">Podaj poprawny e-mail.</span>
                </label>
              </div>
              <label className="field">
                <span className="label">Temat</span>
                <select className="input" name="topic" defaultValue="Kurs tańca użytkowego">
                  <option>Kurs tańca użytkowego</option>
                  <option>Tango argentyńskie</option>
                  <option>Flamenco</option>
                  <option>Latino Solo TUMBAO</option>
                  <option>Taniec 60+</option>
                  <option>Lekcje indywidualne</option>
                  <option>Pierwszy taniec</option>
                  <option>Wydarzenie</option>
                  <option>Inne</option>
                </select>
              </label>
              <label className="field">
                <span className="label">
                  Wiadomość <span className="counter" data-counter>0/600</span>
                </span>
                <textarea
                  className="input"
                  name="message"
                  rows={4}
                  maxLength={600}
                  required
                  placeholder="Np. zaczynamy od zera we dwoje — która grupa będzie dla nas?"
                />
                <span className="field-error">Napisz kilka słów.</span>
              </label>
              <label className="check">
                <input type="checkbox" name="consent" required />
                <span>
                  Zgadzam się na kontakt w sprawie mojego zapytania. Szczegóły w{" "}
                  <a href="/rodo">informacji o RODO</a>.
                </span>
              </label>
              <span className="field-error check-error">Zaznacz zgodę, żebyśmy mogli odpowiedzieć.</span>
              <button type="submit" className="btn btn-primary btn-lg btn-block">
                Wyślij wiadomość <ArrowRight size={18} />
              </button>
              <p className="hint">Wersja demonstracyjna: wiadomość zapisuje się na tym urządzeniu.</p>
            </form>
          </div>
        </section>
      </main>
      <SiteFooter home />
      <div className="toasts" role="status" aria-live="polite" />
      <Enhance />
    </>
  );
}
