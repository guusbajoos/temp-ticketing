export const generateCardActive = (classNameSelectedCard, color, isClickable) => {
    let commonStyles = {
        padding: "14px 30px",
        boxShadow: "6px 6px 10px rgba(0, 0, 0, 0.03)",
        borderRadius: "5px",
        position: "relative",
        margin: "0px",
        width: "100%",
        height: "100%",
        backgroundColor: "#fff",
        display: "flex",
        flexDirection: "column"
    }

    switch (classNameSelectedCard) {
        case "csat-report-good":
            commonStyles.border = `1px ${color} solid`
            break
        case "csat-report-response":
            commonStyles.border = `1px ${color} solid`
            break
        case "csat-report-bad":
            commonStyles.border = `1px ${color} solid`
            break
        default:
            break
    }

    return commonStyles
}
