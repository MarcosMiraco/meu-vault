import { Plugin } from 'obsidian';
import { statusThemeNames } from './css/index';
import { DEFAULT_SETTINGS, MeuVaultSettingTab, MeuPluginSettings } from './settings/settings';
import './css/index';


export default class MeuPlugin extends Plugin {
	public settings: MeuPluginSettings = DEFAULT_SETTINGS;
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

		let rules = "";
		if (this.settings.coloredFoldersLegacy) {
			rules = this.settings.coloredFoldersLegacyColors
				.map(({ prefix, color }) => `
					body.colored-folders-legacy-enabled 
					.nav-folder:has(> [data-path^="${prefix}"]) {
						--folder-color: ${color};
					}
				`)
				.join("\n");
		}
		else {
			rules = this.settings.coloredFoldersEnhancedColors
				.map(({ prefix, color }) => `
					body:not(.colored-folders-legacy-enabled) 
					.nav-folder:has(> [data-path^="${prefix}"]) {
						--folder-color: ${color};
					}
				`)
				.join("\n");
		}


		this.styleEl.textContent = rules;
	}

	onStatusUpdate(file: import("obsidian").TFile) {
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

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData() as Partial<MeuPluginSettings>);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
