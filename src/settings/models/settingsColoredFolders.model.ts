import { Setting } from "obsidian";
import { MyVaultSettingsBase } from "./settingsBase.model";
import { FolderColorSettingKey, IFolderColorSetting } from "../settings.interfaces";
import { defaultFolderColorSchema } from "../settings.utils";
import { ColorPickerModal } from "../ColorPickerModal";
import MeuPlugin from "../../main";


export class SettingsColoredFolders extends MyVaultSettingsBase {
    private containerEl: HTMLElement;

    constructor(plugin: MeuPlugin, containerEl: HTMLElement) {
        super(plugin)
        this.containerEl = containerEl;
    }

    renderMainColoredFoldersSettings(containerEl: HTMLElement) {
        const { groupItemsContainer } = this.generateSettingsGroup(containerEl, "Pastas Coloridas");
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
            .setName("Pastas Coloridas (Legado)")

        this.renderColoredFoldersList(containerEl);
    }

    renderColoredFoldersList(containerEl: HTMLElement) {
        const isLegacy = this.plugin.settings.coloredFoldersLegacy;

        this.folderListContainerEl?.remove();
        const { groupContainer, groupItemsContainer } = this.generateSettingsGroup(
            containerEl,
            isLegacy ? 'Cores Legadas' : 'Cores Aprimoradas'
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
                .setButtonText("Adicionar Pasta")
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
            } else {
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
                .setTooltip("Mover para cima")
                .setDisabled(index === 0)
                .onClick(async () => {
                    [colors[index - 1], colors[index]] = [colors[index]!, colors[index - 1]!];
                    await this.saveAndApplySettings();
                    this.renderColoredFoldersList(this.containerEl);
                });
        });

        setting.addExtraButton(btn => {
            btn.setIcon("chevron-down")
                .setTooltip("Mover para baixo")
                .setDisabled(index === colors.length - 1)
                .onClick(async () => {
                    [colors[index + 1], colors[index]] = [colors[index]!, colors[index + 1]!];
                    await this.saveAndApplySettings();
                    this.renderColoredFoldersList(this.containerEl);
                });
        });

        setting.addExtraButton(btn => btn
            .setIcon("pencil")
            .setTooltip("Editar prefixo da pasta")
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
                    this.renderColoredFoldersList(this.containerEl);
                };

                input.addEventListener("blur", confirm);
                input.addEventListener("keydown", (e) => {
                    if (e.key === "Enter") input.blur();
                    if (e.key === "Escape") {
                        nameEl.empty();
                        nameEl.setText(`Pasta: ${entry.prefix}`);
                        this.renderColoredFoldersList(this.containerEl);
                    }
                });
            })
        );

        setting.addExtraButton(btn => btn
            .setIcon("trash-2")
            .setTooltip("Remover pasta")
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
        const applyToSubFolderSetting = new Setting(applyToSubFolderOptionContainer);
        applyToSubFolderSetting
            .addToggle(toggle => toggle
                .setValue(entry.applyToSubFolders)
                .onChange(async (value) => {
                    colors[index]!.applyToSubFolders = value;
                    await this.saveAndApplySettings();
                })
            )
            .setName("Aplicar a subpastas");

        this.renderColoredFoldersOptionItem(colorOptionsContainer, "textColor", "Cor do texto", colors, entry, index);
        this.renderColoredFoldersOptionItem(colorOptionsContainer, "activeTextColor", "Cor do texto (selecionada)", colors, entry, index);
        this.renderColoredFoldersOptionItem(colorOptionsContainer, "highlightTextColor", "Cor do texto (mouse)", colors, entry, index);
        this.renderColoredFoldersOptionItem(colorOptionsContainer, "backgroundColor", "Cor de fundo", colors, entry, index);
        this.renderColoredFoldersOptionItem(colorOptionsContainer, "activeBackgroundColor", "Cor de fundo (selecionada)", colors, entry, index);
        this.renderColoredFoldersOptionItem(colorOptionsContainer, "highlightBackgroundColor", "Cor de fundo (mouse)", colors, entry, index);
    }

    renderColoredFoldersOptionItem(
        container: HTMLElement,
        type: FolderColorSettingKey,
        label: string,
        colors: IFolderColorSetting[],
        entry: IFolderColorSetting,
        index: number,
    ) {
        if (type === "applyToSubFolders") return;

        const entryTypeValue = entry[type] as string;
        const colorOptionItem = container.createEl("li");
        const colorOptionItemSetting = new Setting(colorOptionItem)
            .setName(label)
            .setDesc(entryTypeValue);

        const colorOptions: Record<string, string> = {
            ...this.processGlobalColors(),
        };

        // Color swatch preview
        const swatchEl = colorOptionItemSetting.controlEl.createDiv();
        swatchEl.style.cssText = `
            width: 18px;
            height: 18px;
            border-radius: 50%;
            background: ${entryTypeValue};
            border: 1px solid var(--background-modifier-border);
            flex-shrink: 0;
            margin-right: 6px;
            display: inline-block;
            vertical-align: middle;
        `;

        const getLabelForValue = (val: string) => {
            const match = Object.entries(colorOptions).find(([, v]) => v === val);
            return match ? match[0] : "Custom";
        };

        colorOptionItemSetting.addButton(button => {
            button
                .setButtonText(getLabelForValue(entryTypeValue))
                .onClick(() => {
                    const modal = new ColorPickerModal(
                        this.plugin.app,
                        colorOptions,
                        colors[index]![type] as string,
                        async (selected) => {
                            colors[index]![type] = selected as any;
                            colorOptionItemSetting.setDesc(selected);
                            swatchEl.style.background = selected;
                            button.setButtonText(getLabelForValue(selected));
                            await this.saveAndApplySettings();
                        }
                    );
                    modal.open();
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
