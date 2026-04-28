import { globalStyle } from "@vanilla-extract/css"
import { defaultTheme, themes } from "../themes";


const baseCallout = "window-box";
globalStyle(`.callout[data-callout=${baseCallout}]`, {
    vars: {
        "--callout-color": "0, 0, 0",
        "--window-title-bg-color": defaultTheme.defaultColor,
        "--window-title-text-color": defaultTheme.textPrimaryColor,
        "--window-content-bg-color": defaultTheme.darkestColor,
        "--window-content-text-color": defaultTheme.textSecondaryColor,
        "--window-border-color": defaultTheme.defaultColor,
        "--gradient-end-color": defaultTheme.gradientEndColor,
        "--degre": defaultTheme.degre as string
    },
    margin: 0,
    padding: 0,
    border: `2px solid var(--window-border-color)`,
    borderRadius: "5px",
    color: "var(--window-title-text-color)"
})

globalStyle(`.callout[data-callout=${baseCallout}] :is(.callout-icon)`, {
    display: "none"
})

globalStyle(`.callout[data-callout=${baseCallout}] :is(.callout-title)`, {
    display: "block",
    margin: 0,
    padding: "10px",
    fontSize: "1em",
    backgroundColor: "var(--window-title-bg-color)",
    color: "var(--window-title-text-color)"
})

globalStyle(`.callout[data-callout=${baseCallout}] :is(.callout-content)`, {
    display: "block",
    margin: 0,
    height: "100%",
    padding: "10px",
    backgroundColor: "var(--window-content-bg-color)",
    color: "var(--window-content-text-color)"
})

globalStyle(`.callout[data-callout=${baseCallout}] li::marker`, {
    color: "var(--window-border-color)",
    fontSize: "1.2em",
    fontWeight: "bold"
})

globalStyle(`.callout[data-callout-metadata*="horizontal"][data-callout=${baseCallout}]`, {
    vars: {
        "--degre": "90deg"
    }
})

globalStyle(`.callout[data-callout-metadata*="grad"][data-callout=${baseCallout}]`, {
    background: `
        linear-gradient(transparent, transparent) padding-box,
        linear-gradient(var(--degre), var(--window-border-color) 0%, var(--gradient-end-color) 100%) border-box
    `,
    borderRadius: "5px",
    border: "2px solid transparent"
})

globalStyle(`.callout[data-callout-metadata*="grad"][data-callout=${baseCallout}] :is(.callout-title)`, {
    backgroundImage: `linear-gradient(var(--degre), var(--window-title-bg-color) 0%, var(--gradient-end-color) 100%)`,
    backgroundColor: "transparent"
})

for (const style of themes) {
    const borderColor = style.defaultColor ?? defaultTheme.defaultColor;
    const titleBgColor = style.defaultColor ?? defaultTheme.defaultColor;
    const titleFontColor = style.textPrimaryColor ?? defaultTheme.textPrimaryColor;
    const contentBgColor = style.darkestColor ?? defaultTheme.darkestColor;
    const contentFontColor = style.textSecondaryColor ?? defaultTheme.textSecondaryColor;
    const linkExternalColor = style.linkExternalColor ?? defaultTheme.linkExternalColor as string;
    const linkColor = style.linkInternalColor ?? defaultTheme.linkInternalColor as string;
    const gradientEndColor = style.gradientEndColor ?? defaultTheme.gradientEndColor;

    globalStyle(`.callout[data-callout-metadata*=${style.name}][data-callout=${baseCallout}]`, {
        vars: {
            "--link-external-color": linkExternalColor,
            "--link-color": linkColor,
            "--window-border-color": borderColor,
            "--window-title-bg-color": titleBgColor,
            "--window-title-text-color": titleFontColor,
            "--window-content-bg-color": contentBgColor,
            "--window-content-text-color": contentFontColor,
            "--gradient-end-color": gradientEndColor
        }
    })
}

globalStyle(`.callout[data-callout-metadata*="transparent"][data-callout=${baseCallout}]`, {
    vars: {
        "--window-title-bg-color": "transparent",
        "--window-content-bg-color": "transparent",
    }
})

globalStyle(`.callout[data-callout-metadata*="grad"][data-callout-metadata*="transparent"][data-callout=${baseCallout}]`, {
    backgroundImage: `linear-gradient(var(--degre), var(--window-border-color) 0%, var(--gradient-end-color) 100%)`
})

globalStyle(`.callout[data-callout-metadata*="grad"][data-callout-metadata*="transparent"][data-callout=${baseCallout}] :is(.callout-title)`, {
    backgroundImage: "none"
})
