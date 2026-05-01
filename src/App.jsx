import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ResultCard from "./components/ResultCard";
import { branches, getBranchById, statuses } from "./data/academicConfig";
import { getBranchLabel, getSubjectLabel } from "./utils/branchLabels";
import { calculateResults } from "./utils/calculator";
import { NOTE_MAX, NOTE_MIN } from "./utils/validators";

function App() {
  const { t, i18n } = useTranslation();
  const [result, setResult] = useState(null);
  const [globalError, setGlobalError] = useState("");
  /** Keeps subject list in sync with the branch select (avoids RHF reset/watch race). */
  const [selectedBranchId, setSelectedBranchId] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      status: "",
      filiere: "",
    },
    shouldUnregister: true,
  });

  const branch = selectedBranchId ? getBranchById(selectedBranchId) : null;
  const subjects = branch?.subjects ?? [];

  const filiereRegister = register("filiere", {
    required: t("errors.requiredFiliere"),
  });

  useEffect(() => {
    document.documentElement.lang = i18n.language;
    document.documentElement.dir = i18n.language === "ar" ? "rtl" : "ltr";
  }, [i18n.language]);

  const onSubmit = (values) => {
    if (!subjects.length) {
      setGlobalError(t("errors.noSubjects"));
      setResult(null);
      return;
    }
    try {
      const notes = subjects.reduce((accumulator, subject) => {
        accumulator[subject.id] = values[subject.id];
        return accumulator;
      }, {});

      const calculation = calculateResults({
        subjects,
        notes,
        status: values.status,
      });
      setResult(calculation);
      setGlobalError("");
    } catch (error) {
      setGlobalError(
        error?.message === "NO_SUBJECTS" ? t("errors.noSubjects") : t("errors.invalidNote")
      );
      setResult(null);
    }
  };

  const handleReset = () => {
    setSelectedBranchId("");
    reset({ status: "", filiere: "" });
    setResult(null);
    setGlobalError("");
  };

  const handleFillSample = () => {
    if (!subjects.length) return;
    subjects.forEach((subject) => {
      const note = Math.round((10 + Math.random() * 8) * 100) / 100;
      setValue(subject.id, note, { shouldValidate: true, shouldDirty: true });
    });
    setGlobalError("");
  };

  return (
    <main
      className="mx-auto flex min-h-screen w-full max-w-[90rem] flex-col gap-8 px-4 py-6 text-base md:gap-10 md:px-10 md:py-12 lg:text-[1.0625rem]"
      dir={i18n.language === "ar" ? "rtl" : "ltr"}
    >
      <Header />
      <section className="grid gap-8 xl:grid-cols-5 xl:gap-10">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="xl:col-span-3 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-lg shadow-slate-200/40 md:p-10"
        >
          <div className="grid gap-6 md:grid-cols-2 md:gap-8">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-800 md:text-base">
                {t("statusLabel")}
              </span>
              <select
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 shadow-sm focus:border-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
                {...register("status", { required: t("errors.requiredStatus") })}
              >
                <option value="">—</option>
                {statuses.map((status) => (
                  <option key={status.id} value={status.id}>
                    {t(status.labelKey)}
                  </option>
                ))}
              </select>
              {errors.status && (
                <p className="mt-2 text-sm text-rose-700">{errors.status.message}</p>
              )}
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-800 md:text-base">
                {t("filiereLabel")}
              </span>
              <select
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 shadow-sm focus:border-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
                {...filiereRegister}
                onChange={(event) => {
                  filiereRegister.onChange(event);
                  const newId = event.target.value;
                  setSelectedBranchId(newId);
                  setResult(null);
                  setGlobalError("");
                  if (!newId) {
                    reset({
                      status: getValues("status") ?? "",
                      filiere: "",
                    });
                  }
                }}
              >
                <option value="">—</option>
                {branches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {getBranchLabel(b, i18n.language)}
                  </option>
                ))}
              </select>
              {errors.filiere && (
                <p className="mt-2 text-sm text-rose-700">{errors.filiere.message}</p>
              )}
            </label>
          </div>

          {subjects.length > 0 && (
            <div key={selectedBranchId} className="mt-8">
              <h2 className="text-xl font-bold text-slate-900 md:text-2xl">{t("subjectList")}</h2>
              <p className="mt-2 text-slate-600 md:text-lg">{t("notesInputHint")}</p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
                {subjects.map((subject) => (
                  <label key={subject.id} className="block">
                    <span className="mb-2 block text-sm font-semibold text-slate-800 md:text-base">
                      {getSubjectLabel(subject, i18n.language)}{" "}
                      <span className="font-normal text-cyan-800/90">
                        ({t("coefShort", { n: subject.coefficient })})
                      </span>
                    </span>
                    <input
                      type="number"
                      inputMode="decimal"
                      min={NOTE_MIN}
                      max={NOTE_MAX}
                      step="0.01"
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 shadow-sm focus:border-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
                      {...register(subject.id, {
                        required: true,
                        min: NOTE_MIN,
                        max: NOTE_MAX,
                        valueAsNumber: true,
                      })}
                    />
                  </label>
                ))}
              </div>
            </div>
          )}

          {globalError && (
            <p className="mt-6 rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-800 md:text-base">
              {globalError}
            </p>
          )}

          <div className="mt-8 flex flex-wrap gap-3 md:gap-4">
            <button
              type="submit"
              className="rounded-xl bg-slate-900 px-6 py-3 text-base font-semibold text-white shadow-md transition hover:bg-slate-800 md:px-8 md:text-lg"
            >
              {t("calculate")}
            </button>
            <button
              type="button"
              onClick={handleFillSample}
              disabled={!subjects.length}
              className="rounded-xl border border-cyan-700/40 bg-cyan-50 px-6 py-3 text-base font-semibold text-cyan-900 shadow-sm transition hover:bg-cyan-100 disabled:cursor-not-allowed disabled:opacity-50 md:px-8 md:text-lg"
            >
              {t("fillSample")}
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="rounded-xl border border-slate-300 bg-white px-6 py-3 text-base font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50 md:px-8 md:text-lg"
            >
              {t("reset")}
            </button>
          </div>
        </form>
        <div className="xl:col-span-2">
          <ResultCard result={result} />
        </div>
      </section>
      <Footer />
    </main>
  );
}

export default App;
