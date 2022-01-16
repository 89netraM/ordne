import React, { Component, ReactNode } from "react";
import { LetterStatus } from "./LetterStatus";
import { LetterTile } from "./LetterTile";

export interface HelpProperties {

}

interface HelpState {

}

export class Help extends Component<HelpProperties, HelpState> {
	public constructor(props: HelpProperties) {
		super(props);
	}

	public render(): ReactNode {
		return (
			<>
				<p>Gissa <strong>ORDNE</strong> på sex försök.</p>
				<p>Varje gissning måste vara ett giltligt fem bokstävers ord. Trycke retur för att skicka in.</p>
				<p>Efter varje gissning kommer färgen på bokstavsbrickorna ändras för att visa hur nära din gissning var ordet.</p>
				<hr />
				<p><strong>Exempel</strong></p>
				<div className="line">
					<LetterTile letter="B" status={LetterStatus.Correct} />
					<LetterTile letter="J" />
					<LetterTile letter="Ö" />
					<LetterTile letter="R" />
					<LetterTile letter="K" />
				</div>
				<p>
					Bokstaven <strong>B</strong> är med i ordet och på rätt plats.
				</p>
				<div className="line">
					<LetterTile letter="D" />
					<LetterTile letter="A" status={LetterStatus.Included} />
					<LetterTile letter="M" />
					<LetterTile letter="E" />
					<LetterTile letter="R" />
				</div>
				<p>
					Bokstaven <strong>A</strong> är med i ordet men på fel plats.
				</p>
				<div className="line">
					<LetterTile letter="H" />
					<LetterTile letter="Ä" />
					<LetterTile letter="L" status={LetterStatus.NotIncluded} />
					<LetterTile letter="S" />
					<LetterTile letter="A" />
				</div>
				<p>
					Bokstaven <strong>L</strong> är inte med i ordet.
				</p>
				<hr />
				<p><strong>Ett nytt ORDNE kommer varje dag!</strong></p>
			</>
		);
	}
}
