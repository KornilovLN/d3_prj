import { ParameterDisplay } from '../components/parameterdisplay.js';
import { LevelMeter } from '../components/levelmeter.js';

export class TankModel {
    constructor() {
        this.parameterDisplay = new ParameterDisplay();
        this.levelMeter = new LevelMeter();
        this.parameters = [
            {
                id: 'temp',
                label: 'T',
                unit: '°C',
                getValue: () => ({
                    value: parseFloat(document.getElementById('temp').value),
                    min: parseFloat(document.getElementById('temp-min').value),
                    max: parseFloat(document.getElementById('temp-max').value)
                })
            },
            {
                id: 'pressure',
                label: 'P',
                unit: 'kPa',
                getValue: () => ({
                    value: parseFloat(document.getElementById('pressure').value),
                    min: parseFloat(document.getElementById('pressure-min').value),
                    max: parseFloat(document.getElementById('pressure-max').value)
                })
            },
            {
                id: 'level',
                label: 'H',
                unit: 'mm',
                getValue: () => ({
                    value: parseFloat(document.getElementById('level').value),
                    min: parseFloat(document.getElementById('level-min').value),
                    max: parseFloat(document.getElementById('level-max').value)
                })
            }
        ];
    }



    createTank(diameter, height, capRatio, color1, color2) {
        // Основная логика создания танка
        const capHeight = diameter * capRatio;
        const totalHeight = height + (capHeight * 2);
        const padding = 50;

        // Получаем значения параметров
        const parameterValues = this.parameters.map(p =>
            parseFloat(document.getElementById(p.id).value)
        );

        // Создаем SVG разметку
        return this.generateTankSVG(diameter, height, capHeight, totalHeight, padding, 
            parameterValues, color1, color2);
    }

    createGradientDefs(color1, color2) {
        return `
            <defs>
                <linearGradient id="tankGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" style="stop-color:${color1}"/>
                    <stop offset="50%" style="stop-color:${color2}"/>
                    <stop offset="100%" style="stop-color:${color1}"/>
                </linearGradient>
            </defs>
        `;
    }
    
    createTankBody(padding, diameter, height, capHeight) {
        const centerX = padding + diameter / 2;
        return `
            <g class="tank-body">
                <path d="M ${padding},${padding + capHeight} 
                         A ${diameter/2},${capHeight} 0 0 1 ${padding + diameter},${padding + capHeight}
                         V ${padding + capHeight + height}
                         A ${diameter/2},${capHeight} 0 0 1 ${padding},${padding + capHeight + height}
                         Z" 
                      fill="url(#tankGradient)" stroke="#666" stroke-width="2"/>
            </g>
        `;
    }
    
    createDisplays(padding, diameter, capHeight, values) {
        const displays = this.parameters.map((param, index) => {
            const x = padding + (diameter/2) - 75;  // центрируем по горизонтали
            const y = padding + capHeight  + (index * 40);
            const paramData = param.getValue();
            
            // Проверяем выход за пороги
            const isOutOfLimits = paramData.value < paramData.min || paramData.value > paramData.max;
            
            return this.parameterDisplay.createParameterDisplay(
                x, y, 150, 
                {
                    label: param.label,
                    unit: param.unit,
                    value: paramData.value,
                    min: paramData.min,
                    max: paramData.max
                },
                isOutOfLimits
            );
        }).join('');
        
        return `<g class="displays">${displays}</g>`;
    }
    
    
    createMeter(padding, diameter, height, capHeight) {
        const x = padding + diameter + 4;
        const y = padding + capHeight;
        const level = parseFloat(document.getElementById('level').value);
        return this.levelMeter.createLevelMeter(x, y, height, level, 100);
    }
    

    generateTankSVG(diameter, height, capHeight, totalHeight, padding, parameterValues, color1, color2) {
        const paramData = this.parameters.map(p => p.getValue());
        
        return `
            <svg width="${diameter + padding * 2 + 300}" height="${totalHeight + padding * 2}" xmlns="http://www.w3.org/2000/svg">
                ${this.createGradientDefs(color1, color2)}
                ${this.createTankBody(padding, diameter, height, capHeight)}
                ${this.createDisplays(padding, diameter, capHeight, paramData)}
                ${this.createMeter(padding, diameter, height, capHeight)}
            </svg>
        `;
    }
    

    // Остальные вспомогательные методы...
}
