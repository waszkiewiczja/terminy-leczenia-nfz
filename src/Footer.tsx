import { useLang } from "./lang/LangContext";
import { Link } from "react-router-dom";
import "./Footer.css";

export const Footer = () => {
  const lang = useLang();
  const footerLogoSrc = `${import.meta.env.BASE_URL}terminy-leczenia-nfz.jpg`;

  if (lang === "en") {
    return (
      <footer className="site-footer">
        <article>
          <h2>NFZ Treatment Dates – Current Data</h2>
          <img
            className="site-footer-logo"
            src={footerLogoSrc}
            alt="Terminy leczenia NFZ"
            width={1280}
            height={768}
            loading="lazy"
          />
          <p>
            The <strong>NFZ treatment dates</strong> service lets you quickly
            search available appointment and procedure dates covered by the
            National Health Fund (NFZ). Data is fetched directly from the NFZ
            portal and updated continuously.
          </p>
          <p>
            Using our NFZ treatment date search engine you can compare waiting
            times for medical services across different facilities and
            provinces. Find the next available specialist appointments, surgical
            procedures, rehabilitation, diagnostics, and more.
          </p>
          <p>
            Check NFZ treatment dates in your region. Select a province, type of
            service, or a specific facility. The search engine covers all 16
            provinces and over 470 types of medical services.
          </p>
          <p>
            Source data comes from the official NFZ portal:{" "}
            <a href="https://api.nfz.gov.pl/">https://api.nfz.gov.pl/</a>.
          </p>
          <p className="site-footer-disclaimer">
            This service is not an official website of the National Health Fund
            (NFZ) and is not affiliated with it.
          </p>
          <p className="site-footer-legal-links">
            <Link to="/en/regulamin/">Terms of service</Link>
            <span aria-hidden="true">|</span>
            <Link to="/en/polityka-prywatnosci/">Privacy policy</Link>
            <span aria-hidden="true">|</span>
            <Link to="/en/kontakt/">Contact</Link>
          </p>
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
          width={1280}
          height={768}
          loading="lazy"
        />
        <p>
          Serwis <strong>terminy leczenia NFZ</strong> umożliwia szybkie
          wyszukiwanie dostępnych terminów wizyt i zabiegów w ramach NFZ. Dane
          są pobierane bezpośrednio ze strony NFZ i aktualizowane na bieżąco.
        </p>
        <p>
          Dzięki naszej wyszukiwarce terminów leczenia NFZ możesz porównać czasy
          oczekiwania na świadczenia medyczne w różnych placówkach i
          województwach. Znajdziesz tutaj informacje o pierwszych wolnych
          terminach u specjalistów, na zabiegi operacyjne, rehabilitację,
          diagnostykę i wiele innych.
        </p>
        <p>
          Sprawdź terminy leczenia NFZ w swoim regionie. Wybierz województwo,
          rodzaj świadczenia lub konkretną placówkę. Wyszukiwarka obsługuje
          wszystkie 16 województw i ponad 470 rodzajów świadczeń medycznych.
        </p>
        <p>
          Serwis nie jest oficjalnym serwisem NFZ ani nie jest z nim powiązany.
          Dane źródłowe pochodzą z oficjalnego portalu prowadzonego przez NFZ{" "}
          <a href="https://api.nfz.gov.pl/">https://api.nfz.gov.pl/</a>.
        </p>
        <p className="site-footer-legal-links">
          <Link to="/regulamin/">Regulamin</Link>
          <span aria-hidden="true">|</span>
          <Link to="/polityka-prywatnosci/">Polityka prywatności</Link>
          <span aria-hidden="true">|</span>
          <Link to="/kontakt/">Kontakt</Link>
        </p>
        <p>
          <a
            className="site-footer-muted-link"
            href="https://uno.directory"
            target="_blank"
            rel="noopener"
          >
            .
          </a>
        </p>
      </article>
    </footer>
  );
};
