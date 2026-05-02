/**
 * Calculation modes. Each subject row in `branches.json` must include `tag`:
 * `"National"` | `"Regional"` | `"ControlContinue"`.
 *
 * Combined modes use weighted averages per tag, then:
 * - nationalAndRegional: 75% National + 25% Regional
 * - everything: 50% National + 25% Regional + 25% ControlContinue
 */
export const calculationTypes = [
  { id: "nationalOnly", labelKey: "calcType.nationalOnly" },
  { id: "regionalOnly", labelKey: "calcType.regionalOnly" },
  { id: "controlContinueOnly", labelKey: "calcType.controlContinueOnly" },
  { id: "nationalAndRegional", labelKey: "calcType.nationalAndRegional" },
  { id: "everything", labelKey: "calcType.everything" },
];
