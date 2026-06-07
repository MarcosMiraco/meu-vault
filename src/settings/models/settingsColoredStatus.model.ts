import MeuPlugin from "../../main";
import { Setting } from "obsidian";
import { MyVaultSettingsBase } from "./settingsBase.model";


export class SettingsColoredStatus extends MyVaultSettingsBase {

    constructor(plugin: MeuPlugin) {
        super(plugin)
    }

    renderStatusThemesSettings(containerEl: HTMLElement) {
        const { groupItemsContainer } = this.generateSettingsGroup(containerEl, "Themas de Status");
        new Setting(groupItemsContainer)
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.updateCssClassesOnStatusChange)
                .onChange(async (value) => {
                    this.plugin.settings.updateCssClassesOnStatusChange = value;
                    await this.plugin.saveSettings();
                })
            )
            .setName("Atualizar Classes CSS em Mudanças de Status");
    }

    saveAndApplySettings(): void { throw new Error("Method Not Implemented") }

    applySettings(): void { throw new Error("Method Not Implemented") }
}
