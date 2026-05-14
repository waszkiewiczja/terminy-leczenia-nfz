import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { hydrateRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";
import { Statystyka } from "./statystyka/Statystyka.tsx";
import { Nav } from "./Nav.tsx";

export function Layout() {
  return (
    <>
      <Nav />
      <Outlet />
    </>
  );
}

const root = document.getElementById("root")!;
const app = (
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<App />} />
          <Route path="/statystyka" element={<Statystyka />} />
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
