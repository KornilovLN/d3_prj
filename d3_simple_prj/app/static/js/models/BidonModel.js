class BidonModel {
    constructor(parentSvg, bidonId, maxVolume, currentVolume, xPos, yPos) {
        this.parentSvg = parentSvg;
        this.bidonId = bidonId;
        this.maxVolume = maxVolume;
        this.currentVolume = currentVolume;
        this.xPos = xPos;
        this.yPos = yPos;
        this.baseHeight = 80;
        this.heightScale = 0.2;
    }

    create() {
        const fillLevel = this.currentVolume / this.maxVolume;
        const tankHeight = this.baseHeight + (this.maxVolume * this.heightScale);

        const bidonGroup = d3.select(this.parentSvg)
            .append("g")
            .attr("class", "bidon-group")
            .attr("transform", `translate(${this.xPos}, ${this.yPos})`);

        this._createMainBody(bidonGroup, tankHeight);
        this._createLevelMeter(bidonGroup, tankHeight, fillLevel);
        this._createArcs(bidonGroup, tankHeight);
        this._createPercentageDisplay(bidonGroup, tankHeight, fillLevel);
        this._createLabels(bidonGroup, tankHeight);

        return bidonGroup;
    }

    _createMainBody(group, tankHeight) {
        group.append("rect")
            .attr("x", -40)
            .attr("y", -tankHeight/2)
            .attr("width", 80)
            .attr("height", tankHeight)
            .attr("fill", "#eef0d0")
            .attr("stroke", "#333")
            .attr("stroke-width", 2);
    }

    _createLevelMeter(group, tankHeight, fillLevel) {
        // Level meter glass tube
        group.append("rect")
            .attr("x", -60)
            .attr("y", -tankHeight/2)
            .attr("width", 15)
            .attr("height", tankHeight)
            .attr("fill", "none")
            .attr("stroke", "#ccc")
            .attr("stroke-width", 2);

        // Level meter liquid
        group.append("rect")
            .attr("x", -60)
            .attr("y", -tankHeight/2 + tankHeight * (1 - fillLevel))
            .attr("width", 15)
            .attr("height", tankHeight * fillLevel)
            .attr("fill", "#3498db")
            .attr("opacity", 0.7);
    }

    _createArcs(group, tankHeight) {
        // Top arc
        group.append("path")
            .attr("d", `M-40,${-tankHeight/2} Q0,${-tankHeight/2 - 10} 40,${-tankHeight/2}`)
            .attr("fill", "none")
            .attr("stroke", "#333")
            .attr("stroke-width", 2);

        // Bottom arc
        group.append("path")
            .attr("d", `M-40,${tankHeight/2} Q0,${tankHeight/2 + 10} 40,${tankHeight/2}`)
            .attr("fill", "none")
            .attr("stroke", "#333")
            .attr("stroke-width", 2);
    }

    _createPercentageDisplay(group, tankHeight, fillLevel) {
        // Background
        group.append("rect")
            .attr("x", -30)
            .attr("y", tankHeight/4)
            .attr("width", 60)
            .attr("height", 30)
            .attr("fill", "#000")
            .attr("rx", 4);

        // Percentage value
        group.append("text")
            .attr("x", -20)
            .attr("y", tankHeight/4 + 22)
            .attr("fill", "#ff0000")
            .attr("font-family", "monospace")
            .attr("font-size", "20px")
            .text(Math.round(fillLevel * 100));

        // Percentage symbol
        group.append("text")
            .attr("x", 10)
            .attr("y", tankHeight/4 + 22)
            .attr("fill", "#ff0000")
            .attr("font-family", "sans-serif")
            .attr("font-size", "16px")
            .text("%");
    }

    _createLabels(group, tankHeight) {
        // ID label
        group.append("text")
            .attr("x", 0)
            .attr("y", -tankHeight/3)
            .attr("text-anchor", "middle")
            .attr("font-family", "Verdana")
            .attr("font-size", "14px")
            .text(this.bidonId);

        // Volume label
        group.append("text")
            .attr("x", 0)
            .attr("y", -tankHeight/3 + 20)
            .attr("text-anchor", "middle")
            .attr("font-family", "Verdana")
            .attr("font-size", "12px")
            .text(this.currentVolume.toFixed(1) + " dm³");
    }
}
