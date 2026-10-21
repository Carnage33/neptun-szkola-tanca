import type { Metadata } from "next";
import { Subpage } from "@/components/Subpage";

export const metadata: Metadata = {
  title: "Regulamin szkoły i zajęć",
};

export default function RegulaminPage() {
  return (
    <Subpage eyebrow="Szkoła" title="Regulamin szkoły i zajęć">
      <p>
        Szkoła Tańca Neptun jest nowa. Wielkie otwarcie: 10 listopada 2026, sala przy ul. Piastowskiej 21
        w Koszalinie. Na zajęcia zapisujesz się online, w formularzu rezerwacji na stronie głównej.
        Rezerwacja jest bezpłatna. Opłatę uregulujesz na miejscu, na pierwszych zajęciach.
      </p>
      <h2>Udział</h2>
      <ul>
        <li>Kursy grupowe są dla dorosłych (18-80+ lat), o ile opis zajęć nie stanowi inaczej.</li>
        <li>Na zajęcia w parach najlepiej przyjść we dwoje. Latino Solo TUMBAO nie wymaga partnera.</li>
        <li>Lekcje indywidualne i pierwszy taniec rezerwujesz online, z wyprzedzeniem.</li>
        <li>Rezerwacja złożona na stronie jest bezpłatna i niezobowiązująca. Opłata za zajęcia jest pobierana w szkole.</li>
      </ul>
      <h2>Płatności</h2>
      <p>
        Aktualne ceny są w cenniku na stronie głównej. Kurs tańca to 250 zł miesięcznie od osoby
        albo 690 zł za 12 spotkań. Lekcja indywidualna kosztuje 150 zł za 60 minut. Składki klubowe
        i karnety TUMBAO są opisane przy poszczególnych zajęciach.
      </p>
      <h2>Odwołanie</h2>
      <p>
        Nieobecność i zmianę terminu lekcji indywidualnej zgłoś mailem jak najwcześniej, na
        taniec.koszalin@wp.pl, żeby szkoła mogła zwolnić salę. Godziny praktyk tanecznych podajemy
        z wyprzedzeniem.
      </p>
      <h2>Kontakt</h2>
      <p>
        E-mail: taniec.koszalin@wp.pl. Szczegóły udziału w konkretnej grupie wybierasz przy zapisie
        online.
      </p>
    </Subpage>
  );
}
