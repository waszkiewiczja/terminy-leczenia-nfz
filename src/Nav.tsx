import React from "react";
import { NavLink } from "react-router-dom";

export const Nav: React.FC = () => {
  return (
    <nav className="app-nav">
      <NavLink
        to="/"
        end
        className={({ isActive }) =>
          "app-nav-link" + (isActive ? " active" : "")
        }
      >
        Terminy leczenia NFZ
      </NavLink>
      <NavLink
        to="/statystyka"
        className={({ isActive }) =>
          "app-nav-link" + (isActive ? " active" : "")
        }
      >
        Statystyki
      </NavLink>
    </nav>
  );
};
