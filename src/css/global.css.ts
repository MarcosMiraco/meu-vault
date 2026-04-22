import { globalStyle } from "@vanilla-extract/css";

globalStyle("ul, ol, p, h1, h2, h3, h4, h5, h6", {
    margin: 0
});

export const GLOBAL_COLORS = {
    default: {
        black: "#000000",
        white: "#ffffff",
        color: "#cccccc",
        blue: "#0072ec",
        green: "#28a745",
        teal: "#20c997",
        red: "#dc3545",
        yellow: "#ffc107",
        purple: "#6f42c1",
        indigo: "#6610f2",
        cyan: "#17a2b8",
        orange: "#fd7e14",
        pink: "#e83e8c",
        gray: "#6c757d",
        slate: "#475569",
        sepia: "#704214"
    },
    muted: {
        color: "#f8f9fa",
        blue: "#e7f3ff",
        green: "#e6ffed",
        teal: "#e6fffa",
        red: "#fff1f0",
        yellow: "#fff9db",
        purple: "#f3f0ff",
        indigo: "#f0ebff",
        cyan: "#e0f7fa",
        orange: "#fff4e6",
        pink: "#fff0f6",
        gray: "#f1f3f5",
        slate: "#f1f5f9",
        sepia: "#fdfaf6"
    },
    lighter: {
        color: "#e9ecef",
        blue: "#cce5ff",
        green: "#d4edda",
        teal: "#bcffec",
        red: "#f8d7da",
        yellow: "#ffeebb",
        purple: "#d8c3ff",
        indigo: "#c7a6fd",
        cyan: "#b0f5ff",
        orange: "#ffd0b6",
        pink: "#ffa6c9",
        gray: "#dee2e6",
        slate: "#cbd5e1",
        sepia: "#b39c89"
    },
    darker: {
        color: "#999999",
        blue: "#0056b3",
        green: "#1e7e34",
        teal: "#17a07a",
        red: "#bd2130",
        yellow: "#e0a800",
        purple: "#5a32a3",
        indigo: "#520dc2",
        cyan: "#117a8b",
        orange: "#ce5d20",
        pink: "#c2185b",
        gray: "#5a6268",
        slate: "#334155",
        sepia: "#5d3610"
    },
    darkest: {
        color: "#505050",
        blue: "#024d9e",
        green: "#1a5f2a",
        teal: "#13634b",
        red: "#691b23",
        yellow: "#665218",
        purple: "#392164",
        indigo: "#240753",
        cyan: "#0a3f47",
        orange: "#572c08",
        pink: "#5c1636",
        gray: "#3b4044",
        slate: "#1e293b",
        sepia: "#3d240d"
    },
    highlight: {
        color: "#e9ecef",
        blue: "#a5d8ff",
        green: "#b2f2bb",
        teal: "#99f6e4",
        red: "#ffc9c9",
        yellow: "#fff3bf",
        purple: "#d0bfff",
        indigo: "#c4b5fd",
        cyan: "#99e9f2",
        orange: "#ffd8a8",
        pink: "#ffdeeb",
        gray: "#ced4da",
        slate: "#94a3b8",
        sepia: "#d2b48c"
    },
    transparent: {
        color: "#cccccca6",
        blue: "#007bffa6",
        green: "#28a745a6",
        teal: "#20c997a6",
        red: "#dc3545a6",
        yellow: "#ffc107a6",
        purple: "#5f26caa6",
        indigo: "#6200ffa6",
        cyan: "#17a2b8a6",
        orange: "#fd7e14a6",
        pink: "#e83e8ca6",
        gray: "#6c757da6",
        slate: "#475569a6",
        sepia: "#704214a6"
    },
    glass: {
        color: "#cccccc26",
        blue: "#0072ec26",
        green: "#28a74526",
        teal: "#20c99726",
        red: "#dc354526",
        yellow: "#ffc10726",
        purple: "#6f42c126",
        indigo: "#6610f226",
        cyan: "#17a2b826",
        orange: "#fd7e1426",
        pink: "#e83e8c26",
        gray: "#6c757d26",
        slate: "#47556926",
        sepia: "#70421426"
    },
    contrast: {
        color: "#000000",
        blue: "#ffffff",
        green: "#ffffff",
        teal: "#ffffff",
        red: "#ffffff",
        yellow: "#3d240d",
        purple: "#ffffff",
        indigo: "#ffffff",
        cyan: "#ffffff",
        orange: "#ffffff",
        pink: "#ffffff",
        gray: "#ffffff",
        slate: "#ffffff",
        sepia: "#ffffff"
    },
    gradientEnd: {
        color: "#505050",
        blue: "#5500dd",
        green: "#17b485",
        teal: "#0e94a8",
        red: "#b10d59",
        yellow: "#fc7100",
        purple: "#e83e8c",
        indigo: "#6f42c1",
        cyan: "#007BFF",
        orange: "#dd1f32",
        pink: "#5500dd",
        gray: "#343a40",
        slate: "#1e293b",
        sepia: "#43280b"
    }
};

export interface theme {
    name: string;
    degre?: string;
    highlightColor: string;
    mutedColor: string;
    defaultColor: string;
    lighterColor: string;
    darkerColor: string;
    darkestColor: string;
    transparentColor: string;
    glassColor: string;
    contrastColor: string;
    linkExternalColor?: string;
    linkInternalColor?: string;
    gradientEndColor: string;
    textPrimaryColor: string;
    textSecondaryColor: string;
    markerDefaultColor: string;
}