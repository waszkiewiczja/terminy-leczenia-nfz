import { useLang } from "./lang/LangContext";
import "./LegalPage.css";

export function KontaktPage() {
  const lang = useLang();

  if (lang === "en") {
    return (
      <main className="legal-page">
        <article>
          <h1>Contact</h1>
          <p className="legal-updated">Updated: 27.05.2026</p>

          <p>
            If you have questions about the service or found an issue in the
            data presentation, contact us using one of the channels below.
          </p>

          <h2>Contact channels</h2>
          <ul>
            <li>
              <a href="mailto:kontakt@terminy-leczenia-nfz.pl">
                kontakt@terminy-leczenia-nfz.pl
              </a>
            </li>
          </ul>

          <h2>What to include in your message</h2>
          <ul>
            <li>Requested service name</li>
            <li>Province and city</li>
            <li>Facility name (if applicable)</li>
            <li>Approximate date and time of the issue</li>
          </ul>
        </article>
      </main>
    );
  }

  return (
    <main className="legal-page">
      <article>
        <h1>Kontakt</h1>
        <p className="legal-updated">Aktualizacja: 27.05.2026</p>

        <p>
          W sprawach dotyczących działania serwisu lub błędów w prezentacji
          danych skontaktuj się z nami przez jeden z poniższych kanałów.
        </p>

        <h2>Kanały kontaktu</h2>
        <ul>
          <li>
            <a href="mailto:kontakt@terminy-leczenia-nfz.pl">
              kontakt@terminy-leczenia-nfz.pl
            </a>
          </li>
        </ul>

        <h2>Co podać w wiadomości</h2>
        <ul>
          <li>Nazwa świadczenia</li>
          <li>Województwo i miejscowość</li>
          <li>Nazwa placówki (jeśli dotyczy)</li>
          <li>Przybliżona data i godzina wystąpienia problemu</li>
        </ul>
      </article>
    </main>
  );
}
