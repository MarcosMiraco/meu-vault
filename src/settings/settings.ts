import MeuPlugin from "../main";
import { PluginSettingTab, Setting } from "obsidian"
import { GLOBAL_COLORS } from "../css";


export interface IFolderColorSetting {
    prefix: string; 
    applyToSubFolders: boolean;

    textColor: string;
    highlightTextColor: string;
    activeTextColor: string;
    
    backgroundColor: string;
    highlightBackgroundColor: string;
    activeBackgroundColor: string;
}

export type FolderColorSettingKey = keyof IFolderColorSetting;

export interface IMeuPluginSettings {
    updateCssClassesOnStatusChange: boolean;

    coloredFoldersLegacy: boolean;
    coloredFoldersEnhancedColors: IFolderColorSetting[];
    coloredFoldersLegacyColors: IFolderColorSetting[];
}

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
    ]
}

function defaultFolderColorSchema(prefix: string, colorName: keyof typeof GLOBAL_COLORS.default): IFolderColorSetting {
    const textColor = GLOBAL_COLORS.default.white;
    const activeTextColor = GLOBAL_COLORS.default.color;
    const highlightTextColor = GLOBAL_COLORS.default.color;

    const backgroundColor = 
        GLOBAL_COLORS.darker[colorName as keyof typeof GLOBAL_COLORS.darker] ??
        GLOBAL_COLORS.default[colorName];
    const activeBackgroundColor = 
        GLOBAL_COLORS.transparent[colorName as keyof typeof GLOBAL_COLORS.transparent] ??
        GLOBAL_COLORS.default[colorName];
    const highlightBackgroundColor = 
        GLOBAL_COLORS.darkest[colorName as keyof typeof GLOBAL_COLORS.darkest] ??
        GLOBAL_COLORS.default[colorName];

    return {
        prefix,
        applyToSubFolders: false,

        textColor,
        highlightTextColor,

        backgroundColor,
        highlightBackgroundColor,

        activeTextColor,
        activeBackgroundColor
    }
}

export class MeuVaultSettingTab extends PluginSettingTab {
    private folderListContainerEl: HTMLElement | undefined = undefined;
    private plugin: MeuPlugin;

    constructor(app: import("obsidian").App, plugin: MeuPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const { containerEl } = this;
        containerEl.empty();
        
        this.renderStatusThemesSettings(containerEl);
        this.renderColoredFoldersSettings(containerEl);
    }

