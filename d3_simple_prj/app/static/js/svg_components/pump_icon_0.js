function createPumpIcon(parentSvg, pumpId, rpm, xPos, yPos) {
    const pumpGroup = d3.select(parentSvg)
        .append("g")
        .attr("class", "pump-group")
        .attr("transform", `translate(${xPos}, ${yPos})`);

    // Круг насоса
    pumpGroup.append("circle")
        .attr("r", 30)
        .attr("fill", "#ddd")
        .attr("stroke", "#333")
        .attr("stroke-width", 2);

    // Создаем отдельную группу для крыльчатки
    const impellerGroup = pumpGroup.append("g")
        .attr("class", "pump-impeller");

    // Рисуем лопасти крыльчатки в отдельной группе
    impellerGroup.append("path")
        .attr("d", "M-20,0 L20,0 M0,-20 L0,20")
        .attr("stroke", "#333")
        .attr("stroke-width", 3);

    // Остальные элементы без изменений
    pumpGroup.append("line")
        .attr("x1", -45)
        .attr("y1", 0)
        .attr("x2", -30)
        .attr("y2", 0)
        .attr("stroke", "#333")
        .attr("stroke-width", 2);

    pumpGroup.append("line")
        .attr("x1", 30)
        .attr("y1", 0)
        .attr("x2", 45)
        .attr("y2", 0)
        .attr("stroke", "#333")
        .attr("stroke-width", 2);

    pumpGroup.append("text")
        .attr("x", 0)
        .attr("y", -40)
        .attr("text-anchor", "middle")
        .attr("font-family", "Verdana")
        .attr("font-size", "14px")
        .text(pumpId);

    pumpGroup.append("text")
        .attr("x", 0)
        .attr("y", 50)
        .attr("text-anchor", "middle")
        .attr("font-family", "Verdana")
        .attr("font-size", "12px")
        .text(rpm + " RPM");
}


function rotatePumpForward() {
    let currentAngle = 0;
    d3.select(".pump-impeller")
        .transition()
        .duration(500)  // замедляем до 2000мс
        .attrTween("transform", function() {
            return function(t) {
                currentAngle = (currentAngle + 5) % 360;
                return `rotate(${currentAngle})`; // center at pump position
            };
        })
        .on("end", rotatePumpForward);
}

function rotatePumpReverse() {
    let currentAngle = 0;
    d3.select(".pump-impeller")
        .transition()
        .duration(500)  // замедляем до 2000мс
        .attrTween("transform", function() {
            return function(t) {
                currentAngle = (currentAngle - 5) % 360;
                return `rotate(${currentAngle})`; // center at pump position
            };
        })
        .on("end", rotatePumpReverse);
}


