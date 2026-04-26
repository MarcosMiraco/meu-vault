import { PluginSettingTab, Setting } from "obsidian"
import MeuPlugin from "../main";
import { GLOBAL_COLORS } from "../css/global.css";


export interface MeuPluginSettings {
    updateCssClassesOnStatusChange: boolean;

    coloredFoldersLegacy: boolean;
    coloredFoldersEnhancedColors: { prefix: string; color: string }[];
    coloredFoldersLegacyColors: { prefix: string; color: string }[];
}

export const DEFAULT_SETTINGS: MeuPluginSettings = {
    updateCssClassesOnStatusChange: false,

    coloredFoldersLegacy: false,
    coloredFoldersEnhancedColors: [
        { prefix: "01", color: GLOBAL_COLORS.darker.gray },
        { prefix: "02", color: GLOBAL_COLORS.darker.green },
        { prefix: "03", color: GLOBAL_COLORS.darker.purple },
        { prefix: "04", color: GLOBAL_COLORS.darker.orange },
        { prefix: "97", color: GLOBAL_COLORS.default.black },
        { prefix: "98", color: GLOBAL_COLORS.default.black },
        { prefix: "99", color: GLOBAL_COLORS.default.black }
    ],
    coloredFoldersLegacyColors: [
        { prefix: "01", color: GLOBAL_COLORS.darker.cyan },
        { prefix: "02", color: GLOBAL_COLORS.darker.blue },
        { prefix: "03", color: GLOBAL_COLORS.darker.indigo },
        { prefix: "04", color: GLOBAL_COLORS.darker.purple },
        { prefix: "97", color: GLOBAL_COLORS.default.pink },
        { prefix: "98", color: GLOBAL_COLORS.default.pink },
        { prefix: "99", color: GLOBAL_COLORS.default.pink }
    ]
}

export class MeuVaultSettingTab extends PluginSettingTab {
    private folderListEl: HTMLElement | null = null;
    private plugin: MeuPlugin;

