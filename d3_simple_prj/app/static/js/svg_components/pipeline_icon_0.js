function createPipeline(parentSvg, x1, y1, x2, y2, color = "#666", lineWidth = 8) {
    const pipeGroup = d3.select(parentSvg)
        .append("g")
        .attr("class", "pipeline-group");

    // Main pipe line
    pipeGroup.append("line")
        .attr("x1", x1)
        .attr("y1", y1)
        .attr("x2", x2)
        .attr("y2", y2)
        .attr("stroke", color)
        .attr("stroke-width", lineWidth)
        .attr("stroke-linecap", "round");

    // Highlight effect
    pipeGroup.append("line")
        .attr("x1", x1)
        .attr("y1", y1)
        .attr("x2", x2)
        .attr("y2", y2)
        .attr("stroke", "white")
        .attr("stroke-width", lineWidth/3)
        .attr("stroke-linecap", "round")
        .attr("opacity", 0.3);
}


