import { globalStyle } from "@vanilla-extract/css";


const coloredFoldersLegacySelector = "body:not(.colored-folders-legacy-enabled)";
globalStyle(`${coloredFoldersLegacySelector} .nav-folder`, {
    vars: {
        "--nav-item-margin-bottom": "0px",
        "--nav-indentation-guide-width": "0px"
    },
    backgroundColor: "var(--folder-color)",
    borderRadius: "5px",
    marginBottom: "5px" 
})
