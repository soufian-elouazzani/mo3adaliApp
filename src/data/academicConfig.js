import branchesRaw from "./branches.json";

export const statuses = [
  { id: "libre", labelKey: "status.libre" },
  { id: "scolaire", labelKey: "status.scolaire" },
];

function normalizeBranches(raw) {
  return raw.map((branch) => ({
    ...branch,
    libre: branch.libre !== false,
    scolaire: branch.scolaire !== false,
    subjects: (branch.subjects ?? []).map((subject) => {
      const tag = subject.tag ?? "National";
      return {
        ...subject,
        tag,
        id: `${branch.id}__${subject.slug}`,
      };
    }),
  }));
}

/**
 * All baccalauréat branches. To add a new branch, append an object to
 * `src/data/branches.json` (id, nameAr, nameFr, nameEn, optional `libre`/`scolaire` booleans,
 * subjects with `slug`, `tag` ("National"|"Regional"|"ControlContinue"), names, `coefficient`).
 */
export const branches = normalizeBranches(branchesRaw);

export function getBranchById(id) {
  return branches.find((b) => b.id === id);
}

export function getSubjectsForBranch(branchId) {
  const branch = getBranchById(branchId);
  return branch?.subjects ?? [];
}
