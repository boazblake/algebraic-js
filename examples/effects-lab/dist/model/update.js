export const update = (msg, m) => {
    switch (msg.type) {
        case "SET_VIEW":
            return { model: { ...m, activeView: msg.view } };
        case "SET_THEME":
            document.documentElement.classList.toggle("dark", msg.theme === "dark");
            return { model: { ...m, theme: msg.theme } };
        case "RESIZE":
            return { model: { ...m, width: msg.width, height: msg.height } };
        default:
            return { model: m };
    }
};
