import type { Metadata } from "next";
import { Subpage } from "@/components/Subpage";

export const metadata: Metadata = {
  title: "Wizerunek i RODO",
};

export default function RodoPage() {
  return (
    <Subpage eyebrow="Szkoła" title="Zgoda na wizerunek i RODO">
      <p>
        Administratorem danych jest Szkoła Tańca Neptun, ul. Piastowska 21, 75-400 Koszalin,
        e-mail taniec.koszalin@wp.pl.
      </p>
      <h2>Po co zbieramy dane</h2>
      <p>
        Imię, nazwisko i e-mail z formularza kontaktowego oraz z zapisu na zajęcia służą do obsługi
        rezerwacji. Formularz zapisuje je w przeglądarce na tym urządzeniu i nie wysyła ich
        automatycznie mailem. Nie przekazujemy tych danych dalej i nie używamy ich do wysyłki reklam.
      </p>
      <h2>Jak długo</h2>
      <p>
        Dane z zapytania trzymamy tak długo, jak trzeba, żeby dokończyć kontakt w sprawie zajęć,
        a potem je usuwamy. O usunięcie danych możesz poprosić mailowo, na taniec.koszalin@wp.pl.
      </p>
      <h2>Wizerunek</h2>
      <p>
        Zdjęcia w galerii są materiałem ilustracyjnym tańca, na wolnych licencjach. To nie jest
        archiwum szkoły. Publikacja wizerunku uczestnika zajęć wymaga osobnej zgody. Zgodę można
        wycofać, pisząc na taniec.koszalin@wp.pl.
      </p>
      <h2>Twoje prawa</h2>
      <p>
        Możesz poprosić o dostęp do swoich danych, ich poprawienie albo usunięcie. Masz też prawo
        złożyć skargę do Prezesa Urzędu Ochrony Danych Osobowych.
      </p>
    </Subpage>
  );
}
