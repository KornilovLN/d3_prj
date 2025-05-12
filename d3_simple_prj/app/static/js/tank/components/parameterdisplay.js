import { BaseDisplay } from './basedisplay.js';

export class ParameterDisplay extends BaseDisplay {
    createParameterDisplay(x, y, width, parameter, isAlarm) {
        const displayColor = isAlarm ? '#FF6600' : '#00FF00';
        const labelColor = '#4f0c70';
        const valueStr = parameter.value.toFixed(1).slice(0, 8).padStart(8);
        const digitWidth = 12;
    
        return `
            <g class="parameter-group" transform="translate(${x},${y})">
                <text x="0" y="16" fill="${labelColor}" text-anchor="start">${parameter.label}</text>
                <rect x="25" y="0" width="105" height="26" fill="black" rx="3"/>
                <g transform="translate(30, 5)">
                    ${valueStr.split('').map((char, i) =>
                        this.createSevenSegmentDigit(i * digitWidth, 0, char, displayColor)
                    ).join('')}
                </g>
                <text x="135" y="16" fill="${labelColor}" text-anchor="start">${parameter.unit}</text>
            </g>
        `;
    }
    
    
}
