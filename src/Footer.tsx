import { PartnersModalTrigger } from "./PartnersModalTrigger.tsx";
import { useLang } from "./lang/LangContext";
import "./Footer.css";

export const Footer = () => {
  const lang = useLang();
  const footerLogoSrc = `${import.meta.env.BASE_URL}terminy leczenia nfz.jpg`;

  if (lang === "en") {
    return (
      <footer className="site-footer">
        <article>
          <h2>NFZ Treatment Dates – Current Data</h2>
          <img
            className="site-footer-logo"
            src={footerLogoSrc}
            alt="Terminy leczenia NFZ"
          />
          <p>
            The <b>NFZ treatment dates</b> service lets you quickly search
            available appointment and procedure dates covered by the National
            Health Fund (NFZ). Data is fetched directly from the NFZ portal and
            updated continuously.
          </p>
          <p>
            Using our <b>NFZ treatment date</b> search engine you can compare
            waiting times for medical services across different facilities and
            provinces. Find the next available specialist appointments, surgical
            procedures, rehabilitation, diagnostics, and more.
          </p>
          <p>
            Check <b>NFZ treatment dates</b> in your region. Select a province,
            type of service, or a specific facility. The search engine covers
            all 16 provinces and over 470 types of medical services.
          </p>
          <p>Source data comes from the official portal maintained by NFZ.</p>
          <PartnersModalTrigger />
        </article>
      </footer>
    );
  }

  return (
    <footer className="site-footer">
      <article>
        <h2>Terminy leczenia NFZ aktualne dane</h2>
        <img
          className="site-footer-logo"
          src={footerLogoSrc}
          alt="Terminy leczenia NFZ"
        />
        <p>
          Serwis <b>terminy leczenia NFZ</b> umożliwia szybkie wyszukiwanie
          dostępnych terminów wizyt i zabiegów w ramach NFZ. Dane są pobierane
          bezpośrednio ze strony NFZ i aktualizowane na bieżąco.
        </p>
        <p>
          Dzięki naszej wyszukiwarce <b>terminów leczenia NFZ</b> możesz
          porównać czasy oczekiwania na świadczenia medyczne w różnych
          placówkach i województwach. Znajdziesz tutaj informacje o pierwszych
          wolnych terminach u specjalistów, na zabiegi operacyjne,
          rehabilitację, diagnostykę i wiele innych.
        </p>
        <p>
          Sprawdź <b>terminy leczenia NFZ</b> w swoim regionie. Wybierz
          województwo, rodzaj świadczenia lub konkretną placówkę. Wyszukiwarka
          obsługuje wszystkie 16 województw i ponad 470 rodzajów świadczeń
          medycznych.
        </p>
        <p>
          Dane źródłowe pochodzą z oficjalnego portalu prowadzonego przez NFZ.
        </p>
        <PartnersModalTrigger />
      </article>
    </footer>
  );
};
