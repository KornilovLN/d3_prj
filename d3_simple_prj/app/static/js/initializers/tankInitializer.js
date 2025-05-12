function initializeTank() {
    const tank = new TankModel();
    
    function updateTank() {
        const diameter = parseInt(document.getElementById('diameter').value);
        const height = parseInt(document.getElementById('height').value);
        const capRatio = parseFloat(document.getElementById('capRatio').value);
        const color1 = document.getElementById('color1').value;
        const color2 = document.getElementById('color2').value;
        
        const tankSvg = tank.createTank(diameter, height, capRatio, color1, color2);
        document.getElementById('tankContainer').innerHTML = tankSvg;
    }

    // Добавляем слушатели событий
    document.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', updateTank);
    });

    // Первичная отрисовка
    updateTank();
}
