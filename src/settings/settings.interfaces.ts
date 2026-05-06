export interface IFolderColorSetting {
    prefix: string; 
    applyToSubFolders: boolean;

    textColor: string;
    highlightTextColor: string;
    activeTextColor: string;
    
    backgroundColor: string;
    highlightBackgroundColor: string;
    activeBackgroundColor: string;
}

export type FolderColorSettingKey = keyof IFolderColorSetting;

export interface IMeuPluginSettings {
    updateCssClassesOnStatusChange: boolean;

    coloredFoldersLegacy: boolean;
    coloredFoldersEnhancedColors: IFolderColorSetting[];
    coloredFoldersLegacyColors: IFolderColorSetting[];

    collapsedFolders: string[];
}
