export const Translate = (text: string) => {
    switch (text.toUpperCase()) {
        case "FIELD":
            return "Pole"
        case "CROSS":
            return "Skrzyrzowanie"
        case "INN":
            return "Karczma"
        case "BREWERY":
            return "Browar"
        case "EDGE":
            return "Droga"
    }

    return text
}