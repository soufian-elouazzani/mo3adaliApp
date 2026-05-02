import { useTranslation } from "react-i18next";

const languages = [
  { code: "ar", label: "العربية" },
  { code: "fr", label: "FR" },
  // { code: "en", label: "EN" },
];

function LanguageSwitcher() {
  const { i18n, t } = useTranslation();

  return (
    <div className="flex flex-col items-center gap-2 sm:flex-row sm:items-center sm:gap-3">
      <span className="text-sm font-medium text-slate-600">{t("language")}</span>
      <div className="flex rounded-xl border border-slate-300 bg-slate-50/80 p-1 shadow-inner">
        {languages.map((language) => (
          <button
            key={language.code}
            type="button"
            className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
              i18n.language === language.code
                ? "bg-slate-900 text-white shadow"
                : "text-slate-700 hover:bg-white"
            }`}
            onClick={() => i18n.changeLanguage(language.code)}
          >
            {language.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default LanguageSwitcher;
