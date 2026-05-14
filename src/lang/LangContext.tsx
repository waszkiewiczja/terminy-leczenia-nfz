import { createContext, useContext } from "react";
import type { ReactNode } from "react";
import { pl } from "./pl";
import { en } from "./en";

export type Lang = "pl" | "en";
export type Translations = typeof pl;

const LangContext = createContext<Lang>("pl");

export const LangProvider = ({
  lang,
  children,
}: {
  lang: Lang;
  children: ReactNode;
}) => <LangContext.Provider value={lang}>{children}</LangContext.Provider>;

export const useLang = (): Lang => useContext(LangContext);

export const useT = (): Translations => {
  const lang = useContext(LangContext);
  return lang === "en" ? en : pl;
};
