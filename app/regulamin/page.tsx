import type { Metadata } from "next";
import { Subpage } from "@/components/Subpage";

export const metadata: Metadata = {
  title: "Regulamin szkoły i zajęć",
};

export default function RegulaminPage() {
  return (
    <Subpage eyebrow="Szkoła" title="Regulamin szkoły i zajęć">
      <p>
        Szkoła Tańca Neptun to nowa szkoła tańca w Koszalinie. Wielkie otwarcie odbędzie się we wtorek
        10 listopada 2026 o 17:00, a regularne zajęcia ruszają w czwartek 12 listopada. Na zajęcia zapisujesz
        się online, w zapisach na stronie głównej. Rezerwacja jest bezpłatna, a opłatę uregulujesz na miejscu,
        na pierwszych zajęciach.
      </p>
      <h2>Udział</h2>
      <ul>
        <li>Kursy grupowe są dla dorosłych (18–80+ lat), o ile opis zajęć nie stanowi inaczej.</li>
        <li>
          Na zajęcia w parach najlepiej przyjść we dwoje. Flamenco, Latino Solo TUMBAO i Taniec 60+ nie wymagają
          partnera.
        </li>
        <li>Lekcje indywidualne i pierwszy taniec rezerwujesz online, w wolnych oknach sali.</li>
        <li>Rezerwacja złożona na stronie jest bezpłatna i niezobowiązująca.</li>
      </ul>
      <h2>Płatności</h2>
      <p>
        Aktualne ceny są w cenniku na stronie głównej. Kurs tańca kosztuje 250 zł miesięcznie od osoby
        (4 spotkania) albo 690 zł za 12 spotkań. Lekcja indywidualna kosztuje 150 zł za 60 minut, od osoby albo
        od pary. Ceny karnetów TUMBAO, tanga i klubów są podane w cenniku.
      </p>
      <h2>Odwołanie</h2>
      <p>
        Nieobecność albo zmianę terminu lekcji indywidualnej zgłoś przez formularz kontaktowy jak najwcześniej,
        żeby szkoła mogła zwolnić salę. Termin comiesięcznej praktyki tanecznej podajemy z wyprzedzeniem.
      </p>
      <h2>Kontakt</h2>
      <p>
        Pytania wyślesz przez formularz kontaktowy na stronie głównej. Szczegóły udziału w konkretnej grupie
        wybierasz przy zapisie online.
      </p>
    </Subpage>
  );
}
