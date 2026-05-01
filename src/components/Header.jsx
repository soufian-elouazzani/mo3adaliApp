import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";
import logoMo3adali from "../assets/mo3adali.jpeg";

function Header() {
  const { t, i18n } = useTranslation();

  return (
    <header className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-md shadow-slate-200/50 md:p-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-6">
          <div className="flex shrink-0 justify-center sm:justify-start">
            <img
              src={logoMo3adali}
              alt={t("appName")}
              className="h-24 w-auto max-w-[min(100%,280px)] rounded-xl object-contain shadow-md ring-1 ring-slate-200/80 md:h-28"
            />
          </div>
          <div className="min-w-0 text-center sm:text-start">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-4xl">
              {t("appName")}
            </h1>
            <p
              className="mt-2 text-base leading-relaxed text-slate-600 md:text-lg"
              dir={i18n.language === "ar" ? "rtl" : "ltr"}
            >
              {t("appDescription")}
            </p>
            <p
              className="mt-2 text-sm font-medium text-cyan-800 md:text-base"
              dir={i18n.language === "ar" ? "rtl" : "ltr"}
            >
              {t("appTaglineBac")}
            </p>
          </div>
        </div>
        <div className="flex shrink-0 justify-center lg:justify-end">
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}

export default Header;
