import React, { ChangeEvent, Component, ReactNode } from "react";

export interface SettingsProperties {

}

const darkThemeKey = "darkTheme";
interface SettingsState {
	readonly darkTheme: boolean;
}

export class Settings extends Component<SettingsProperties, SettingsState> {
	public static getForceDarkTheme(): boolean | null {
		const stored = window.localStorage.getItem(darkThemeKey);
		if (stored != null) {
			return stored === "true";
		}
		else {
			return null;
		}
	}
	public static getInitialDarkTheme(): boolean {
		return Settings.getForceDarkTheme() ?? window.matchMedia("(prefers-color-scheme: dark)").matches;
	}

	public static setDarkTheme(darkTheme: boolean | null): void {
		if (darkTheme != null) {
			window.document.querySelector("body").setAttribute("data-theme", darkTheme ? "dark" : "light");
		}
	}

	public constructor(props: SettingsProperties) {
		super(props);

		this.state = {
			darkTheme: Settings.getInitialDarkTheme(),
		};

		this.toggleDarkTheme = this.toggleDarkTheme.bind(this);
	}

	public render(): ReactNode {
		return (
			<>
				<p>
					<label>
						<span>Mörkt tema</span>
						<input type="checkbox" checked={this.state.darkTheme} onChange={this.toggleDarkTheme} />
						<span className="toggle"></span>
					</label>
				</p>
				<hr />
				<p>
					Ordlistan är en nedkapad version av <a href="https://extensions.libreoffice.org/en/extensions/show/swedish-spelling-dictionary-den-stora-svenska-ordlistan">Swedish Dict 2.24</a>,
					under licens <a href="https://www.gnu.org/licenses/lgpl-3.0.html">LGPL</a>.
				</p>
				<hr />
				<p className="bottom">
					<small>
						Inspirerat av <a href="https://www.powerlanguage.co.uk/wordle/">Wordle</a>,
						skapat av <a href="https://åsberg.net/">Mårten Åsberg</a>
					</small>
				</p>
			</>
		);
	}

	private toggleDarkTheme(e: ChangeEvent<HTMLInputElement>): void {
		this.setState({
			darkTheme: e.target.checked,
		});
		window.localStorage.setItem(darkThemeKey, e.target.checked.toString());
		Settings.setDarkTheme(e.target.checked);
	}
}
