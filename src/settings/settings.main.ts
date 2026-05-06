import MeuPlugin from "../main";
import { PluginSettingTab } from "obsidian"
import { defaultFolderColorSchema } from "./settings.utils";
import { IMeuPluginSettings } from "./settings.interfaces";
import { SettingsColoredFolders } from "./models/settingsColoredFolders.model";
import { SettingsColoredStatus } from "./models/settingsColoredStatus.model";


export const DEFAULT_SETTINGS: IMeuPluginSettings = {
    updateCssClassesOnStatusChange: false,
    coloredFoldersLegacy: false,
    coloredFoldersEnhancedColors: [
        defaultFolderColorSchema("01", "gray"),
        defaultFolderColorSchema("02", "green"),
        defaultFolderColorSchema("03", "purple"),
        defaultFolderColorSchema("04", "orange"),
        defaultFolderColorSchema("97", "black"),
        defaultFolderColorSchema("98", "black"),
        defaultFolderColorSchema("99", "black")
    ],
    coloredFoldersLegacyColors: [
        defaultFolderColorSchema("01", "cyan"),
        defaultFolderColorSchema("02", "blue"),
        defaultFolderColorSchema("03", "indigo"),
        defaultFolderColorSchema("04", "purple"),
        defaultFolderColorSchema("97", "pink"),
        defaultFolderColorSchema("98", "pink"),
        defaultFolderColorSchema("99", "pink")
    ],
    collapsedFolders: []
}

export class MeuVaultSettingTab extends PluginSettingTab {
    private settingsColoredStatusModel: SettingsColoredStatus;
    private settingsColoredFoldersModel: SettingsColoredFolders;

    constructor(app: import("obsidian").App, plugin: MeuPlugin) {
        super(app, plugin);
        this.settingsColoredStatusModel = new SettingsColoredStatus(plugin);
        this.settingsColoredFoldersModel = new SettingsColoredFolders(plugin, this.containerEl);
    }

    display(): void {
        const { containerEl } = this;
        containerEl.empty();
        
        this.settingsColoredStatusModel.renderStatusThemesSettings(containerEl);
        this.settingsColoredFoldersModel.renderMainColoredFoldersSettings(containerEl);
    }

    applySettings() {
        this.settingsColoredFoldersModel.applySettings()
    }
}
