import "./AppTitle.css";

export const AppTitle = () => {
  return (
    <div className="app-title-row">
      <div className="app-title-heading">
        <a href="/">
          <img
            className="app-title-logo"
            src={`${import.meta.env.BASE_URL}terminy leczenia nfz.jpg`}
            alt="Terminy leczenia NFZ"
          />
        </a>
        <h1>Aktualne Terminy Leczenia NFZ</h1>
      </div>
      <p className="app-title-lead">
        Sprawdź aktualne terminy leczenia NFZ w Polsce i znajdź najbliższy wolny
        termin wizyty lub zabiegu według świadczenia, województwa, miasta czy
        placówki.
      </p>
    </div>
  );
};
