const nameKey = (lang) => {
  if (lang === "ar") return "nameAr";
  if (lang === "fr") return "nameFr";
  return "nameEn";
};

export function getBranchLabel(branch, lang) {
  if (!branch) return "";
  const key = nameKey(lang);
  return branch[key] ?? branch.nameFr ?? branch.nameAr ?? "";
}

export function getSubjectLabel(subject, lang) {
  if (!subject) return "";
  const key = nameKey(lang);
  return subject[key] ?? subject.nameFr ?? subject.nameAr ?? "";
}
