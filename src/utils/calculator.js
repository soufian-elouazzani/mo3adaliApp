import { isValidNote } from "./validators";

function weightedBlock(subjects, notes) {
  if (!subjects?.length) {
    return { total: 0, average: 0, coefficientSum: 0 };
  }

  const graded = subjects.map((subject) => {
    const note = Number(notes[subject.id]);
    const coefficient = subject.coefficient ?? 1;
    return {
      note,
      coefficient,
      weightedScore: note * coefficient,
    };
  });

  const invalid = graded.find((row) => !isValidNote(row.note));
  if (invalid) {
    throw new Error("INVALID_NOTE");
  }

  const coefficientSum = graded.reduce((sum, row) => sum + row.coefficient, 0);
  if (coefficientSum <= 0) {
    throw new Error("NO_SUBJECTS");
  }

  const total = graded.reduce((sum, row) => sum + row.weightedScore, 0);
  const averageRaw = total / coefficientSum;

  return {
    total: Number(total.toFixed(2)),
    averageRaw,
    average: Number(averageRaw.toFixed(2)),
    coefficientSum,
  };
}

function passMarkForStatus(status) {
  return status === "libre" ? 9.5 : 10;
}

function finalizeAverage({ average, status, totalAll }) {
  const passMark = passMarkForStatus(status);
  return {
    total: totalAll != null ? Number(Number(totalAll).toFixed(2)) : undefined,
    average: Number(average.toFixed(2)),
    passed: average >= passMark,
    passMark,
  };
}

/**
 * @param {object} params
 * @param {import('./subjectFilters.js').SubjectRow[]} params.subjects
 * @param {Record<string, unknown>} params.notes
 * @param {string} params.status
 * @param {string} params.calculationType
 */
export function calculateResults({ subjects, notes, status, calculationType }) {
  if (!subjects?.length) {
    throw new Error("NO_SUBJECTS");
  }

  const byTag = (tag) => subjects.filter((s) => s.tag === tag);
  const national = byTag("National");
  const regional = byTag("Regional");
  const control = byTag("ControlContinue");

  switch (calculationType) {
    case "nationalOnly": {
      const block = weightedBlock(national, notes);
      if (!national.length) throw new Error("NO_SUBJECTS");
      return {
        ...finalizeAverage({ average: block.averageRaw, status, totalAll: block.total }),
        calculationType,
        breakdown: [
          {
            tag: "National",
            total: block.total,
            average: block.average,
            coefficientSum: block.coefficientSum,
          },
        ],
      };
    }
    case "regionalOnly": {
      const block = weightedBlock(regional, notes);
      if (!regional.length) throw new Error("NO_SUBJECTS");
      return {
        ...finalizeAverage({ average: block.averageRaw, status, totalAll: block.total }),
        calculationType,
        breakdown: [
          {
            tag: "Regional",
            total: block.total,
            average: block.average,
            coefficientSum: block.coefficientSum,
          },
        ],
      };
    }
    case "controlContinueOnly": {
      const block = weightedBlock(control, notes);
      if (!control.length) throw new Error("NO_SUBJECTS");
      return {
        ...finalizeAverage({ average: block.averageRaw, status, totalAll: block.total }),
        calculationType,
        breakdown: [
          {
            tag: "ControlContinue",
            total: block.total,
            average: block.average,
            coefficientSum: block.coefficientSum,
          },
        ],
      };
    }
    case "nationalAndRegional": {
      if (!national.length || !regional.length) {
        throw new Error("NO_SUBJECTS");
      }
      const nat = weightedBlock(national, notes);
      const reg = weightedBlock(regional, notes);
      const finalAverage = 0.75 * nat.averageRaw + 0.25 * reg.averageRaw;
      const totalAll = nat.total + reg.total;
      return {
        ...finalizeAverage({ average: finalAverage, status, totalAll }),
        calculationType,
        breakdown: [
          {
            tag: "National",
            total: nat.total,
            average: nat.average,
            coefficientSum: nat.coefficientSum,
          },
          {
            tag: "Regional",
            total: reg.total,
            average: reg.average,
            coefficientSum: reg.coefficientSum,
          },
        ],
        formulaNote: "75_25_nat_reg",
      };
    }
    case "everything": {
      if (!national.length || !regional.length || !control.length) {
        throw new Error("NO_SUBJECTS");
      }
      const nat = weightedBlock(national, notes);
      const reg = weightedBlock(regional, notes);
      const cc = weightedBlock(control, notes);
      const finalAverage =
        0.5 * nat.averageRaw + 0.25 * reg.averageRaw + 0.25 * cc.averageRaw;
      const totalAll = nat.total + reg.total + cc.total;
      return {
        ...finalizeAverage({ average: finalAverage, status, totalAll }),
        calculationType,
        breakdown: [
          {
            tag: "National",
            total: nat.total,
            average: nat.average,
            coefficientSum: nat.coefficientSum,
          },
          {
            tag: "Regional",
            total: reg.total,
            average: reg.average,
            coefficientSum: reg.coefficientSum,
          },
          {
            tag: "ControlContinue",
            total: cc.total,
            average: cc.average,
            coefficientSum: cc.coefficientSum,
          },
        ],
        formulaNote: "50_25_25",
      };
    }
    default:
      throw new Error("UNKNOWN_CALC_TYPE");
  }
}
