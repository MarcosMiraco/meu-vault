import { globalStyle } from "@vanilla-extract/css";


const coloredFoldersLegacySelector = "body:is(.colored-folders-legacy-enabled)";
globalStyle(`${coloredFoldersLegacySelector} .nav-folder-title`, {
    backgroundColor: "var(--folder-color)"
})

globalStyle(`${coloredFoldersLegacySelector} .nav-folder-title .collapse-icon`, {
})

globalStyle(`${coloredFoldersLegacySelector} .nav-folder-children`, {
    backgroundColor: "color-mix(in srgb, var(--folder-color), transparent 50%)",
    borderLeft: "2px solid var(--folder-color)",
    marginLeft: "15px",
    paddingLeft: "15px"
})
