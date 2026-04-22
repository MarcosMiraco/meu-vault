import { globalStyle } from "@vanilla-extract/css";
import { statusThemes } from "./themes";


for (const statusTheme of statusThemes) {
    globalStyle(`.${statusTheme.name}`, {
        vars: {
            "--text-normal": statusTheme.textPrimaryColor,
            "--text-muted": statusTheme.mutedColor,
            "--icon-color": statusTheme.defaultColor,
            "--h1-color": statusTheme.defaultColor,
            "--h2-color": statusTheme.defaultColor,
            "--h3-color": statusTheme.defaultColor,
            "--h4-color": statusTheme.defaultColor,
            "--h5-color": statusTheme.defaultColor,
            "--metadata-label-text-color": statusTheme.defaultColor,
            "--metadata-input-text-color": statusTheme.textPrimaryColor,
            "--tag-color": statusTheme.linkExternalColor as string,
            "--link-external-color": statusTheme.linkExternalColor as string,
            "--link-color": statusTheme.linkExternalColor as string
        },
        backgroundColor: statusTheme.darkestColor,
        color: statusTheme.textPrimaryColor
    })
}