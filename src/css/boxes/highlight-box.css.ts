import { globalStyle } from "@vanilla-extract/css";
import { defaultTheme, themes } from "./themes";


const baseCallout = "highlight-box";
globalStyle(`.callout[data-callout=${baseCallout}]`, {
    vars: {
        "--callout-color": "0, 0, 0",
        "--highlight-bg-color": defaultTheme.defaultColor,
        "--border-color": defaultTheme.defaultColor,
        "--highlight-text-color": defaultTheme.textPrimaryColor,
        "--gradient-end-color": defaultTheme.gradientEndColor,
        "--highlight-marker-color": defaultTheme.darkestColor,
        "--degre": defaultTheme.degre as string
    },
    padding: "10px",
    borderRadius: "5px",
    backgroundColor: "var(--highlight-bg-color)",
    color: "var(--highlight-text-color)"
})

globalStyle(`.callout[data-callout=${baseCallout}] li::marker`, {
    color: "var(--highlight-marker-color)",
    fontWeight: "bold"
})

globalStyle(`.callout[data-callout=${baseCallout}] > :is(.callout-title, .callout-icon)`, {
    display: "none"
})

globalStyle(`.callout[data-callout-metadata*="transparent"][data-callout=${baseCallout}]`, {
    vars: {
        "--highlight-bg-color": "transparent"
    },
    border: "2px solid var(--border-color)"
})

for (const style of themes) {
    const linkExternalColor = style.linkExternalColor ?? defaultTheme.linkExternalColor as string;
    const linkColor = style.linkInternalColor ?? defaultTheme.linkInternalColor as string;
    const backgroundColor = style.defaultColor ?? defaultTheme.defaultColor;
    const borderColor = style.defaultColor ?? defaultTheme.defaultColor;
    const textColor = style.textPrimaryColor ?? defaultTheme.textPrimaryColor
    const markerColor = style.darkestColor ?? defaultTheme.darkestColor;
    const gradientEndColor = style.gradientEndColor ?? defaultTheme.gradientEndColor;

    globalStyle(`.callout[data-callout-metadata*=${style.name}][data-callout=${baseCallout}]`, {
        vars: {
            "--link-external-color": linkExternalColor,
            "--link-color": linkColor,
            "--highlight-bg-color": backgroundColor,
            "--border-color": borderColor,
            "--highlight-text-color": textColor,
            "--highlight-marker-color": markerColor,
            "--gradient-end-color": gradientEndColor
        }
    })

    globalStyle(`.callout[data-callout-metadata*=${style.name}][data-callout-metadata*="grad"][data-callout=${baseCallout}]`, {
        backgroundImage: `linear-gradient(var(--degre), var(--highlight-bg-color) 0%, var(--gradient-end-color) 100%)`,
        backgroundColor: "transparent",
    })

    globalStyle(`.callout[data-callout-metadata*=${style.name}][data-callout-metadata*="grad"][data-callout-metadata*="horizontal"][data-callout=${baseCallout}]`, {
        vars: {
            "--degre": "90deg"
        }
    })

    globalStyle(`.callout[data-callout-metadata*=${style.name}][data-callout-metadata*="transparent"][data-callout=${baseCallout}]`, {
        vars: {
            "--highlight-bg-color": "transparent"
        },
        border: "2px solid var(--border-color)"
    })
}