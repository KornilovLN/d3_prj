class TankModel {
    constructor() {
        this.parameters = [
            {
                id: 'temp',
                label: 'T',
                unit: '°C',
                limits: { min: 0, max: 400, warning_min: 500, warning_max: 1000 }
            },
            {
                id: 'pressure',
                label: 'P',
                unit: 'kPa',
                limits: { min: 100000, max: 200000, warning_min: 110000, warning_max: 190000 }
            },
            {
                id: 'level',
                label: 'H',
                unit: 'm',
                limits: { min: 5, max: 95, warning_min: 10, warning_max: 90 }
            }
        ];


        this.sevenSegmentPatterns = {
            '0': 'abcdef',
            '1': 'bc',
            '2': 'abged',
            '3': 'abgcd',
            '4': 'fgbc',
            '5': 'afgcd',
            '6': 'afgedc',
            '7': 'abc',
            '8': 'abcdefg',
            '9': 'abfgcd',
            '-': 'g',
            '.': 'h'
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
            .map(([key, path]) =>
                `<path d="${path}"
                 stroke="${pattern.includes(key) ? color : '#333'}"
                 stroke-width="2.4"
                 stroke-linecap="round"/>`)
            .join('');
    }

    createParameterDisplay(x, y, width, parameter, value, isAlarm = false) {
        const labelWidth = 25;
        const unitWidth = 30;
        const valueWidth = 105;
        const displayHeight = 26;
        const displayColor = isAlarm ? '#FF6600' : '#00FF00';
        const labelColor = '#4f0c70';
        
        // Ограничиваем число до 7 знаков включая точку и минус
        const valueStr = value.toFixed(1).slice(0, 8).padStart(8);
        const digitWidth = 12;
        
        return `
            <g class="parameter-group" transform="translate(${x},${y})">
                <text x="0" y="16" fill="${labelColor}" text-anchor="start">${parameter.label}</text>
                <rect x="${labelWidth}" y="0" width="${valueWidth}" height="${displayHeight}" fill="black" rx="3"/>
                <g transform="translate(${labelWidth + 5}, 5)">
                    ${valueStr.split('').map((char, i) =>
                        this.createSevenSegmentDigit(i * digitWidth, 0, char, displayColor)
                    ).join('')}
                </g>
                <text x="${labelWidth + valueWidth + 5}" y="16" fill="${labelColor}" text-anchor="start">${parameter.unit}</text>
            </g>
        `;
    }


    isAlarmValue(parameter, value) {
        const minValue = parseFloat(document.getElementById(`${parameter.id}-min`).value);
        const maxValue = parseFloat(document.getElementById(`${parameter.id}-max`).value);
        return value < minValue || value > maxValue;
    }

    /*
    createLevelMeter(x, y, height, currentLevel, maxLevel, meterWidth = 15) {
        //const meterWidth = 15;
        const fillLevel = currentLevel / maxLevel;
        const percentage = Math.round(fillLevel * 100);
        
        return `
            <g class="level-meter" transform="translate(${x},${y})">
                <!-- Glass tube -->
                <rect x="0" y="0" 
                    width="${meterWidth}" height="${height}"
                    fill="none" stroke="#ccc" stroke-width="2"/>
                
                <!-- Level fill -->
                <rect x="0" y="${height * (1 - fillLevel)}" 
                    width="${meterWidth}" height="${height * fillLevel}"
                    fill="#3498db" opacity="0.7"/>
            </g>
        `;
    }
    */

    createLevelMeter(x, y, height, currentLevel, maxLevel, meterWidth = 15) {
        const fillLevel = currentLevel / maxLevel;
        const percentage = Math.round(fillLevel * 100);
        
        // Отступ для шкалы
        const scaleOffset = 5;
        // Длина больших рисок
        const majorTickLength = 10;
        // Длина малых рисок
        const minorTickLength = 5;
        
        // Создаем основной уровнемер
        const levelMeter = `
            <g class="level-meter" transform="translate(${x},${y})">
                <!-- Glass tube -->
                <rect x="0" y="0"
                    width="${meterWidth}" height="${height}"
                    fill="none" stroke="#ccc" stroke-width="2"/>
                <!-- Level fill -->
                <rect x="0" y="${height * (1 - fillLevel)}"
                    width="${meterWidth}" height="${height * fillLevel}"
                    fill="#3498db" opacity="0.7"/>
            </g>
        `;
        
        // Создаем шкалу
        let scale = `
            <g class="scale" transform="translate(${x + meterWidth + scaleOffset},${y})">
                <!-- Основная вертикальная линия -->
                <line x1="0" y1="0" x2="0" y2="${height}" 
                    stroke="#ccc" stroke-width="2"/>
        `;
        
        // Добавляем большие риски
        for (let i = 0; i <= 5; i++) {
            const yPos = (height * i) / 5;
            scale += `
                <line x1="0" y1="${yPos}" x2="${majorTickLength}" y2="${yPos}" 
                    stroke="#ccc" stroke-width="2"/>
            `;
        }
        
        // Добавляем малые риски
        for (let i = 0; i <= 25; i++) {
            if (i % 5 !== 0) {  // Пропускаем позиции больших рисок
                const yPos = (height * i) / 25;
                scale += `
                    <line x1="0" y1="${yPos}" x2="${minorTickLength}" y2="${yPos}" 
                        stroke="#ccc" stroke-width="2"/>
                `;
            }
        }
        
        scale += `</g>`;
        
        return levelMeter + scale;
    }
    
    

    createTank(diameter, height, capRatio, color1, color2) {
        const capHeight = diameter * capRatio;
        const totalHeight = height + (capHeight * 2);
        const padding = 50;
        
        // Получаем текущие значения параметров
        const parameterValues = this.parameters.map(p => 
            parseFloat(document.getElementById(p.id).value)
        );
        
        const parameterDisplayWidth = diameter * 0.7;
        const parameterStartX = padding + (diameter - parameterDisplayWidth) / 2;
        const parameterStartY = padding + capHeight + 30;
    

        // Задаём отступ для уровнемера (например, 50 пикселей от танка)
        const levelMeterOffset = 5;
    
        // Добавляем уровнемер с новым отступом
        const levelMeter = this.createLevelMeter(
            padding + diameter + levelMeterOffset,  // x position with offset
            padding + capHeight,                    // y position
            height,                                 // meter height
            parseFloat(document.getElementById('level').value),
            parseFloat(document.getElementById('level-max').value),
            10                                      // meter width
        );

        const svg = `
        <svg width="${diameter + padding * 2}" height="${totalHeight + padding * 2}" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="silverGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" style="stop-color:${color1}"/>
                    <stop offset="50%" style="stop-color:${color2}"/>
                    <stop offset="100%" style="stop-color:${color1}"/>
                </linearGradient>
            </defs>
    
            <!-- Верхнее донце -->
            <path d="M ${padding},${padding + capHeight}
                A ${diameter/2},${capHeight} 0 0,1 ${padding + diameter},${padding + capHeight}"
                fill="url(#silverGradient)" stroke="#666" stroke-width="2"/>
                
            <!-- Цилиндр -->
            <rect x="${padding}" y="${padding + capHeight}"
                width="${diameter}" height="${height}"
                fill="url(#silverGradient)" stroke="#666" stroke-width="2"/>
                
            <!-- Нижнее донце -->
            <path d="M ${padding},${padding + capHeight + height}
                A ${diameter/2},${capHeight} 0 0,0 ${padding + diameter},${padding + capHeight + height}"
                fill="url(#silverGradient)" stroke="#666" stroke-width="2"/>
    
            <!-- Параметры -->
            ${this.parameters.map((param, index) => {
                const value = parameterValues[index];
                const alarm = this.isAlarmValue(param, value);
                return this.createParameterDisplay(
                    parameterStartX,
                    parameterStartY + index * 45,
                    parameterDisplayWidth,
                    param,
                    value,
                    alarm
                );
            }).join('')}

            ${levelMeter}
        </svg>`;
    
        return svg;
    }
    
}
