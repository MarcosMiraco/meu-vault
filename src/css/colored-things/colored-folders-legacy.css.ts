import { globalStyle } from "@vanilla-extract/css";
import { GLOBAL_COLORS } from "../global.css";


const coloredFoldersLegacySelector = "body:is(.colored-folders-legacy-enabled)";
globalStyle(`${coloredFoldersLegacySelector} .nav-folder-title`, {
    vars: {
        "--nav-item-color": GLOBAL_COLORS.default.white
    },
    backgroundColor: "var(--folder-color)"
})
globalStyle(`${coloredFoldersLegacySelector} .nav-folder-title .collapse-icon`, {
    vars: {
        "--nav-collapse-icon-color": GLOBAL_COLORS.default.white
    }
})

globalStyle(`${coloredFoldersLegacySelector} .nav-folder-children`, {
    vars: {
        "--nav-item-color": GLOBAL_COLORS.default.white
    },
    backgroundColor: "color-mix(in srgb, var(--folder-color), transparent 50%)",
    borderLeft: "2px solid var(--folder-color)",
    marginLeft: "15px",
    paddingLeft: "15px"
})
