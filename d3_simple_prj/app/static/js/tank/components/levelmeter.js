export class LevelMeter {
    createLevelMeter(x, y, height, currentLevel, maxLevel, meterWidth = 15) {
        const fillLevel = currentLevel / maxLevel;
        const scaleOffset = 5;
        const majorTickLength = 10;
        const minorTickLength = 5;

        // Создаем основной уровнемер
        const meter = `
            <g class="level-meter" transform="translate(${x},${y})">
                <rect x="0" y="0" width="${meterWidth}" height="${height}"
                    fill="none" stroke="#ccc" stroke-width="2"/>
                <rect x="0" y="${height * (1 - fillLevel)}"
                    width="${meterWidth}" height="${height * fillLevel}"
                    fill="#3498db" opacity="0.7"/>
            </g>
        `;

        // Создаем шкалу
        const scale = this.createScale(x, y, height, meterWidth, scaleOffset, majorTickLength, minorTickLength);
        
        return meter + scale;
    }

    createScale(x, y, height, meterWidth, scaleOffset, majorTickLength, minorTickLength) {
        let scale = `
            <g class="scale" transform="translate(${x + meterWidth + scaleOffset},${y})">
                <line x1="0" y1="0" x2="0" y2="${height}"
                    stroke="#ccc" stroke-width="2"/>
        `;

        // Большие риски
        for (let i = 0; i <= 5; i++) {
            const yPos = (height * i) / 5;
            scale += `<line x1="0" y1="${yPos}" x2="${majorTickLength}" y2="${yPos}"
                stroke="#ccc" stroke-width="2"/>`;
        }

        // Малые риски
        for (let i = 0; i <= 25; i++) {
            if (i % 5 !== 0) {
                const yPos = (height * i) / 25;
                scale += `<line x1="0" y1="${yPos}" x2="${minorTickLength}" y2="${yPos}"
                    stroke="#ccc" stroke-width="2"/>`;
            }
        }

        return scale + '</g>';
    }
}
