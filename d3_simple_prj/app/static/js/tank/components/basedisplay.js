export class BaseDisplay {
    constructor() {
        // Паттерны для семисегментного дисплея
        this.sevenSegmentPatterns = {
            '0': 'abcdef', '1': 'bc', '2': 'abged',
            '3': 'abgcd', '4': 'fgbc', '5': 'afgcd',
            '6': 'afgedc', '7': 'abc', '8': 'abcdefg',
            '9': 'abfgcd', '-': 'g', '.': 'h'
        };
    }

    createSevenSegmentDigit(x, y, char, color) {
        const segments = {
            a: `M ${x},${y} l 8,0`,
            b: `M ${x+8},${y} l 0,8`,
            c: `M ${x+8},${y+8} l 0,8`,
            d: `M ${x},${y+16} l 8,0`,
            e: `M ${x},${y+8} l 0,8`,
            f: `M ${x},${y} l 0,8`,
            g: `M ${x},${y+8} l 8,0`,
            h: `M ${x+9},${y+15} l 2,2`
        };

        const pattern = this.sevenSegmentPatterns[char] || '';
        return Object.entries(segments)
            .map(([key, path]) => `<path d="${path}" 
                stroke="${pattern.includes(key) ? color : '#333'}"
                stroke-width="2.4" 
                stroke-linecap="round"/>`)
            .join('');
    }
}
