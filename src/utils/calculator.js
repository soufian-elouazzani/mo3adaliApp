import { isValidNote } from "./validators";

export const calculateResults = ({ subjects, notes, status }) => {
  if (!subjects?.length) {
    throw new Error("NO_SUBJECTS");
  }

  const gradedSubjects = subjects.map((subject) => {
    const note = Number(notes[subject.id]);
    const coefficient = subject.coefficient ?? 1;
    return {
      ...subject,
      note,
      coefficient,
      weightedScore: note * coefficient,
    };
  });

  const invalidSubject = gradedSubjects.find((subject) => !isValidNote(subject.note));
  if (invalidSubject) {
    throw new Error("INVALID_NOTE");
  }

  const totalCoefficients = gradedSubjects.reduce(
    (sum, subject) => sum + subject.coefficient,
    0
  );
  if (totalCoefficients <= 0) {
    throw new Error("NO_SUBJECTS");
  }

  const total = gradedSubjects.reduce((sum, subject) => sum + subject.weightedScore, 0);
  const average = total / totalCoefficients;
  const passMark = status === "libre" ? 9.5 : 10;

  return {
    total: Number(total.toFixed(2)),
    average: Number(average.toFixed(2)),
    passed: average >= passMark,
    passMark,
  };
};
