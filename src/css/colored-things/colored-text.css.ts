import { globalStyle } from "@vanilla-extract/css";
import { defaultTheme, themes } from "../themes";


const baseColoredText = "colored-text";
globalStyle(`.${baseColoredText}`, {
    vars: {
        "--colored-text-color": defaultTheme.defaultColor,
        "--colored-text-highlight-color": defaultTheme.highlightColor,
        "--colored-text-gradient-end-color": defaultTheme.gradientEndColor,
        "--colored-text-degre": defaultTheme.degre as string
    },
    color: "var(--colored-text-color)"
})
globalStyle(`.${baseColoredText}.bold`, { fontWeight: "bold" })
globalStyle(`.${baseColoredText}.italic`, { fontStyle: "italic" })
globalStyle(`.${baseColoredText}.underline`, { textDecoration: "underline" })
globalStyle(`.${baseColoredText}.strikethrough`, { textDecoration: "line-through" })
globalStyle(`.${baseColoredText}.strikethrough`, { textDecoration: "line-through" })

globalStyle(`[class*="highlight"].${baseColoredText}`, {
    backgroundColor: "var(--colored-text-highlight-color)"
})

globalStyle(`[class*="grad"].${baseColoredText}`, {
    background: `linear-gradient(var(--colored-text-degre), var(--colored-text-color) 0%, var(--colored-text-gradient-end-color) 100%)`,
    backgroundClip: "text",
    color: "transparent"
})

globalStyle(`[class*="horizontal"].${baseColoredText}`, {
    vars: {
        "--colored-text-degre": "90deg"
    }
})

for (const style of themes) {
    const color = style.defaultColor ?? defaultTheme.defaultColor;
    const highlightColor = style.highlightColor ?? defaultTheme.highlightColor;
    const coloredTextGradientEndColor = style.gradientEndColor ?? defaultTheme.gradientEndColor;

    globalStyle(`.${baseColoredText}.${style.name}`, { 
        vars: {
            "--colored-text-color": color,
            "--colored-text-gradient-end-color": coloredTextGradientEndColor
        }
    })
    globalStyle(`.${baseColoredText}.highlight-${style.name}`, {
        vars: {
            "--colored-text-highlight-color": highlightColor
        }
    })
}