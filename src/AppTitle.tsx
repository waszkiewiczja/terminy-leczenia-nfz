import { useLang, useT } from "./lang/LangContext";
import "./AppTitle.css";

export const AppTitle = () => {
  const lang = useLang();
  const t = useT();
  const homeHref = lang === "en" ? "/en" : "/";

  return (
    <div className="app-title-row">
      <div className="app-title-heading">
        <a href={homeHref}>
          <img
            className="app-title-logo"
            src={`${import.meta.env.BASE_URL}terminy leczenia nfz.jpg`}
            alt={t.appAlt}
          />
        </a>
        <h1>{t.appH1}</h1>
      </div>
      <p className="app-title-lead">{t.appLead}</p>
    </div>
  );
};
