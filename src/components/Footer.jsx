import { useTranslation } from "react-i18next";
import { SITE_BRAND, SOCIAL_LINKS } from "../data/siteConfig";

function Footer() {
  const { t, i18n } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer
      className="mt-auto rounded-2xl border border-slate-200/80 bg-white/90 px-6 py-5 shadow-sm backdrop-blur-sm"
      dir={i18n.language === "ar" ? "rtl" : "ltr"}
    >
      <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
        <p className="text-center text-sm text-slate-600 sm:text-left">
          {t("footer.rightsReserved", { year, brand: SITE_BRAND })}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <span className="text-sm font-medium text-slate-500">{t("footer.followUs")}</span>
          <a
            href={SOCIAL_LINKS.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-cyan-700 underline decoration-cyan-400 underline-offset-2 hover:text-cyan-900"
          >
            {t("footer.facebook")}
          </a>
          <a
            href={SOCIAL_LINKS.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-cyan-700 underline decoration-cyan-400 underline-offset-2 hover:text-cyan-900"
          >
            {t("footer.instagram")}
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