    constructor(app: import("obsidian").App, plugin: MeuPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const { containerEl } = this;
        containerEl.empty();

        containerEl.createEl('h2', { text: 'Status Themes' });
        new Setting(containerEl)
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.updateCssClassesOnStatusChange)
                .onChange(async (value) => {
                    this.plugin.settings.updateCssClassesOnStatusChange = value;
                    await this.plugin.saveSettings();
                })
            )
            .setName("Update CSS Classes on Status Change");

        containerEl.createEl('h2', { text: 'Colored Folders' });
        new Setting(containerEl)
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.coloredFoldersLegacy)
                .onChange(async (value) => {
                    this.plugin.settings.coloredFoldersLegacy = value;
                    document.body.toggleClass("colored-folders-legacy-enabled", value);
                    this.plugin.injectColoredFoldersStyles();
                    await this.plugin.saveSettings();
                    this.renderFolderList(containerEl);
                })
            )
            .setName("Legacy Colored Folders")
        
        this.renderFolderList(containerEl);
    }

    applySettings() {
        document.body.toggleClass("colored-folders-legacy-enabled", this.plugin.settings.coloredFoldersLegacy);
        this.plugin.injectColoredFoldersStyles();
    }

    renderFolderList(containerEl: HTMLElement) {
        this.folderListEl?.remove();
        this.folderListEl = containerEl.createDiv();

        const isLegacy = this.plugin.settings.coloredFoldersLegacy;
        const colors = isLegacy
            ? this.plugin.settings.coloredFoldersLegacyColors
            : this.plugin.settings.coloredFoldersEnhancedColors;

        this.folderListEl.createEl('h3', { text: isLegacy ? 'Legacy Colors' : 'Enhanced Colors' });

        for (let index = 0; index < colors.length; index++) {
            this.renderFolderColorSetting(this.folderListEl, colors, index, isLegacy);
        }

        // Botão de adicionar no final
        new Setting(this.folderListEl)
            .addButton(button => button
                .setButtonText("Add Folder")
                .setIcon("plus")
                .onClick(async () => {
                    colors.push({ prefix: "00", color: GLOBAL_COLORS.darker.gray });
                    await this.saveAndApply(isLegacy, colors);
                    this.renderFolderList(containerEl); // re-renderiza com o novo item
                })
            );
    }

    renderFolderColorSetting(
        container: HTMLElement,
        colors: { prefix: string; color: string }[],
        index: number,
        isLegacy: boolean
    ) {
        const entry = colors[index]!;
        const setting = new Setting(container)
            .setName(`Pasta: ${entry.prefix}`)
            .setDesc(entry.color)

        setting.addExtraButton(btn => {
            btn.setIcon("chevron-up")
                .setTooltip("Move up")
                .setDisabled(index === 0)
                .onClick(async () => {
                    [colors[index - 1], colors[index]] = [colors[index]!, colors[index - 1]!];
                    await this.saveAndApply(isLegacy, colors);
                    this.renderFolderList(this.containerEl);
                });
        });

        setting.addExtraButton(btn => {
            btn.setIcon("chevron-down")
                .setTooltip("Move down")
                .setDisabled(index === colors.length - 1)
                .onClick(async () => {
                    [colors[index + 1], colors[index]] = [colors[index]!, colors[index + 1]!];
                    await this.saveAndApply(isLegacy, colors);
                    this.renderFolderList(this.containerEl);
                });
        });

        setting.addExtraButton(btn => btn
            .setIcon("pencil")
            .setTooltip("Edit folder prefix")
            .onClick(() => {
                const nameEl = setting.nameEl;
                nameEl.empty();

                const input = nameEl.createEl("input", { type: "text" });
                input.value = entry.prefix;
                input.style.width = "80px";
                input.focus();

                const confirm = async () => {
                    const newPrefix = input.value.trim();
                    if (newPrefix) {
                        colors[index]!.prefix = newPrefix;
                        await this.saveAndApply(isLegacy, colors);
                    }
                    nameEl.empty();
                    nameEl.setText(`Pasta: ${colors[index]!.prefix}`);
                };

                input.addEventListener("blur", confirm);
                input.addEventListener("keydown", (e) => {
                    if (e.key === "Enter") input.blur();
                    if (e.key === "Escape") {
                        nameEl.empty();
                        nameEl.setText(`Pasta: ${entry.prefix}`);
                    }
                });
            })
        );

        setting.addExtraButton(btn => btn
            .setIcon("trash-2")
            .setTooltip("Remove folder")
            .onClick(async () => {
                colors.splice(index, 1);
                await this.saveAndApply(isLegacy, colors);
                this.renderFolderList(this.containerEl);
            })
        );

        setting.addDropdown(dropdown => {
            const colorOptions: Record<string, string> = {
                ...this.processGlobalColors(),
                "Custom": "custom"
            };

            for (const [key, value] of Object.entries(colorOptions)) {
                dropdown.addOption(value, key);
            }

            const isPredefined = this.isPredefined(entry.color);
            dropdown.setValue(isPredefined ? entry.color : "custom");

            const colorPickerContainer = container.createDiv({ cls: "color-picker-container" });
            const colorInput = colorPickerContainer.createEl("input", { type: "color" });
            colorInput.value = entry.color;
            colorPickerContainer.style.display = isPredefined ? "none" : "block";

            colorInput.addEventListener("change", async () => {
                colors[index]!.color = colorInput.value;
                setting.setDesc(colorInput.value);
                await this.saveAndApply(isLegacy, colors);
            });

            dropdown.onChange(async (value) => {
                if (value === "custom") {
                    colorPickerContainer.style.display = "block";
                } else {
                    colorPickerContainer.style.display = "none";
                    colors[index]!.color = value;
                    colorInput.value = value;
                    setting.setDesc(value);
                    await this.saveAndApply(isLegacy, colors);
                }
            });
        });
    }

    isPredefined(hex: string): boolean {
        for (const colors of Object.values(GLOBAL_COLORS)) {
            for (const value of Object.values(colors)) {
                if (value === hex) return true;
            }
        }
        return false;
    }

    async saveAndApply(isLegacy: boolean, colors: { prefix: string; color: string }[]) {
        if (isLegacy) {
            this.plugin.settings.coloredFoldersLegacyColors = colors;
        } else {
            this.plugin.settings.coloredFoldersEnhancedColors = colors;
        }
        this.plugin.injectColoredFoldersStyles();
        await this.plugin.saveSettings();
    }

    processGlobalColors() {
        const processedColors: Record<string, string> = {};
        for (const [group, colors] of Object.entries(GLOBAL_COLORS)) {
            for (const [name, value] of Object.entries(colors)) {
                processedColors[`${group}.${name}`] = value;
            }
        }

        return processedColors;
    }
}