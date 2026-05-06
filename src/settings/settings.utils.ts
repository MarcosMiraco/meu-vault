import { GLOBAL_COLORS } from "../css";
import { IFolderColorSetting } from "./settings.interfaces";


export function defaultFolderColorSchema(prefix: string, colorName: keyof typeof GLOBAL_COLORS.default): IFolderColorSetting {
    const textColor = GLOBAL_COLORS.default.white;
    const activeTextColor = GLOBAL_COLORS.default.color;
    const highlightTextColor = GLOBAL_COLORS.default.color;

    const backgroundColor = 
        GLOBAL_COLORS.darker[colorName as keyof typeof GLOBAL_COLORS.darker] ??
        GLOBAL_COLORS.default[colorName];
    const activeBackgroundColor = 
        GLOBAL_COLORS.transparent[colorName as keyof typeof GLOBAL_COLORS.transparent] ??
        GLOBAL_COLORS.default[colorName];
    const highlightBackgroundColor = 
        GLOBAL_COLORS.darkest[colorName as keyof typeof GLOBAL_COLORS.darkest] ??
        GLOBAL_COLORS.default[colorName];

    return {
        prefix,
        applyToSubFolders: false,

        textColor,
        highlightTextColor,

        backgroundColor,
        highlightBackgroundColor,

        activeTextColor,
        activeBackgroundColor
    }
}