import React, { Component, ReactNode } from "react";
import { MainView } from "./App";
import { Keyboard } from "./Keyboard";
import { LetterStatus } from "./LetterStatus";
import { LetterTile } from "./LetterTile";
import { Store } from "./Store";
import { WordSet } from "./Words";

export interface GameProperties {
	onNotification?: (notification: string) => void;
	onNavigate?: (view: MainView) => void;
}

interface GameState {
	readonly word: string;
	readonly words: ReadonlyArray<string>;
	readonly current: string;
}

export class Game extends Component<GameProperties, GameState> {
	public static createShareBlock(word: string, words: ReadonlyArray<string>): string {
		return words.map(l => Game.calculateLetterStatusOfLine(word, l).map(([, s]) => LetterStatus.toEmoji(s)).join("")).join("\n");
	}

	private static calculateLetterStatusOfLine(word: string, line: string): Array<[string, LetterStatus]> {
		const letterCount: { [letter: string]: number } = { };
		for (const l of word) {
			if (l in letterCount) {
				letterCount[l]++;
			}
			else {
				letterCount[l] = 1;
			}
		}

		for (let i = 0; i < line.length; i++) {
			if (word[i] === line[i]) {
				letterCount[word[i]]--;
			}
		}

		return line.split("").map((l, i) => {
			if (word[i] === l) {
				return [l, LetterStatus.Correct];
			}
			else if (l in letterCount && letterCount[l] > 0) {
				letterCount[l]--;
				return [l, LetterStatus.Included];
			}
			else {
				return [l, LetterStatus.NotIncluded];
			}
		});
	}
	private static calculateLetterStatus(word: string, words: ReadonlyArray<string>): { [letter: string]: LetterStatus } {
		const letterStatus: { [letter: string]: LetterStatus } = {};
		for (const w of words) {
			for (const [l, s] of Game.calculateLetterStatusOfLine(word, w)) {
				if (l in letterStatus) {
					letterStatus[l] = LetterStatus.max(letterStatus[l], s);
				}
				else {
					letterStatus[l] = s;
				}
			}
		}
		return letterStatus;
	}

	private static renderLine(letters: ReadonlyArray<[string, LetterStatus]>, index: number): JSX.Element {
		return (
			<div key={index} className="line">
				{letters.map(([letter, status], i) => <LetterTile key={i} status={status} letter={letter} />)}
			</div>
		);
	}

	public static isDone(word: string, words: ReadonlyArray<string>): boolean {
		return words.length === 6 || Game.isWon(word, words);
	}

	public static isWon(word: string, words: ReadonlyArray<string>): boolean {
		return words.length > 0 &&
			Game.calculateLetterStatusOfLine(word, words[words.length - 1])
				.every(([, status]) => status === LetterStatus.Correct);
	}

	private currentLineElement: HTMLDivElement = null;

	public constructor(props: GameProperties) {
		super(props);

		this.state = {
			word: Store.currentWord,
			words: Store.currentWords,
			current: Store.currentCurrent,
		};

		this.onKeyDown = this.onKeyDown.bind(this);
		this.onLetter = this.onLetter.bind(this);
		this.onEnter = this.onEnter.bind(this);
		this.onBackspace = this.onBackspace.bind(this);
	}

	public override componentDidMount(): void {
		window.document.body.addEventListener("keydown", this.onKeyDown);
	}

	public override componentWillUnmount(): void {
		window.document.body.removeEventListener("keydown", this.onKeyDown);
	}

	public render(): ReactNode {
		return (
			<>
				<div className="attempts">
					{this.renderSubmittedLines()}
					{this.renderCurrentLine()}
					{this.renderEmptyLines()}
				</div>
				<Keyboard letterStatus={Game.calculateLetterStatus(this.state.word, this.state.words)}
					onLetter={this.onLetter} onEnter={this.onEnter} onBackspace={this.onBackspace} />
			</>
		);
	}

