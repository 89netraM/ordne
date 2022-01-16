import React from "react";
import { LetterStatus } from "./LetterStatus";

export interface LetterTileProperties {
	status?: LetterStatus;
	letter: string;
}

export function LetterTile(props: LetterTileProperties): JSX.Element {
	return (
		<span className={`letter-tile ${props.status ?? LetterStatus.Normal}`}>{props.letter}</span>
	);
}
