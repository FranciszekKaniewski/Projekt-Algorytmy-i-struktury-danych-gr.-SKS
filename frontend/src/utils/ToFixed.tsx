export function ToFixed(n: number): string {
    const parts = n.toString().split('.');
    if (parts.length === 2 && parts[1].length > 2) {
        return n.toFixed(2);
    }
    return n.toString();
}