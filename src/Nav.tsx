import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useLang, useT } from "./lang/LangContext";

export const Nav: React.FC = () => {
  const lang = useLang();
  const t = useT();
  const location = useLocation();
  const prefix = lang === "en" ? "/en" : "";
  const switchHref =
    lang === "pl"
      ? "/en" + (location.pathname === "/" ? "" : location.pathname)
      : location.pathname.replace(/^\/en/, "") || "/";

  return (
    <nav className="app-nav">
      <NavLink
        to={lang === "en" ? "/en" : "/"}
        end
        className={({ isActive }) =>
          "app-nav-link" + (isActive ? " active" : "")
        }
      >
        {t.navTerminy}
      </NavLink>
      <NavLink
        to={`${prefix}/statystyka`}
        className={({ isActive }) =>
          "app-nav-link" + (isActive ? " active" : "")
        }
      >
        {t.navStatystyki}
      </NavLink>
      <a href={switchHref} className="app-nav-link lang-switch">
        {t.langSwitch}
      </a>
    </nav>
  );
};
