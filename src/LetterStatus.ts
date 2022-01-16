export enum LetterStatus {
	Normal = "",
	NotIncluded = "not-included",
	Included = "included",
	Correct = "correct",
}

const letterStatusWorth = [
	LetterStatus.Normal,
	LetterStatus.NotIncluded,
	LetterStatus.Included,
	LetterStatus.Correct,
] as const;

export namespace LetterStatus {
	export function max(...statuses: ReadonlyArray<LetterStatus>): LetterStatus {
		return letterStatusWorth[statuses.map(s => letterStatusWorth.indexOf(s)).reduce((a, b) => Math.max(a, b))];
	}

	export function toEmoji(status: LetterStatus): string {
		switch (status) {
			case LetterStatus.Normal:
				return "";
			case LetterStatus.NotIncluded:
				return "⬛";
			case LetterStatus.Included:
				return "🟧";
			case LetterStatus.Correct:
				return "🟩";
			default:
				throw new Error("Unknown LetterStatus");
		}
	}
}
