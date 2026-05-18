import { useEffect, useState } from "react";
import { PartnerBadges } from "./PartnerBadges";
import { useLang } from "./lang/LangContext";

export const PartnersModalTrigger = () => {
  const lang = useLang();
  const [isPartnersModalOpen, setIsPartnersModalOpen] = useState(false);

  const openPartnersModal = () => setIsPartnersModalOpen(true);
  const closePartnersModal = () => setIsPartnersModalOpen(false);

  useEffect(() => {
    if (!isPartnersModalOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closePartnersModal();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPartnersModalOpen]);

  const partnersLabel = lang === "en" ? "Mentioned" : "Wyróżnieni";
  const partnersModalTitle = lang === "en" ? "Mentioned" : "Wyróżnieni";

  return (
    <>
      <button
        type="button"
        className="site-footer-partners-trigger"
        onClick={openPartnersModal}
      >
        {partnersLabel}
      </button>

      {isPartnersModalOpen ? (
        <div
          className="site-footer-modal-backdrop"
          onClick={closePartnersModal}
          aria-hidden="true"
        >
          <div
            className="site-footer-modal"
            role="dialog"
            aria-modal="true"
            aria-label={partnersModalTitle}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="site-footer-modal-header">
              <h3>{partnersModalTitle}</h3>
              <button
                type="button"
                className="site-footer-modal-close"
                onClick={closePartnersModal}
                aria-label="Close"
              >
                x
              </button>
            </div>
            <div className="site-footer-badges-grid">
              <PartnerBadges />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};
