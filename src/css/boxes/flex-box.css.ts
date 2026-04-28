import { globalStyle } from "@vanilla-extract/css";


const baseCallout = "flex-box";
globalStyle(`.callout[data-callout=${baseCallout}]`, {
    backgroundColor: "transparent",
    display: "flex",
    justifyContent: "center",
    margin: 0,
    padding: 0
})

globalStyle(`.callout[data-callout=${baseCallout}] > :is(.callout-content)`, {
    margin: 0,
    padding: 0,

    display: "flex",
    gap: "20px",
})

globalStyle(`.callout[data-callout=${baseCallout}] > :is(.callout-title, .callout-icon)`, {
    display: "none"
})