    applySettings() {
        document.body.toggleClass("colored-folders-legacy-enabled", this.plugin.settings.coloredFoldersLegacy);
        this.plugin.injectColoredFoldersStyles();
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

    renderColoredFoldersSettings(containerEl: HTMLElement) {
        const { groupItemsContainer } = this.generateSettingsGroup(containerEl, "Colored Folders");
        new Setting(groupItemsContainer)
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

    renderFolderList(containerEl: HTMLElement) {
        const isLegacy = this.plugin.settings.coloredFoldersLegacy;

        this.folderListContainerEl?.remove();
        const { groupContainer, groupItemsContainer } = this.generateSettingsGroup(
            containerEl, 
            isLegacy ? 
                'Legacy Colors' : 
                'Enhanced Colors'
        );
        this.folderListContainerEl = groupContainer;

        const colors = isLegacy
            ? this.plugin.settings.coloredFoldersLegacyColors
            : this.plugin.settings.coloredFoldersEnhancedColors;

        for (let index = 0; index < colors.length; index++) {
            this.renderFolderColorSetting(groupItemsContainer, colors, index, isLegacy);
        }

        new Setting(groupItemsContainer)
            .addButton(button => button
                .setButtonText("Add Folder")
                .setIcon("plus")
                .onClick(async () => {
                    colors.push(defaultFolderColorSchema("00", "gray"));
                    await this.saveAndApply(isLegacy, colors);
                    this.renderFolderList(containerEl);
                })
            );
    }

    renderFolderColorSetting(
        container: HTMLElement,
        colors: IFolderColorSetting[],
        index: number,
        isLegacy: boolean
    ) {
        const entry = colors[index]!;
        const setting = new Setting(container)
            .setName(`Pasta: ${entry.prefix}`)

        this.renderFolderColorButtons(setting, colors, entry, index, isLegacy);
        this.renderFolderColorOptions(container, colors, entry, index, isLegacy);
    }

    renderFolderColorButtons(
        setting: Setting,         
        colors: IFolderColorSetting[],
        entry: IFolderColorSetting,
        index: number,
        isLegacy: boolean
    ) {
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
    }

    renderFolderColorOptions(
        container: HTMLElement,
        colors: IFolderColorSetting[],
        entry: IFolderColorSetting,
        index: number,
        isLegacy: boolean
    ) {
        const colorOptionsContainer = this.generateSettingsOptionList(container);

        const applyToSubFolderOptionContainer = colorOptionsContainer.createEl("li");
        const applyToSubFolderSetting = new Setting(applyToSubFolderOptionContainer)
        applyToSubFolderSetting
            .addToggle(toggle => toggle
                .setValue(entry.applyToSubFolders)
                .onChange(async (value) => {
                    colors[index]!.applyToSubFolders = value;
                    await this.saveAndApply(isLegacy, colors);
                })
            )
            .setName("Apply To Sub Folders");

        this.renderFolderColorOptionItem(
            colorOptionsContainer, 
            "textColor",
            colors,
            entry, 
            index,
            isLegacy
        )
        this.renderFolderColorOptionItem(
            colorOptionsContainer, 
            "activeTextColor",
            colors,
            entry, 
            index,
            isLegacy
        )
        this.renderFolderColorOptionItem(
            colorOptionsContainer, 
            "highlightBackgroundColor",
            colors,
            entry, 
            index,
            isLegacy
        )

        this.renderFolderColorOptionItem(
            colorOptionsContainer, 
            "backgroundColor",
            colors,
            entry, 
            index,
            isLegacy
        )
        this.renderFolderColorOptionItem(
            colorOptionsContainer, 
            "activeBackgroundColor",
            colors,
            entry, 
            index,
            isLegacy
        )
        this.renderFolderColorOptionItem(
            colorOptionsContainer, 
            "highlightBackgroundColor",
            colors,
            entry, 
            index,
            isLegacy
        )
    }

    renderFolderColorOptionItem(
        container: HTMLElement, 
        type: FolderColorSettingKey,
        colors: IFolderColorSetting[],
        entry: IFolderColorSetting,
        index: number,
        isLegacy: boolean
    ) {
        if (type === "applyToSubFolders") return;

        const entryTypeValue = entry[type];
        const colorOptionItem = container.createEl("li");
        const colorOptionItemSetting = new Setting(colorOptionItem)
            .setName(type)
            .setDesc(entryTypeValue)

        colorOptionItemSetting.addDropdown(dropdown => {
            const colorOptions: Record<string, string> = {
                ...this.processGlobalColors(),
                "Custom": "custom"
            };

            for (const [key, value] of Object.entries(colorOptions)) {
                dropdown.addOption(value, key);
            }

            const isPredefined = this.isPredefined(entryTypeValue);
            dropdown.setValue(isPredefined ? entryTypeValue : "custom");

            const colorPickerContainer = container.createDiv({ cls: "color-picker-container" });
            const colorInput = colorPickerContainer.createEl("input", { type: "color" });
            colorInput.value = entryTypeValue;
            colorPickerContainer.style.display = isPredefined ? "none" : "block";

            colorInput.addEventListener("change", async () => {
                colors[index]![type] = colorInput.value;
                colorOptionItemSetting.setDesc(colorInput.value);
                await this.saveAndApply(isLegacy, colors);
            });

            dropdown.onChange(async (value) => {
                if (value === "custom") {
                    colorPickerContainer.style.display = "block";
                } 
                else {
                    colorPickerContainer.style.display = "none";
                    colors[index]![type] = value;
                    colorInput.value = value;
                    colorOptionItemSetting.setDesc(value);
                    await this.saveAndApply(isLegacy, colors);
                }
            });
        });
    }

    generateSettingsGroup(container: HTMLElement, title: string) {
        const groupContainer = container.createDiv({ cls: "setting-group" });
        groupContainer
            .createDiv({ cls: "setting-item setting-item-heading" })
            .createDiv({ cls: "setting-item-name", text: title });

        return {
            groupContainer: groupContainer, 
            groupItemsContainer: groupContainer.createDiv({ cls: "setting-items" })
        };
    }

    generateSettingsOptionList(container: HTMLElement) {
        const settingOptionListContainer = container.createEl("ul", { cls: "setting-list" });
        settingOptionListContainer.style.display = "flex";
        settingOptionListContainer.style.flexDirection = "column";
        settingOptionListContainer.style.gap = "10px";
        settingOptionListContainer.style.marginBottom = "10px";

        return settingOptionListContainer;
    }

    isPredefined(hex: string): boolean {
        for (const colors of Object.values(GLOBAL_COLORS)) {
            for (const value of Object.values(colors)) {
                if (value === hex) return true;
            }
        }
        return false;
    }

    async saveAndApply(isLegacy: boolean, colors: IFolderColorSetting[]) {
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