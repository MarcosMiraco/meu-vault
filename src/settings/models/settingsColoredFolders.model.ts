import { Setting } from "obsidian";
import { MyVaultSettingsBase } from "./settingsBase.model";
import { FolderColorSettingKey, IFolderColorSetting } from "../settings.interfaces";
import { defaultFolderColorSchema } from "../settings.utils";
import MeuPlugin from "../../main";


export class SettingsColoredFolders extends MyVaultSettingsBase {
    private containerEl: HTMLElement;

    constructor(plugin: MeuPlugin, containerEl: HTMLElement) {
        super(plugin)
        this.containerEl = containerEl;
    }

    renderMainColoredFoldersSettings(containerEl: HTMLElement) {
        const { groupItemsContainer } = this.generateSettingsGroup(containerEl, "Colored Folders");
        new Setting(groupItemsContainer)
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.coloredFoldersLegacy)
                .onChange(async (value) => {
                    this.plugin.settings.coloredFoldersLegacy = value;
                    document.body.toggleClass("colored-folders-legacy-enabled", value);
                    this.plugin.injectColoredFoldersStyles();
                    await this.plugin.saveSettings();
                    this.renderColoredFoldersList(containerEl);
                })
            )
            .setName("Legacy Colored Folders")

        this.renderColoredFoldersList(containerEl);
    }

    renderColoredFoldersList(containerEl: HTMLElement) {
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

        const isEmpty = this.collapsedFolders.size === 0;
        for (let index = 0; index < colors.length; index++) {
            const collapseKey = `${isLegacy ? "legacy" : "enhanced"}-${colors[index]!.prefix}`;
            if (isEmpty && !this.collapsedFolders.has(collapseKey)) {
                this.collapsedFolders.add(collapseKey);
            }
            this.renderColoredFoldersSettings(groupItemsContainer, colors, index, isLegacy);
        }

        new Setting(groupItemsContainer)
            .addButton(button => button
                .setButtonText("Add Folder")
                .setIcon("plus")
                .onClick(async () => {
                    colors.push(defaultFolderColorSchema("00", "gray"));
                    await this.saveAndApplySettings();
                    this.renderColoredFoldersList(containerEl);
                })
            );
    }

    renderColoredFoldersSettings(
        container: HTMLElement,
        colors: IFolderColorSetting[],
        index: number,
        isLegacy: boolean
    ) {
        const entry = colors[index]!;
        const collapseKey = `${isLegacy ? "legacy" : "enhanced"}-${entry.prefix}`;
        const isCollapsed = this.collapsedFolders.has(collapseKey);
        const setting = new Setting(container);

        const collapseBtn = setting.nameEl.createEl("button", { cls: "clickable-icon setting-collapse-btn" });
        collapseBtn.setAttribute("aria-label", isCollapsed ? "Expandir" : "Minimizar");
        collapseBtn.innerHTML = isCollapsed
            ? `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>`
            : `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>`;
        collapseBtn.style.cssText = "background: none; border: none; cursor: pointer; padding: 0 4px 0 0; display: inline-flex; align-items: center; opacity: 0.7; vertical-align: middle;";

        setting.nameEl.appendText(`Pasta: ${entry.prefix}`);

        const optionsWrapper = container.createDiv();
        optionsWrapper.style.display = isCollapsed ? "none" : "block";

        collapseBtn.addEventListener("click", () => {
            const nowCollapsed = this.collapsedFolders.has(collapseKey);
            if (nowCollapsed) {
                this.collapsedFolders.delete(collapseKey);
                optionsWrapper.style.display = "block";
                collapseBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>`;
                collapseBtn.setAttribute("aria-label", "Minimizar");
            }
            else {
                this.collapsedFolders.add(collapseKey);
                optionsWrapper.style.display = "none";
                collapseBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>`;
                collapseBtn.setAttribute("aria-label", "Expandir");
            }
            this.plugin.settings.collapsedFolders = Array.from(this.collapsedFolders);
            this.plugin.saveSettings();
        });

        this.renderColoredFolderButtons(setting, colors, entry, index);
        this.renderColoredFoldersOptions(optionsWrapper, colors, entry, index);
    }

    renderColoredFolderButtons(
        setting: Setting,
        colors: IFolderColorSetting[],
        entry: IFolderColorSetting,
        index: number
    ) {
        setting.addExtraButton(btn => {
            btn.setIcon("chevron-up")
                .setTooltip("Move up")
                .setDisabled(index === 0)
                .onClick(async () => {
                    [colors[index - 1], colors[index]] = [colors[index]!, colors[index - 1]!];
                    await this.saveAndApplySettings();
                    this.renderColoredFoldersList(this.containerEl);
                });
        });

        setting.addExtraButton(btn => {
            btn.setIcon("chevron-down")
                .setTooltip("Move down")
                .setDisabled(index === colors.length - 1)
                .onClick(async () => {
                    [colors[index + 1], colors[index]] = [colors[index]!, colors[index + 1]!];
                    await this.saveAndApplySettings();
                    this.renderColoredFoldersList(this.containerEl);
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
                        await this.saveAndApplySettings();
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
                await this.saveAndApplySettings();
                this.renderColoredFoldersList(this.containerEl);
            })
        );
    }

    renderColoredFoldersOptions(
        container: HTMLElement,
        colors: IFolderColorSetting[],
        entry: IFolderColorSetting,
        index: number
    ) {
        const colorOptionsContainer = this.generateSettingsOptionList(container);

        const applyToSubFolderOptionContainer = colorOptionsContainer.createEl("li");
        const applyToSubFolderSetting = new Setting(applyToSubFolderOptionContainer)
        applyToSubFolderSetting
            .addToggle(toggle => toggle
                .setValue(entry.applyToSubFolders)
                .onChange(async (value) => {
                    colors[index]!.applyToSubFolders = value;
                    await this.saveAndApplySettings();
                })
            )
            .setName("Apply To Sub Folders");

        this.renderColoredFoldersOptionItem(
            colorOptionsContainer,
            "textColor",
            colors,
            entry,
            index
        )
        this.renderColoredFoldersOptionItem(
            colorOptionsContainer,
            "activeTextColor",
            colors,
            entry,
            index
        )
        this.renderColoredFoldersOptionItem(
            colorOptionsContainer,
            "highlightTextColor",
            colors,
            entry,
            index
        )

        this.renderColoredFoldersOptionItem(
            colorOptionsContainer,
            "backgroundColor",
            colors,
            entry,
            index
        )
        this.renderColoredFoldersOptionItem(
            colorOptionsContainer,
            "activeBackgroundColor",
            colors,
            entry,
            index
        )
        this.renderColoredFoldersOptionItem(
            colorOptionsContainer,
            "highlightBackgroundColor",
            colors,
            entry,
            index
        )
    }

    renderColoredFoldersOptionItem(
        container: HTMLElement,
        type: FolderColorSettingKey,
        colors: IFolderColorSetting[],
        entry: IFolderColorSetting,
        index: number,
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
                await this.saveAndApplySettings();
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
                    await this.saveAndApplySettings();
                }
            });
        });
    }

    async saveAndApplySettings() {
        this.plugin.injectColoredFoldersStyles();
        await this.plugin.saveSettings();
    }

    applySettings() {
        document.body.toggleClass("colored-folders-legacy-enabled", this.plugin.settings.coloredFoldersLegacy);
        this.plugin.injectColoredFoldersStyles();
    }
}