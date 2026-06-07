import { Modal, App } from "obsidian";

export class ColorPickerModal extends Modal {
    private colorOptions: Record<string, string>;
    private currentValue: string;
    private onSelect: (value: string) => void;

    constructor(
        app: App,
        colorOptions: Record<string, string>,
        currentValue: string,
        onSelect: (value: string) => void
    ) {
        super(app);
        this.colorOptions = colorOptions;
        this.currentValue = currentValue;
        this.onSelect = onSelect;
    }

    onOpen() {
        const { contentEl } = this;
        contentEl.empty();
        contentEl.addClass("color-picker-modal");

        // Search bar
        const searchInput = contentEl.createEl("input", {
            type: "text",
            placeholder: "Pesquisar cor...",
            cls: "color-picker-search-input"
        });
        searchInput.style.cssText = `
            width: 100%;
            padding: 8px 12px;
            border: 1px solid var(--background-modifier-border);
            border-radius: 6px;
            background: var(--background-secondary);
            color: var(--text-normal);
            font-size: 14px;
            outline: none;
            box-sizing: border-box;
            margin-bottom: 10px;
            display: block;
        `;

        // Color list
        const listContainer = contentEl.createDiv({ cls: "color-picker-list" });
        listContainer.style.cssText = `
            max-height: 340px;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            gap: 2px;
        `;

        // Custom color section (inline, hidden by default)
        const customSection = contentEl.createDiv({ cls: "color-picker-custom-section" });
        customSection.style.cssText = `
            display: none;
            flex-direction: column;
            gap: 10px;
            margin-top: 12px;
            padding-top: 12px;
            border-top: 1px solid var(--background-modifier-border);
        `;

        const customLabel = customSection.createDiv();
        customLabel.style.cssText = `font-size: 12px; color: var(--text-muted);`;
        customLabel.setText("Cor personalizada (hex):");

        const customRow = customSection.createDiv();
        customRow.style.cssText = `display: flex; align-items: center; gap: 10px;`;

        const customColorInput = customRow.createEl("input", { type: "color" });
        customColorInput.style.cssText = `
            width: 40px;
            height: 32px;
            border: 1px solid var(--background-modifier-border);
            border-radius: 6px;
            background: none;
            cursor: pointer;
            padding: 2px;
            flex-shrink: 0;
        `;

        const customHexInput = customRow.createEl("input", { type: "text", placeholder: "#ffffff" });
        customHexInput.style.cssText = `
            flex: 1;
            padding: 6px 10px;
            border: 1px solid var(--background-modifier-border);
            border-radius: 6px;
            background: var(--background-secondary);
            color: var(--text-normal);
            font-size: 13px;
            font-family: var(--font-monospace);
            outline: none;
        `;

        const customSwatch = customRow.createDiv();
        customSwatch.style.cssText = `
            width: 28px;
            height: 28px;
            border-radius: 50%;
            border: 1px solid var(--background-modifier-border);
            flex-shrink: 0;
            background: ${this.currentValue};
        `;

        const confirmBtn = customSection.createEl("button");
        confirmBtn.setText("Confirmar");
        confirmBtn.style.cssText = `
            align-self: flex-end;
            padding: 6px 16px;
            background: var(--interactive-accent);
            color: var(--text-on-accent);
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 13px;
        `;

        // Set initial custom values if current is not predefined
        const isCurrentPredefined = Object.values(this.colorOptions).includes(this.currentValue);
        if (!isCurrentPredefined) {
            customColorInput.value = this.currentValue;
            customHexInput.value = this.currentValue;
            customSwatch.style.background = this.currentValue;
        } else {
            customColorInput.value = "#ffffff";
            customHexInput.value = "#ffffff";
            customSwatch.style.background = "#ffffff";
        }

        // Sync color picker → hex input + swatch
        customColorInput.addEventListener("input", () => {
            customHexInput.value = customColorInput.value;
            customSwatch.style.background = customColorInput.value;
        });

        // Sync hex input → color picker + swatch (only valid hex)
        customHexInput.addEventListener("input", () => {
            const val = customHexInput.value.trim();
            const isValid = /^#[0-9a-fA-F]{6}$/.test(val) || /^#[0-9a-fA-F]{3}$/.test(val);
            if (isValid) {
                customColorInput.value = val;
                customSwatch.style.background = val;
            }
        });

        confirmBtn.addEventListener("click", () => {
            const val = customHexInput.value.trim();
            const isValid = /^#[0-9a-fA-F]{6}$/.test(val) || /^#[0-9a-fA-F]{3}$/.test(val);
            if (isValid) {
                this.onSelect(val);
                this.close();
            } else {
                customHexInput.style.borderColor = "var(--color-red)";
            }
        });

        const allOptions: { label: string; value: string }[] = [
            { label: "Custom", value: "custom" },
            ...Object.entries(this.colorOptions).map(([label, value]) => ({ label, value }))
        ];

        let customItemEl: HTMLElement | null = null;

        const renderItems = (filter: string) => {
            listContainer.empty();
            customItemEl = null;

            const filtered = allOptions.filter(opt =>
                opt.label.toLowerCase().includes(filter.toLowerCase())
            );

            for (const opt of filtered) {
                const item = listContainer.createDiv({ cls: "color-picker-item" });
                const isSelected = opt.value === this.currentValue ||
                    (opt.value === "custom" && !isCurrentPredefined);

                if (opt.value === "custom") {
                    customItemEl = item;
                }

                item.style.cssText = `
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    padding: 7px 10px;
                    border-radius: 5px;
                    cursor: pointer;
                    background: ${isSelected ? "var(--interactive-accent)" : "transparent"};
                    color: ${isSelected ? "var(--text-on-accent)" : "var(--text-normal)"};
                    font-size: 13px;
                    font-family: var(--font-monospace);
                    transition: background 0.1s;
                `;

                const swatch = item.createDiv();
                if (opt.value === "custom") {
                    swatch.style.cssText = `
                        width: 16px; height: 16px; border-radius: 50%;
                        background: linear-gradient(135deg, #f00, #0f0, #00f);
                        border: 1px solid rgba(255,255,255,0.15); flex-shrink: 0;
                    `;
                } else {
                    swatch.style.cssText = `
                        width: 16px; height: 16px; border-radius: 50%;
                        background: ${opt.value};
                        border: 1px solid rgba(255,255,255,0.15); flex-shrink: 0;
                    `;
                }

                item.createSpan({ text: opt.label });

                item.addEventListener("mouseenter", () => {
                    if (!isSelected) item.style.background = "var(--background-modifier-hover)";
                });
                item.addEventListener("mouseleave", () => {
                    if (!isSelected) item.style.background = "transparent";
                });

                item.addEventListener("click", () => {
                    if (opt.value === "custom") {
                        // Toggle custom section inline — no external color picker
                        const isVisible = customSection.style.display === "flex";
                        customSection.style.display = isVisible ? "none" : "flex";
                        if (!isVisible) {
                            setTimeout(() => customHexInput.focus(), 50);
                        }
                    } else {
                        this.onSelect(opt.value);
                        this.close();
                    }
                });
            }

            if (filtered.length === 0) {
                const empty = listContainer.createDiv();
                empty.style.cssText = "padding: 16px; text-align: center; color: var(--text-muted); font-size: 13px;";
                empty.setText("Nenhuma cor encontrada");
            }

            // Show custom section if current value is custom
            if (!isCurrentPredefined) {
                customSection.style.display = "flex";
            }
        };

        renderItems("");

        searchInput.addEventListener("input", () => {
            renderItems(searchInput.value);
        });

        setTimeout(() => searchInput.focus(), 50);
    }

    onClose() {
        this.contentEl.empty();
    }
}
