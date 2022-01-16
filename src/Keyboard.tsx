import React from "react";
import { LetterStatus } from "./LetterStatus";

export interface KeyboardProperties {
	letterStatus: { [letter: string]: LetterStatus };
	onLetter: (letter: string) => void;
	onEnter: () => void;
	onBackspace: () => void;
}

export function Keyboard(props: KeyboardProperties): JSX.Element {
	return (
		<div className="keyboard">
			{["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "Å"].map(letter => makeKeyboardKey(letter, props))}
			{["A", "S", "D", "F", "G", "H", "J", "K", "L", "Ö", "Ä"].map(letter => makeKeyboardKey(letter, props))}
			<KeyboardKey symbol="RETUR" wide={true} onClick={props.onEnter} />
			{["Z", "X", "C", "V", "B", "N", "M"].map(letter => makeKeyboardKey(letter, props))}
			<KeyboardKey symbol="⌫" wide={true} onClick={props.onBackspace} />
		</div>
	);
}

function makeKeyboardKey(letter: string, props: KeyboardProperties): JSX.Element {
	return <KeyboardKey
		key={letter}
		symbol={letter}
		onClick={() => props.onLetter(letter)}
		status={props.letterStatus[letter]} />
}

export interface KeyboardKeyProperties {
	symbol: string;
	status?: LetterStatus;
	wide?: boolean;
	onClick: () => void;
}

function KeyboardKey(props: KeyboardKeyProperties): JSX.Element {
	return <button className={`${props.status ?? LetterStatus.Normal} ${props.wide === true ? "wide" : ""}`} onClick={props.onClick}>{props.symbol}</button>;
}
