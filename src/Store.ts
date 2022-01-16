import { XORShift } from "random-seedable";
import { Words } from "./Words";

const currentsDateKey = "currentsDate";
const currentWordsKey = "currentWords";
const currentCurrentKey = "currentCurrent";
const gameCountKey = "gameCount";
const gamesWonKey = "gamesWon";
const lastWinKey = "lastWin";
const currentStreakKey = "currentStreak";
const longestStreakKey = "longestStreak";
const guessDistributionKey = "guessDistribution";

export class Store {
	public static get currentDate(): string {
		return new Date().toISOString().substring(0, 10);
	}

	public static get currentWord(): string {
		const today = new Date(Store.currentDate);
		const random = new XORShift(today.getTime());

		return Words[random.randBelow(Words.length)];
	}

	private static get currentWordsDate(): string {
		return window.localStorage.getItem(currentsDateKey) ?? Store.currentDate;
	}
	private static set currentWordsDate(value: string) {
		window.localStorage.setItem(currentsDateKey, value);
	}

	public static get currentWords(): Array<string> {
		if (Store.currentWordsDate !== Store.currentDate) {
			return new Array<string>();
		}
		else {
			return JSON.parse(window.localStorage.getItem(currentWordsKey) ?? "[]");
		}
	}
	public static get currentCurrent(): string {
		if (Store.currentWordsDate !== Store.currentDate) {
			return "";
		}
		else {
			return window.localStorage.getItem(currentCurrentKey) ?? "";
		}
	}

	public static setCurrent(words: ReadonlyArray<string>, current: string): void {
		window.localStorage.setItem(currentWordsKey, JSON.stringify(words));
		window.localStorage.setItem(currentCurrentKey, current);
		Store.currentWordsDate = Store.currentDate;
	}

	public static get gameCount(): number {
		return parseInt(window.localStorage.getItem(gameCountKey) ?? "0");
	}
	public static set gameCount(value: number) {
		window.localStorage.setItem(gameCountKey, value.toString());
	}

	public static get gamesWon(): number {
		return parseInt(window.localStorage.getItem(gamesWonKey) ?? "0");
	}
	public static set gamesWon(value: number) {
		window.localStorage.setItem(gamesWonKey, value.toString());
	}

	public static get lastWin(): number {
		return parseInt(window.localStorage.getItem(lastWinKey) ?? "0");
	}
	public static set lastWin(value: number) {
		window.localStorage.setItem(lastWinKey, value.toString());
	}

	public static get currentStreak(): number {
		if (Store.lastWin < 24 * 3600000) {
			return parseInt(window.localStorage.getItem(currentStreakKey) ?? "0");
		}
		else {
			return 0;
		}
	}
	public static set currentStreak(value: number) {
		window.localStorage.setItem(currentStreakKey, value.toString());
	}

	public static get longestStreak(): number {
		return parseInt(window.localStorage.getItem(longestStreakKey) ?? "0");
	}
	public static set longestStreak(value: number) {
		window.localStorage.setItem(longestStreakKey, value.toString());
	}

	public static get guessDistribution(): Array<number> {
		return JSON.parse(window.localStorage.getItem(guessDistributionKey) ?? "[0,0,0,0,0,0]");
	}
	public static set guessDistribution(value: ReadonlyArray<number>) {
		window.localStorage.setItem(guessDistributionKey, JSON.stringify(value));
	}

	private constructor() { }
}
