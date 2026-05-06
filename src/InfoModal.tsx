import { useState } from "react";

export default function InfoModal() {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <>
      <button className="info-trigger" onClick={() => setShowInfo(true)}>
        info.
      </button>

      {showInfo && (
        <div className="modal-overlay" onClick={() => setShowInfo(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowInfo(false)}>
              ×
            </button>
            <article>
              <h2>Terminy leczenia NFZ aktualne dane</h2>
              <p>
                Serwis <b>terminy leczenia NFZ</b> umożliwia szybkie
                wyszukiwanie dostępnych terminów wizyt i zabiegów w ramach NFZ.
                Dane są pobierane bezpośrednio ze strony NFZ i aktualizowane
                codziennie.
              </p>
              <p>
                Dzięki naszej wyszukiwarce <b>terminów leczenia NFZ</b> możesz
                porównać czasy oczekiwania na świadczenia medyczne w różnych
                placówkach i województwach. Znajdziesz tutaj informacje o
                pierwszych wolnych terminach u specjalistów, na zabiegi
                operacyjne, rehabilitację, diagnostykę i wiele innych.
              </p>
              <p>
                Sprawdź <b>terminy leczenia NFZ</b> w swoim regionie — wybierz
                województwo, rodzaj świadczenia lub konkretną placówkę.
                Wyszukiwarka obsługuje wszystkie 16 województw i ponad 470
                rodzajów świadczeń medycznych.
              </p>
              <p>
                Dane źródłowe pochodzą z oficjalnego portalu{" "}
                <em>Informator o terminach leczenia</em> prowadzonego przez NFZ.
              </p>
            </article>
          </div>
        </div>
      )}
    </>
  );
}
