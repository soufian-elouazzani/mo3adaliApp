import { useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ResultCard from "./components/ResultCard";
import { branches, getBranchById, statuses } from "./data/academicConfig";
import { calculationTypes } from "./data/calculationTypes";
import { getBranchLabel, getSubjectLabel } from "./utils/branchLabels";
import { calculateResults } from "./utils/calculator";
import {
  branchesForStatus,
  filterSubjectsByCalculationType,
  groupSubjectsByTag,
} from "./utils/subjectFilters";
import { NOTE_MAX, NOTE_MIN } from "./utils/validators";

const TAG_LABEL_KEY = {
  National: "tagSection.national",
  Regional: "tagSection.regional",
  ControlContinue: "tagSection.controlContinue",
};

function App() {
  const { t, i18n } = useTranslation();
  const [result, setResult] = useState(null);
  const [globalError, setGlobalError] = useState("");
  const [selectedBranchId, setSelectedBranchId] = useState("");

  const {
    register,
    control,
    handleSubmit,
    reset,
    getValues,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      status: "",
      calculationType: "",
      filiere: "",
    },
    shouldUnregister: true,
  });

  const watchedStatus = useWatch({ control, name: "status" });
  const watchedCalcType = useWatch({ control, name: "calculationType" });

  const filteredBranches = useMemo(
    () => branchesForStatus(branches, watchedStatus),
    [watchedStatus]
  );

  const branch = selectedBranchId ? getBranchById(selectedBranchId) : null;

  const visibleSubjects = useMemo(() => {
    if (!branch || !watchedCalcType) return [];
    return filterSubjectsByCalculationType(branch.subjects, watchedCalcType);
  }, [branch, watchedCalcType]);

  const groupedSubjects = useMemo(
    () => groupSubjectsByTag(visibleSubjects),
    [visibleSubjects]
  );

  const statusRegister = register("status", {
    required: t("errors.requiredStatus"),
  });

  const calculationTypeRegister = register("calculationType", {
    required: t("errors.requiredCalcType"),
  });

  const filiereRegister = register("filiere", {
    required: t("errors.requiredFiliere"),
  });

  const getAvailableCalculationTypes = (selectedStatus) => {
    if (selectedStatus === 'libre') {
      return calculationTypes.filter(
        ct => ct.id !== 'controlContinueOnly' && ct.id !== 'everything'
      );
    }
    return calculationTypes;
  };

  const currentStatus = watchedStatus; // ← USE watchedStatus instead of statusRegister.value
  const availableTypes = getAvailableCalculationTypes(currentStatus);


  useEffect(() => {
    document.documentElement.lang = i18n.language;
    document.documentElement.dir = i18n.language === "ar" ? "rtl" : "ltr";
  }, [i18n.language]);

  const onSubmit = (values) => {
    if (!visibleSubjects.length) {
      setGlobalError(t("errors.noSubjects"));
      setResult(null);
      return;
    }
    if (!values.calculationType) {
      setGlobalError(t("errors.requiredCalcType"));
      setResult(null);
      return;
    }
    try {
      const notes = visibleSubjects.reduce((accumulator, subject) => {
        accumulator[subject.id] = values[subject.id];
        return accumulator;
      }, {});

      const calculation = calculateResults({
        subjects: visibleSubjects,
        notes,
        status: values.status,
        calculationType: values.calculationType,
      });
      setResult(calculation);
      setGlobalError("");
    } catch (error) {
      const message = error?.message;
      if (message === "NO_SUBJECTS") {
        setGlobalError(t("errors.noSubjects"));
      } else if (message === "UNKNOWN_CALC_TYPE") {
        setGlobalError(t("errors.unknownCalcType"));
      } else {
        setGlobalError(t("errors.invalidNote"));
      }
      setResult(null);
    }
  };

  const handleReset = () => {
    setSelectedBranchId("");
    reset({ status: "", calculationType: "", filiere: "" });
    setResult(null);
    setGlobalError("");
  };

  const handleFillSample = () => {
    if (!visibleSubjects.length) return;
    visibleSubjects.forEach((subject) => {
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
          <div className="grid gap-6 md:grid-cols-3 md:gap-6">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-800 md:text-base">
                {t("statusLabel")}
              </span>
              <select
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 shadow-sm focus:border-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
                {...statusRegister}
                onChange={(event) => {
                  statusRegister.onChange(event);
                  const newStatus = event.target.value;
                  setResult(null);
                  setGlobalError("");
                  const allowed = branchesForStatus(branches, newStatus);
                  if (selectedBranchId && !allowed.some((b) => b.id === selectedBranchId)) {
                    setSelectedBranchId("");
                    setValue("filiere", "");
                  }
                }}
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
                      calculationType: getValues("calculationType") ?? "",
                      filiere: "",
                    });
                  }
                }}
              >
                <option value="">—</option>
                {filteredBranches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {getBranchLabel(b, i18n.language)}
                  </option>
                ))}
              </select>
              {errors.filiere && (
                <p className="mt-2 text-sm text-rose-700">{errors.filiere.message}</p>
              )}
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-800 md:text-base">
                {t("calculationTypeLabel")}
              </span>
              <select
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 shadow-sm focus:border-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
                {...calculationTypeRegister}
                onChange={(event) => {
                  calculationTypeRegister.onChange(event);
                  setResult(null);
                  setGlobalError("");
                }}
              >
                <option value="">—</option>
                {availableTypes.map((ct) => (
                  <option key={ct.id} value={ct.id}>
                    {t(`calcType.${ct.id}`)}
                  </option>
                ))}
              </select>
              {errors.calculationType && (
                <p className="mt-2 text-sm text-rose-700">{errors.calculationType.message}</p>
              )}
            </label>
          </div>

          {groupedSubjects.length > 0 && (
            <div
              key={`${selectedBranchId}-${watchedCalcType}-${watchedStatus}`}
              className="mt-8"
            >
              <h2 className="text-xl font-bold text-slate-900 md:text-2xl">{t("subjectList")}</h2>
              <p className="mt-2 text-slate-600 md:text-lg">{t("notesInputHint")}</p>

              <div className="mt-6 space-y-8">
                {groupedSubjects.map((group, index) => (
                  <div key={group.tag}>
                    {index > 0 && (
                      <hr className="mb-8 border-t-2 border-dashed border-slate-300" />
                    )}
                    <h3 className="text-lg font-bold text-cyan-900 md:text-xl">
                      {TAG_LABEL_KEY[group.tag] ? t(TAG_LABEL_KEY[group.tag]) : group.tag}
                    </h3>
                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                      {group.subjects.map((subject) => (
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
              disabled={!visibleSubjects.length}
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
