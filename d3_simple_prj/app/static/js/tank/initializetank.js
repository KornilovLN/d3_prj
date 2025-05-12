import { TankModel } from './lib/tankmodel.js';

export function initializeTank() {
    const tank = new TankModel();
    
    function updateTank() {
        const diameter = parseInt(document.getElementById('diameter').value);
        const height = parseInt(document.getElementById('height').value);
        const capRatio = parseFloat(document.getElementById('capRatio').value);
        const color1 = document.getElementById('color1').value;
        const color2 = document.getElementById('color2').value;

        const parameterValues = tank.parameters.map(param => param.getValue());
        const tankSvg = tank.createTank(diameter, height, capRatio, color1, color2, parameterValues);
        document.getElementById('tankContainer').innerHTML = tankSvg;
    }

    // Add event listeners to all inputs
    const inputs = [
        'diameter', 'height', 'capRatio', 'color1', 'color2',
        'temp', 'pressure', 'level',
        'temp-min', 'temp-max',
        'pressure-min', 'pressure-max',
        'level-min', 'level-max'
    ];

    inputs.forEach(id => {
        document.getElementById(id).addEventListener('input', updateTank);
    });

    // Initial render
    updateTank();
}

