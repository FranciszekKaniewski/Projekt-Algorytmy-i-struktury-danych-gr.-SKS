export function getDataFromOutText(text: string): ArrayBuffer {

    const lines = text.split('\n').filter(e => e.trim());

    const result: number[] = [];

    lines.forEach(line => {
        const trimmed = line.trim();

        if (trimmed[0] === "M") {
            const parts = trimmed.split(" ");
            const numStr = parts[parts.length - 2];
            const num = parseInt(numStr);
            if (!isNaN(num)) {
                result.push(num);
            }
        } else if (trimmed[0] === "Ś") {
            const match = trimmed.match(/Ścieżka (\d+):.*?(\d+).*?punktu (\d+) do (\d+)/);
            if (match) {
                const [, nr, ilosc, from, to] = match.map(Number);
                result.push(nr, from, to, ilosc);
            }
        }
    });

    const buffer = new ArrayBuffer(result.length * 4); // 4 bajty na liczbę
    const view = new DataView(buffer);

    result.forEach((val, i) => {
        view.setInt32(i * 4, val, true); // true = little-endian
    });

    return buffer;
}