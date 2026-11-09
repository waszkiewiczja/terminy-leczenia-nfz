import { useT } from "./lang/LangContext";

export const HomeContent = () => {
  const t = useT();

  return (
    <section className="home-content">
      <article>
        <h2>{t.homeHowTitle}</h2>
        <ol>
          {t.homeHowSteps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </article>
      <article>
        <h2>{t.homeCaseTitle}</h2>
        {t.homeCaseParagraphs.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </article>
      <article>
        <h2>{t.homeDataTitle}</h2>
        {t.homeDataParagraphs.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </article>
    </section>
  );
};
