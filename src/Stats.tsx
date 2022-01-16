import React, { Component, ReactNode } from "react";
import { Game } from "./Game";
import { Store } from "./Store";

export interface StatsProperties {

}

interface StatsState {
	timeToNext: number;
}

export class Stats extends Component<StatsProperties, StatsState> {
	private static calculateTimeToNext(): number {
		const now = new Date();
		const today = new Date(now.toISOString().substring(0, 10));
		const nextDay = new Date(today.getTime() + 24 * 3600000);
		return nextDay.getTime() - now.getTime();
	}
	private static formatTime(time: number): string {
		const hours = Math.floor(time / 3600000);
		const minutes = Math.floor((time - hours * 3600000) / 60000);
		const seconds = Math.floor((time - hours * 3600000 - minutes * 60000) / 1000);
		return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
	}

	private intervalId: number;

	public constructor(props: StatsProperties) {
		super(props);

		this.state = {
			timeToNext: Stats.calculateTimeToNext(),
		};

		this.onInterval = this.onInterval.bind(this);
		this.share = this.share.bind(this);
	}

	public override componentDidMount(): void {
		this.intervalId = window.setInterval(this.onInterval, 1000);
	}

	public override componentWillUnmount(): void {
		window.clearInterval(this.intervalId);
	}

	private onInterval(): void {
		this.setState({
			timeToNext: Stats.calculateTimeToNext(),
		});
	}

	public render(): ReactNode {
		const guessDistribution = Store.guessDistribution;
		const maxGuessDistribution = Math.max(...guessDistribution);
		return (
			<>
				<div className="stats">
					<div>
						<p>{Store.gameCount}</p>
						<p>SPELADE</p>
					</div>
					<div>
						<p>{Store.gameCount === 0 ? 0 : Math.round(100 * (Store.gamesWon / Store.gameCount))}</p>
						<p>%&nbsp;VUNNA</p>
					</div>
					<div>
						<p>{Store.currentStreak}</p>
						<p>VINSTSVIT</p>
					</div>
					<div>
						<p>{Store.longestStreak}</p>
						<p>LÄNGSTA VINSTSVIT</p>
					</div>
				</div>
				<p><strong>GISSNINGAR</strong></p>
				<div className="guesses">
					{guessDistribution.map((v, i) =>
						<p key={i}>{i + 1} <span style={{["--percentage" as any]: (v / maxGuessDistribution) * 100}}>{v}</span></p>
					)}
				</div>
				<div className="split">
					<div className="left">
						<p>NÄSTA ORDNE</p>
						<p>{Stats.formatTime(this.state.timeToNext)}</p>
					</div>
					<div className="right">
						<button className="primary" onClick={this.share} disabled={!Game.isDone(Store.currentWord, Store.currentWords)}>DELA 💬</button>
					</div>
				</div>
			</>
		);
	}

	private async share(): Promise<void> {
		const start = new Date("2022-01-16");
		const today = new Date(Store.currentDate);
		const day = Math.floor((today.getTime() - start.getTime()) / (24 * 3600000)) + 1;
		navigator.share({
			text: `Ordne ${day} ${Store.currentWords.length}/6\n\n${Game.createShareBlock(Store.currentWord, Store.currentWords)}`,
		});
	}
}
