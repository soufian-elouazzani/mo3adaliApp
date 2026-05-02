import { useTranslation } from "react-i18next";

const FORMULA_KEY = {
  "75_25_nat_reg": "result.formula75_25",
  "50_25_25": "result.formula50_25",
};

const TAG_LABEL_KEY = {
  National: "tagSection.national",
  Regional: "tagSection.regional",
  ControlContinue: "tagSection.controlContinue",
};

function ResultCard({ result }) {
  const { t } = useTranslation();

  if (!result) {
    return (
      <aside className="h-full rounded-2xl border border-slate-200/80 bg-white p-6 shadow-lg shadow-slate-200/40 md:p-8">
        <h2 className="text-xl font-bold text-slate-900 md:text-2xl">{t("resultTitle")}</h2>
        <p className="mt-5 text-base leading-relaxed text-slate-600 md:text-lg">
          {t("notesInputHint")}
        </p>
      </aside>
    );
  }

  const formulaKey = result.formulaNote ? FORMULA_KEY[result.formulaNote] : null;

  return (
    <aside className="h-full rounded-2xl border border-slate-200/80 bg-white p-6 shadow-lg shadow-slate-200/40 md:p-8">
      <h2 className="text-xl font-bold text-slate-900 md:text-2xl">{t("resultTitle")}</h2>

      {formulaKey && (
        <p className="mt-3 rounded-xl bg-cyan-50 px-4 py-3 text-sm font-medium text-cyan-950 md:text-base">
          {t(formulaKey)}
        </p>
      )}

      <div className="mt-6 space-y-4 text-base md:text-lg">
        {/* {result.total != null && (
          <p className="flex items-center justify-between gap-4 rounded-xl bg-slate-50 px-5 py-4">
            <span className="text-slate-600">{t("total")}</span>
            <span className="font-bold text-slate-900">{result.total}</span>
          </p>
        )} */}
        <p className="flex items-center justify-between gap-4 rounded-xl bg-slate-50 px-5 py-4">
          <span className="text-slate-600">{t("average")}</span>
          <span className="font-bold text-slate-900">{result.average}/20</span>
        </p>
        <p className="flex items-center justify-between gap-4 rounded-xl bg-slate-50 px-5 py-4">
          <span className="text-slate-600">{t("passMark")}</span>
          <span className="font-bold text-slate-900">{result.passMark}/20</span>
        </p>
        <p
          className={`flex items-center justify-between gap-4 rounded-xl px-5 py-4 font-bold ${
            result.passed ? "bg-emerald-100 text-emerald-900" : "bg-rose-100 text-rose-900"
          }`}
        >
          <span>{t("finalState")}</span>
          <span>{result.passed ? t("pass") : t("fail")}</span>
        </p>
      </div>

      {result.breakdown?.length > 0 && (
        <div className="mt-8 border-t border-slate-200 pt-6">
          <h3 className="text-lg font-bold text-slate-900">{t("result.perBlock")}</h3>
          <ul className="mt-4 space-y-3">
            {result.breakdown.map((row) => (
              <li
                key={row.tag}
                className="flex flex-col gap-1 rounded-xl bg-slate-50 px-4 py-3 text-sm md:flex-row md:items-center md:justify-between md:text-base"
              >
                <span className="font-semibold text-slate-800">
                  {TAG_LABEL_KEY[row.tag] ? t(TAG_LABEL_KEY[row.tag]) : row.tag}
                </span>
                <span className="text-slate-600">
                  {t("average")}: <strong className="text-slate-900">{row.average}/20</strong>
                  {" · "}
                  {t("total")}: <strong className="text-slate-900">{row.total}</strong>
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </aside>
  );
}

export default ResultCard;