	private renderSubmittedLines(): JSX.Element {
		const submittedLines = new Array<JSX.Element>();
		for (let i = 0; i < this.state.words.length; i++) {
			submittedLines.push(Game.renderLine(Game.calculateLetterStatusOfLine(this.state.word, this.state.words[i]), i));
		}
		return <>{submittedLines}</>;
	}

	private renderCurrentLine(): JSX.Element {
		if (this.state.words.length < 6) {
			const letters: Array<[string, LetterStatus]> = this.state.current.split("").map(l => [l, LetterStatus.Normal]);
			while (letters.length < 5) {
				letters.push(["", LetterStatus.Normal]);
			}
			return React.cloneElement(Game.renderLine(letters, this.state.words.length), { ref: (e: HTMLDivElement) => this.currentLineElement = e });
		}
		else {
			return null;
		}
	}

	private renderEmptyLines(): JSX.Element {
		const emptyLines = new Array<JSX.Element>();
		for (let i = this.state.words.length + 1; i < 6; i++) {
			emptyLines.push(Game.renderLine(new Array(5).fill([" ", LetterStatus.Normal]), i));
		}
		return <>{emptyLines}</>;
	}

	private onKeyDown(event: KeyboardEvent): void {
		const key = event.key.toUpperCase();
		if (key === "ENTER") {
			this.onEnter();
		}
		else if (key === "BACKSPACE") {
			this.onBackspace();
		}
		else if (/^\p{L}$/u.test(key)) {
			this.onLetter(key);
		}
	}
	private async onLetter(letter: string): Promise<void> {
		if (!this.hasWon() && this.state.words.length < 6 && this.state.current.length < 5) {
			await this.setState({ current: this.state.current + letter });
			Store.setCurrent(this.state.words, this.state.current);
		}
	}
	private async onEnter(): Promise<void> {
		if (this.hasWon()) {
		}
		else if (this.state.current.length !== 5) {
			this.props.onNotification?.("För få bokstäver");
			this.animateLineError();
		}
		else if (!WordSet.has(this.state.current)) {
			this.props.onNotification?.("Finns inte i ordlistan");
			this.animateLineError();
		}
		else {
			await this.setState({ words: [...this.state.words, this.state.current], current: "" });
			Store.setCurrent(this.state.words, this.state.current);
			if (this.hasWon()) {
				Store.currentStreak++;
				Store.longestStreak = Math.max(Store.longestStreak, Store.currentStreak);
				Store.gameCount++;
				Store.gamesWon++;
				const guessDistribution = Store.guessDistribution;
				guessDistribution[this.state.words.length - 1] = guessDistribution[this.state.words.length - 1] + 1;
				Store.guessDistribution = guessDistribution;
				window.setTimeout(() => this.props.onNotification?.(["Tur?", "Geni!", "Duktigt!", "Du klarade det", "Nära", "Ojojoj"][this.state.words.length - 1]), 2500);
				window.setTimeout(() => this.props.onNavigate?.(MainView.Stats), 5000);
			}
			else if (this.state.words.length === 6) {
				Store.currentStreak = 0;
				Store.gameCount++;
				window.setTimeout(() => this.props.onNotification?.("Attans!"), 2500);
				window.setTimeout(() => this.props.onNavigate?.(MainView.Stats), 5000);
			}
		}
	}
	private async onBackspace(): Promise<void> {
		if (!this.hasWon() && this.state.current.length > 0) {
			await this.setState({ current: this.state.current.substring(0, this.state.current.length - 1) });
			Store.setCurrent(this.state.words, this.state.current);
		}
	}

	private hasWon(): boolean {
		return Game.isWon(this.state.word, this.state.words);
	}

	private animateLineError(): void {
		this.currentLineElement?.animate([
			{ transform: "translateX(0px)" },
			{ transform: "translateX(0.5rem)" },
			{ transform: "translateX(-0.5rem)" },
			{ transform: "translateX(0.5rem)" },
			{ transform: "translateX(-0.5rem)" },
			{ transform: "translateX(0px)" },
		], {
			duration: 500,
			easing: "ease-out",
		});
	}
}
