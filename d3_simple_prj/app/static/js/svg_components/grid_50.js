function createGrid(parentSvg, width, height, gridSize = 50) {
    const gridGroup = d3.select(parentSvg)
        .append("g")
        .attr("class", "grid-group")
        .attr("transform", "translate(0,0)");

    // Vertical lines
    for (let x = 0; x <= width; x += gridSize) {
        gridGroup.append("line")
            .attr("x1", x)
            .attr("y1", 0)
            .attr("x2", x)
            .attr("y2", height)
            .attr("stroke", "#ddd")
            .attr("stroke-width", 1.0);
    }

    // Horizontal lines
    for (let y = 0; y <= height; y += gridSize) {
        gridGroup.append("line")
            .attr("x1", 0)
            .attr("y1", y)
            .attr("x2", width)
            .attr("y2", y)
            .attr("stroke", "#ddd")
            .attr("stroke-width", 1.0);
    }
}
