import { useTranslation } from "react-i18next";

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

  return (
    <aside className="h-full rounded-2xl border border-slate-200/80 bg-white p-6 shadow-lg shadow-slate-200/40 md:p-8">
      <h2 className="text-xl font-bold text-slate-900 md:text-2xl">{t("resultTitle")}</h2>
      <div className="mt-6 space-y-4 text-base md:text-lg">
        <p className="flex items-center justify-between gap-4 rounded-xl bg-slate-50 px-5 py-4">
          <span className="text-slate-600">{t("total")}</span>
          <span className="font-bold text-slate-900">{result.total}</span>
        </p>
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
    </aside>
  );
}

export default ResultCard;
