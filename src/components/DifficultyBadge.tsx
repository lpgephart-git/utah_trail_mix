import { DIFFICULTY_LABELS, type Difficulty } from "@/lib/types";

const STYLES: Record<Difficulty, string> = {
  easy: "bg-secondary-container text-on-secondary-container",
  moderate: "bg-surface-variant text-on-surface-variant",
  ambitious: "bg-error-container text-on-error-container",
};

export function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${STYLES[difficulty]}`}
    >
      {DIFFICULTY_LABELS[difficulty]}
    </span>
  );
}
