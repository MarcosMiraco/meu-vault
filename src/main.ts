import { Plugin } from 'obsidian';
import { GLOBAL_COLORS, statusThemeNames } from './css/index';
import { DEFAULT_SETTINGS, MeuVaultSettingTab } from './settings/settings.main';
import { IFolderColorSetting, IMeuPluginSettings } from './settings/settings.interfaces';
import './css/index';


export default class MeuPlugin extends Plugin {
	public settings: IMeuPluginSettings = DEFAULT_SETTINGS;
	private styleEl: HTMLStyleElement | null = null;
	private classesPropertyName = "cssclasses";

	async onload() {
		await this.loadSettings();

		this.registerEvent(
			this.app.metadataCache.on('changed', this.onStatusUpdate.bind(this))
		);

		this.registerEvent(
			this.app.workspace.on('file-open', (file) => { if (file) this.onStatusUpdate(file) })
		);

		const meuVaultSettingTab = new MeuVaultSettingTab(this.app, this);
		this.addSettingTab(meuVaultSettingTab);
		meuVaultSettingTab.applySettings();

		// Exemplo: Registrando um processador de Markdown para seus callouts
		// this.registerMarkdownCodeBlockProcessor("custom-callout", (source, el, ctx) => {
		// 	const type = source.trim() as keyof typeof statusStyles; // ex: "apodrecido"

		// 	const container = el.createDiv();
		// 	container.addClass(baseCallout);

		// 	// Aplica a classe gerada pelo loop do Vanilla Extract
		// 	if (statusStyles[type]) {
		// 		container.addClass(statusStyles[type]);
		// 	}

		// 	container.setText(`Este é um bloco do tipo: ${type}`);
		// });

		// this.addCommand({
		// 	id: 'testar-meu-estilo',
		// 	name: 'Testar Estilo Vanilla Extract',
		// 	callback: () => {
		// 		const view = this.app.workspace.getActiveViewOfType(require("obsidian").MarkdownView);
		// 		if (view) {
		// 			const div = view.containerEl.createDiv()
		// 			div.addClass(testeVisual);
		// 			div.setText("Se você está vendo isso roxo com borda amarela, FUNCIONOU!");
		// 		}
		// 	}
		// });
	}

	onunload() {
		this.styleEl?.remove();
	}

	injectColoredFoldersStyles() {
		if (!this.styleEl) {
			this.styleEl = document.createElement("style");
			this.styleEl.id = "meu-plugin-dynamic-styles";
			document.head.appendChild(this.styleEl);
		}

		let selector = "";
		let colorsArray: IFolderColorSetting[];
		if (this.settings.coloredFoldersLegacy) {
			selector = "body.colored-folders-legacy-enabled";
			colorsArray = this.settings.coloredFoldersLegacyColors;
		}
		else {
			selector = "body:not(.colored-folders-legacy-enabled)";
			colorsArray = this.settings.coloredFoldersEnhancedColors;
		}

		const rules = colorsArray
			.map(({
				prefix,
				applyToSubFolders,

				textColor,
				highlightTextColor,
				activeTextColor,

				backgroundColor,
				highlightBackgroundColor,
				activeBackgroundColor
			}) => `
				${selector} 
				.nav-folder:has(> [data-path${applyToSubFolders ? "*" : "^"}="${prefix}"]) {
					--nav-tag-color: ${textColor};
					--nav-tag-color-hover: ${highlightTextColor};
					--nav-collapse-icon-color: ${GLOBAL_COLORS.default.white};
					--nav-item-color-active: ${activeTextColor};
					--nav-item-color-hover: ${highlightTextColor};
					--nav-item-color: ${textColor};
					--nav-item-background-active: ${activeBackgroundColor};
					--nav-item-background-hover: ${highlightBackgroundColor};
					--folder-color: ${backgroundColor} ${applyToSubFolders ? "!important" : ""};
				}
			`)
			.join("\n");

		this.styleEl.textContent = rules;
	}

	onStatusUpdate(file: import("obsidian").TFile) {
		if (!this.settings.updateCssClassesOnStatusChange) return;

		const cache = this.app.metadataCache.getFileCache(file);
		if (!cache?.frontmatter) return;

		for (const key in cache.frontmatter) {
			if (!key.toLocaleLowerCase().startsWith("status")) continue;

			const value = cache.frontmatter[key];
			if (!Array.isArray(value)) continue;

			const valueThemeIndex = statusThemeNames.findIndex(statusThemeName => value.includes(statusThemeName));
			if (valueThemeIndex === -1) continue;

			this.app.fileManager.processFrontMatter(file, (frontMatter) => {
				if (!Array.isArray(frontMatter[this.classesPropertyName])) frontMatter[this.classesPropertyName] = []

				const themeToAdd = statusThemeNames[valueThemeIndex];
				if (!frontMatter[this.classesPropertyName].includes(themeToAdd)) {
					frontMatter[this.classesPropertyName].push(themeToAdd);
				}
			})
			return;
		}

		this.app.fileManager.processFrontMatter(file, (frontMatter) => {
			if (!Array.isArray(frontMatter[this.classesPropertyName])) return

			for (const statusThemeName of statusThemeNames) {
				frontMatter[this.classesPropertyName].remove(statusThemeName);
			}

			if (frontMatter[this.classesPropertyName].length === 0) delete frontMatter[this.classesPropertyName];
		})
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	async loadSettings() {
		const loadedSettings: Partial<IMeuPluginSettings> = await this.loadData();

		if (loadedSettings?.configVersion === DEFAULT_SETTINGS.configVersion) {
			this.settings = loadedSettings as IMeuPluginSettings;;
			return;
		}

		const migratedSettings = this.migrateSettings(loadedSettings ?? {});
		this.settings = migratedSettings

		await this.saveSettings();
		return;
	}

	private migrateSettings(loaded: Partial<IMeuPluginSettings>): IMeuPluginSettings {
		return this.mergeWithDefaults<IMeuPluginSettings>(DEFAULT_SETTINGS, loaded);
	}

	private mergeWithDefaults<T extends object>(defaults: T, loaded: Partial<T>): T {
		const result = {} as T;

		for (const key in defaults) {
			const k = key as keyof T;
			const defaultValue = defaults[k];
			const userValue = loaded[k];

			result[k] = this.resolveValue(defaultValue, userValue) as T[keyof T];
		}

		return result;
	}

	private resolveValue<T>(defaultValue: T, userValue: unknown): T {
		if (Array.isArray(defaultValue)) {
			if (!Array.isArray(userValue)) return defaultValue;
			return this.mergeArray(defaultValue, userValue) as T;
		}

		if (typeof defaultValue === "object" && defaultValue !== null) {
			if (typeof userValue !== "object" || userValue === null || Array.isArray(userValue)) {
				return defaultValue;
			}
			return this.mergeWithDefaults(defaultValue as object, userValue as object) as T;
		}

		if (userValue !== undefined && typeof userValue === typeof defaultValue) {
			return userValue as T;
		}

		return defaultValue;
	}

	private mergeArray<T>(defaultArr: T[], userArr: unknown[]): T[] {
		if (defaultArr.length === 0) {
			return userArr as T[];
		}

		const template = defaultArr[0];
		if (typeof template !== "object" || template === null) {
			return userArr.filter(item => typeof item === typeof template) as T[];
		}

		return userArr
			.filter(item => typeof item === "object" && item !== null && !Array.isArray(item))
			.map(item => this.mergeWithDefaults(template as object, item as object)) as T[];
	}
}
