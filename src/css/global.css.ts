import { globalStyle } from "@vanilla-extract/css";

globalStyle("ul, ol, p, h1, h2, h3, h4, h5, h6", {
    margin: 0
});

export const GLOBAL_COLORS = {
    default: {
        black: "#000000",
        blue: "#0072ec",
        color: "#cccccc",
        cyan: "#17a2b8",
        gray: "#6c757d",
        green: "#28a745",
        indigo: "#6610f2",
        orange: "#fd7e14",
        pink: "#e83e8c",
        purple: "#6f42c1",
        red: "#dc3545",
        sepia: "#704214",
        slate: "#475569",
        teal: "#20c997",
        white: "#ffffff",
        yellow: "#ffc107",
    },
    muted: {
        blue: "#e7f3ff",
        color: "#f8f9fa",
        cyan: "#e0f7fa",
        gray: "#f1f3f5",
        green: "#e6ffed",
        indigo: "#f0ebff",
        orange: "#fff4e6",
        pink: "#fff0f6",
        purple: "#f3f0ff",
        red: "#fff1f0",
        sepia: "#fdfaf6",
        slate: "#f1f5f9",
        teal: "#e6fffa",
        yellow: "#fff9db",
    },
    lighter: {
        blue: "#cce5ff",
        color: "#e9ecef",
        cyan: "#b0f5ff",
        gray: "#dee2e6",
        green: "#d4edda",
        indigo: "#c7a6fd",
        orange: "#ffd0b6",
        pink: "#ffa6c9",
        purple: "#d8c3ff",
        red: "#f8d7da",
        sepia: "#b39c89",
        slate: "#cbd5e1",
        teal: "#bcffec",
        yellow: "#ffeebb",
    },
    darker: {
        blue: "#0056b3",
        color: "#999999",
        cyan: "#117a8b",
        gray: "#5a6268",
        green: "#1e7e34",
        indigo: "#520dc2",
        orange: "#ce5d20",
        pink: "#c2185b",
        purple: "#5a32a3",
        red: "#bd2130",
        sepia: "#5d3610",
        slate: "#334155",
        teal: "#17a07a",
        yellow: "#e0a800",
    },
    darkest: {
        blue: "#024d9e",
        color: "#505050",
        cyan: "#0a3f47",
        gray: "#3b4044",
        green: "#1a5f2a",
        indigo: "#240753",
        orange: "#572c08",
        pink: "#5c1636",
        purple: "#392164",
        red: "#691b23",
        sepia: "#3d240d",
        slate: "#1e293b",
        teal: "#13634b",
        yellow: "#665218",
    },
    highlight: {
        blue: "#a5d8ff",
        color: "#e9ecef",
        cyan: "#99e9f2",
        gray: "#ced4da",
        green: "#b2f2bb",
        indigo: "#c4b5fd",
        orange: "#ffd8a8",
        pink: "#ffdeeb",
        purple: "#d0bfff",
        red: "#ffc9c9",
        sepia: "#d2b48c",
        slate: "#94a3b8",
        teal: "#99f6e4",
        yellow: "#fff3bf",
    },
    transparent: {
        blue: "#007bffa6",
        color: "#cccccca6",
        cyan: "#17a2b8a6",
        gray: "#6c757da6",
        green: "#28a745a6",
        indigo: "#6200ffa6",
        orange: "#fd7e14a6",
        pink: "#e83e8ca6",
        purple: "#5f26caa6",
        red: "#dc3545a6",
        sepia: "#704214a6",
        slate: "#475569a6",
        teal: "#20c997a6",
        yellow: "#ffc107a6",
    },
    glass: {
        blue: "#0072ec26",
        color: "#cccccc26",
        cyan: "#17a2b826",
        gray: "#6c757d26",
        green: "#28a74526",
        indigo: "#6610f226",
        orange: "#fd7e1426",
        pink: "#e83e8c26",
        purple: "#6f42c126",
        red: "#dc354526",
        sepia: "#70421426",
        slate: "#47556926",
        teal: "#20c99726",
        yellow: "#ffc10726",
    },
    contrast: {
        blue: "#ffffff",
        color: "#000000",
        cyan: "#ffffff",
        gray: "#ffffff",
        green: "#ffffff",
        indigo: "#ffffff",
        orange: "#ffffff",
        pink: "#ffffff",
        purple: "#ffffff",
        red: "#ffffff",
        sepia: "#ffffff",
        slate: "#ffffff",
        teal: "#ffffff",
        yellow: "#3d240d",
    },
    gradientEnd: {
        blue: "#5500dd",
        color: "#505050",
        cyan: "#007BFF",
        gray: "#343a40",
        green: "#17b485",
        indigo: "#6f42c1",
        orange: "#dd1f32",
        pink: "#5500dd",
        purple: "#e83e8c",
        red: "#b10d59",
        sepia: "#43280b",
        slate: "#1e293b",
        teal: "#0e94a8",
        yellow: "#fc7100",
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