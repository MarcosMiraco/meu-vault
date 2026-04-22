import { globalStyle } from "@vanilla-extract/css";
import { GLOBAL_COLORS } from "./global.css";


const baseCallout = "grid-box";
globalStyle(`.callout[data-callout=${baseCallout}]`, {
    backgroundColor: "transparent",
    margin: 0,
    padding: 0
})

globalStyle(`.callout[data-callout=${baseCallout}] :is(ul, ol)`, {
    display: "grid",
    gap: "10px",
    listStyle: "none",
    gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))"
})

globalStyle(`.callout[data-callout=${baseCallout}] > :is(.callout-content)`, {
    display: "grid",
    gap: "10px",
    listStyle: "none",
    gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))"
})

globalStyle(`.callout[data-callout=${baseCallout}] ::before`, {
    border: `1px solid ${GLOBAL_COLORS.default.white}`
})

globalStyle(`.callout[data-callout=${baseCallout}] > :is(.callout-title, .callout-icon)`, {
    display: "none"
})