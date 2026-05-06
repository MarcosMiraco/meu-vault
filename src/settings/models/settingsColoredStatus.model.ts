import MeuPlugin from "../../main";
import { Setting } from "obsidian";
import { MyVaultSettingsBase } from "./settingsBase.model";


export class SettingsColoredStatus extends MyVaultSettingsBase {

    constructor(plugin: MeuPlugin) {
        super(plugin)
    }

    renderStatusThemesSettings(containerEl: HTMLElement) {
        const { groupItemsContainer } = this.generateSettingsGroup(containerEl, "Status Themes");
        new Setting(groupItemsContainer)
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.updateCssClassesOnStatusChange)
                .onChange(async (value) => {
                    this.plugin.settings.updateCssClassesOnStatusChange = value;
                    await this.plugin.saveSettings();
                })
            )
            .setName("Update CSS Classes on Status Change");
    }

    saveAndApplySettings(): void { throw new Error("Method Not Implemented") }

    applySettings(): void { throw new Error("Method Not Implemented") }
}
