import React, { Component, ReactNode } from "react";
import { Game } from "./Game";
import { Help } from "./Help";
import { Settings } from "./Settings";
import { Stats } from "./Stats";

export interface AppProperties {

}

interface AppState {
	readonly mainView: MainView;
	readonly notifications: ReadonlyArray<string>;
}

export enum MainView {
	Game = "Spel",
	Help = "Hjälp",
	Stats = "Statistik",
	Settings = "Inställningar",
}

export class App extends Component<AppProperties, AppState> {
	private notificationElement: HTMLDivElement = null;

	public constructor(props: AppProperties) {
		super(props);

		this.state = {
			mainView: MainView.Game,
			notifications: new Array<string>(),
		};

		this.goTo = this.goTo.bind(this);
		this.notify = this.notify.bind(this);
	}

	public render(): ReactNode {
		return (
			<>
				<header>
					{this.renderHeader()}
				</header>
				<div ref={e => this.notificationElement = e} className="notification"></div>
				<main className={this.state.mainView}>
					{this.renderMainView()}
				</main>
			</>
		);
	}

	private renderHeader(): ReactNode {
		if (this.state.mainView === MainView.Game) {
			return (
				<>
					<button className="help" title={MainView.Help} onClick={this.goTo.bind(this, MainView.Help)}>❓</button>
					<h1>ORDNE</h1>
					<div></div>
					<button className="stats" title={MainView.Stats} onClick={this.goTo.bind(this, MainView.Stats)}>📊</button>
					<button className="stats" title={MainView.Settings} onClick={this.goTo.bind(this, MainView.Settings)}>⚙️</button>
				</>
			);
		}
		else {
			return (
				<>
					<h2>{this.state.mainView}</h2>
					<div></div>
					<button title="Stäng" onClick={this.goTo.bind(this, MainView.Game)}>❌</button>
				</>
			);
		}
	}

	private renderMainView(): ReactNode {
		switch (this.state.mainView) {
			case MainView.Game:
			default:
				return <Game onNotification={this.notify} onNavigate={v => this.setState({ mainView: v })} />;
			case MainView.Help:
				return <Help />;
			case MainView.Stats:
				return <Stats />;
			case MainView.Settings:
				return <Settings />;
		}
	}

	private goTo(target: MainView): void {
		this.setState({ mainView: target });
	}

	private notify(notification: string): void {
		this.notificationElement.innerText = notification;
		this.notificationElement.animate([
			{ opacity: 0, offset: 0.0 },
			{ opacity: 1, offset: 0.1 },
			{ opacity: 1, offset: 0.9 },
			{ opacity: 0, offset: 1.0 },
		], {
			duration: 2000,
			easing: "linear",
		});
	}
}
