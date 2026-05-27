import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";
import { Statystyka } from "./statystyka/Statystyka.tsx";
import { RegulaminPage } from "./RegulaminPage.tsx";
import { PolitykaPrywatnosciPage } from "./PolitykaPrywatnosciPage.tsx";
import { KontaktPage } from "./KontaktPage.tsx";
import { Nav } from "./Nav.tsx";
import { LangProvider } from "./lang/LangContext.tsx";
import type { Lang } from "./lang/LangContext.tsx";

function Layout({ lang }: { lang: Lang }) {
  return (
    <LangProvider lang={lang}>
      <Nav />
      <Outlet />
    </LangProvider>
  );
}

const root = document.getElementById("root")!;
const app = (
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<Layout lang="pl" />}>
          <Route path="/" element={<App />} />
          <Route path="/statystyka" element={<Statystyka />} />
          <Route path="/regulamin" element={<RegulaminPage />} />
          <Route
            path="/polityka-prywatnosci"
            element={<PolitykaPrywatnosciPage />}
          />
          <Route path="/kontakt" element={<KontaktPage />} />
        </Route>
        <Route element={<Layout lang="en" />}>
          <Route path="/en" element={<App />} />
          <Route path="/en/statystyka" element={<Statystyka />} />
          <Route path="/en/regulamin" element={<RegulaminPage />} />
          <Route
            path="/en/polityka-prywatnosci"
            element={<PolitykaPrywatnosciPage />}
          />
          <Route path="/en/kontakt" element={<KontaktPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);

if (root.innerHTML.trim()) {
  hydrateRoot(root, app);
} else {
  createRoot(root).render(app);
}
