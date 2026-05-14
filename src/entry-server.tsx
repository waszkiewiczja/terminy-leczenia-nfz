import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter, Routes, Route, Outlet } from "react-router";
import App from "./App.tsx";
import { Statystyka } from "./statystyka/Statystyka.tsx";
import { Nav } from "./Nav.tsx";
import { LangProvider } from "./lang/LangContext.tsx";
import type { Lang } from "./lang/LangContext.tsx";

function Layout() {
  return (
    <>
      <Nav />
      <Outlet />
    </>
  );
}

export function render(url: string, lang: Lang = "pl"): string {
  return renderToString(
    <StrictMode>
      <LangProvider lang={lang}>
        <StaticRouter location={url}>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<App />} />
              <Route path="/statystyka" element={<Statystyka />} />
              <Route path="/en" element={<App />} />
              <Route path="/en/statystyka" element={<Statystyka />} />
            </Route>
          </Routes>
        </StaticRouter>
      </LangProvider>
    </StrictMode>,
  );
}
