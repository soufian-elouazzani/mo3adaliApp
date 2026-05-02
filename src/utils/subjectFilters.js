export const SUBJECT_TAGS = ["National", "Regional", "ControlContinue"];

/** @typedef {{ id: string, slug: string, tag: string, coefficient?: number, nameAr?: string, nameFr?: string, nameEn?: string }} SubjectRow */

/**
 * @param {SubjectRow[]} subjects
 * @param {string} calculationTypeId
 */
export function filterSubjectsByCalculationType(subjects, calculationTypeId) {
  if (!subjects?.length || !calculationTypeId) return [];
  const isNational = (s) => s.tag === "National";
  const isRegional = (s) => s.tag === "Regional";
  const isCc = (s) => s.tag === "ControlContinue";

  switch (calculationTypeId) {
    case "nationalOnly":
      return subjects.filter(isNational);
    case "regionalOnly":
      return subjects.filter(isRegional);
    case "controlContinueOnly":
      return subjects.filter(isCc);
    case "nationalAndRegional":
      return subjects.filter((s) => isNational(s) || isRegional(s));
    case "everything":
      return subjects.filter((s) => isNational(s) || isRegional(s) || isCc(s));
    default:
      return [];
  }
}

/**
 * Group visible subjects by tag for UI (National, then Regional, then ControlContinue).
 * @param {SubjectRow[]} subjects
 */
export function groupSubjectsByTag(subjects) {
  const map = new Map(SUBJECT_TAGS.map((tag) => [tag, []]));
  for (const subject of subjects) {
    const tag = subject.tag;
    if (!map.has(tag)) continue;
    map.get(tag).push(subject);
  }
  return SUBJECT_TAGS.map((tag) => ({ tag, subjects: map.get(tag) ?? [] })).filter(
    (group) => group.subjects.length > 0
  );
}

/**
 * @param {import('../data/academicConfig.js').Branch[]} branchList
 * @param {string} statusId  "" | "libre" | "scolaire"
 */
export function branchesForStatus(branchList, statusId) {
  if (!statusId) return branchList;
  return branchList.filter((branch) => {
    const libre = branch.libre !== false;
    const scolaire = branch.scolaire !== false;
    if (statusId === "libre") return libre;
    if (statusId === "scolaire") return scolaire;
    return true;
  });
}
