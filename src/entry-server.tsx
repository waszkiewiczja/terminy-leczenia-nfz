import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter, Routes, Route, Outlet } from "react-router";
import App from "./App.tsx";
import { Statystyka } from "./statystyka/Statystyka.tsx";
import { Nav } from "./Nav.tsx";

function Layout() {
  return (
    <>
      <Nav />
      <Outlet />
    </>
  );
}

export function render(url: string): string {
  return renderToString(
    <StrictMode>
      <StaticRouter location={url}>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<App />} />
            <Route path="/statystyka" element={<Statystyka />} />
          </Route>
        </Routes>
      </StaticRouter>
    </StrictMode>,
  );
}
