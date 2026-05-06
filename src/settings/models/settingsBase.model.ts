import MeuPlugin from "../../main";
import { GLOBAL_COLORS } from "../../css";


export abstract class MyVaultSettingsBase {
    protected folderListContainerEl: HTMLElement | undefined = undefined;
    protected collapsedFolders: Set<string> = new Set();
    protected plugin: MeuPlugin;

    constructor(plugin: MeuPlugin) {
        this.plugin = plugin;
        this.collapsedFolders = new Set(plugin.settings.collapsedFolders);
    }

    abstract saveAndApplySettings(): void;

    abstract applySettings(): void;

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

    processGlobalColors() {
        const processedColors: Record<string, string> = {};
        for (const [group, colors] of Object.entries(GLOBAL_COLORS)) {
            for (const [name, value] of Object.entries(colors)) {
                processedColors[`${group}.${name}`] = value;
            }
        }

        return processedColors;
    }

    isPredefined(hex: string): boolean {
        for (const colors of Object.values(GLOBAL_COLORS)) {
            for (const value of Object.values(colors)) {
                if (value === hex) return true;
            }
        }
        return false;
    }
}
