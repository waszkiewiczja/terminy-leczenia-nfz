import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useLang } from "./lang/LangContext";
import {
  CONSENT_KEY,
  readAnalyticsConsent,
  saveAnalyticsConsent,
  startAnalytics,
  stopAnalytics,
  trackPage,
} from "./analytics";
import "./AnalyticsSettings.css";

export function AnalyticsSettings() {
  const lang = useLang();
  const location = useLocation();
  const [consent, setConsent] = useState<boolean | null>(null);
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setConsent(readAnalyticsConsent());
    setReady(true);
    const onStorage = (event: StorageEvent) => {
      if (event.key === CONSENT_KEY || event.key === null) {
        setConsent(readAnalyticsConsent());
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    if (!ready) return;
    if (consent === true) {
      startAnalytics();
      trackPage(location.pathname, location.key);
    } else {
      stopAnalytics();
    }
  }, [consent, ready, location.pathname, location.key]);

  const choose = (accepted: boolean) => {
    if (!accepted) stopAnalytics();
    saveAnalyticsConsent(accepted);
    setConsent(accepted);
    setOpen(false);
  };
  const english = lang === "en";

  return (
    <>
      <button
        type="button"
        className="analytics-settings-link"
        onClick={() => setOpen(true)}
      >
        {english ? "Analytics settings" : "Cookies"}
      </button>
      {ready && (open || consent === null) && (
        <section
          className="analytics-banner"
          aria-label={english ? "Analytics data" : "Dane analityczne"}
        >
          <h2>{english ? "Analytics data" : "Dane analityczne"}</h2>
          <p>
            {english
              ? "We collect information about searches and users on the site to improve it. You can change your choice at any time."
              : "Zbieramy informacje o wyszukiwaniach i użytkownikach w serwisie w celu jego ulepszenia. Możesz zmienić decyzję w każdej chwili."}{" "}
            <Link
              to={
                english ? "/en/polityka-prywatnosci/" : "/polityka-prywatnosci/"
              }
            >
              {english ? "Privacy policy" : "Polityka prywatności"}
            </Link>
          </p>
          <div className="analytics-actions">
            <button type="button" onClick={() => choose(false)}>
              {english ? "Reject" : "Odrzuć"}
            </button>
            <button type="button" onClick={() => choose(true)}>
              {english ? "Accept" : "Akceptuję"}
            </button>
          </div>
        </section>
      )}
    </>
  );
}
