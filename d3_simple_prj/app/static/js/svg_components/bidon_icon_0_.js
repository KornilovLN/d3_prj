function createBidonIcon(parentSvg, config) {
    const {
        bidonId,
        maxVolume,
        currentVolume,
        xPos,
        yPos
    } = config;

    const fillLevel = currentVolume / maxVolume;
    const tankHeight = BIDON_CONFIG.baseHeight + (maxVolume * BIDON_CONFIG.heightScale);

    const bidonGroup = d3.select(parentSvg)
        .append("g")
        .attr("class", "bidon-group")
        .attr("transform", `translate(${xPos}, ${yPos})`);

    // Main tank body
    bidonGroup.append("rect")
        .attr("x", -BIDON_CONFIG.dimensions.width/2)
        .attr("y", -tankHeight/2)
        .attr("width", BIDON_CONFIG.dimensions.width)
        .attr("height", tankHeight)
        .attr("fill", BIDON_CONFIG.colors.tank)
        .attr("stroke", BIDON_CONFIG.colors.stroke)
        .attr("stroke-width", 2);

    // Level meter fill
    bidonGroup.append("rect")
        .attr("x", -60)
        .attr("y", -tankHeight/2 + tankHeight * (1 - fillLevel))
        .attr("width", BIDON_CONFIG.dimensions.levelMeterWidth)
        .attr("height", tankHeight * fillLevel)
        .attr("fill", BIDON_CONFIG.colors.liquid)
        .attr("opacity", 0.7);

    // Top arc
    bidonGroup.append("path")
        .attr("d", `M-40,${-tankHeight/2} Q0,${-tankHeight/2 - 10} 40,${-tankHeight/2}`)
        .attr("fill", "none")
        .attr("stroke", BIDON_CONFIG.colors.stroke)
        .attr("stroke-width", 2);

    // Bottom arc
    bidonGroup.append("path")
        .attr("d", `M-40,${tankHeight/2} Q0,${tankHeight/2 + 10} 40,${tankHeight/2}`)
        .attr("fill", "none")
        .attr("stroke", BIDON_CONFIG.colors.stroke)
        .attr("stroke-width", 2);

    // Level meter glass tube
    bidonGroup.append("rect")
        .attr("x", -60)
        .attr("y", -tankHeight/2)
        .attr("width", BIDON_CONFIG.dimensions.levelMeterWidth)
        .attr("height", tankHeight)
        .attr("fill", "none")
        .attr("stroke", "#ccc")
        .attr("stroke-width", 2);

    // Level meter liquid
    bidonGroup.append("rect")
        .attr("x", -60)
        .attr("y", -tankHeight/2 + tankHeight * (1 - fillLevel))
        .attr("width", BIDON_CONFIG.dimensions.levelMeterWidth)
        .attr("height", tankHeight * fillLevel)
        .attr("fill", BIDON_CONFIG.colors.liquid)
        .attr("opacity", 0.7);

    // Percentage display background
    bidonGroup.append("rect")
        .attr("x", -30)
        .attr("y", tankHeight/4)
        .attr("width", 60)
        .attr("height", 30)
        .attr("fill", "#000")
        .attr("rx", 4);

    // Percentage value
    bidonGroup.append("text")
        .attr("x", -20)
        .attr("y", tankHeight/4 + 22)
        .attr("fill", BIDON_CONFIG.colors.percentage)
        .attr("font-family", BIDON_CONFIG.fonts.percentage.family)
        .attr("font-size", BIDON_CONFIG.fonts.percentage.size)
        .text(Math.round(fillLevel * 100));

    // Percentage symbol
    bidonGroup.append("text")
        .attr("x", 10)
        .attr("y", tankHeight/4 + 22)
        .attr("fill", BIDON_CONFIG.colors.percentage)
        .attr("font-family", BIDON_CONFIG.fonts.labels.family)
        .attr("font-size", "16px")
        .text("%");

    // Equipment ID label
    bidonGroup.append("text")
        .attr("x", 0)
        .attr("y", -tankHeight/3)
        .attr("text-anchor", "middle")
        .attr("font-family", BIDON_CONFIG.fonts.labels.family)
        .attr("font-size", BIDON_CONFIG.fonts.labels.size)
        .text(bidonId);

    // Volume label
    bidonGroup.append("text")
        .attr("x", 0)
        .attr("y", -tankHeight/3 + 20)
        .attr("text-anchor", "middle")
        .attr("font-family", BIDON_CONFIG.fonts.labels.family)
        .attr("font-size", BIDON_CONFIG.fonts.labels.size)
        .text(currentVolume.toFixed(1) + " dm³");
}

function startPumping() {
    rotatePumpForward();

    const settings = ANIMATION_CONFIG;
    const startTime = Date.now();

    function updateAnimation() {
        const elapsedTime = Date.now() - startTime;
        const progress = Math.min(elapsedTime / settings.duration, 1);
        
        const volumes = {
            main: settings.bidons.bidon1.maxVolume * (1 - progress),
            bidon2: settings.bidons.bidon2.maxVolume * progress,
            bidon3: settings.bidons.bidon3.maxVolume * progress
        };

        d3.select(mainSvg).selectAll(".bidon-group").remove();

        // Update bidons with new volumes
        Object.entries(settings.bidons).forEach(([key, bidon]) => {
            createBidonIcon(mainSvg, {
                bidonId: bidon.id,
                maxVolume: bidon.maxVolume,
                currentVolume: volumes[key === 'bidon1' ? 'main' : key],
                xPos: bidon.position.x,
                yPos: bidon.position.y
            });
        });

        if (progress < 1) {
            requestAnimationFrame(updateAnimation);
        }
    }
    updateAnimation();
}

function startReverseAnimation() {
    rotatePumpReverse();

    const settings = ANIMATION_CONFIG;
    const startTime = Date.now();

    function updateAnimation() {
        const elapsedTime = Date.now() - startTime;
        const progress = Math.min(elapsedTime / settings.duration, 1);

        const volumes = {
            main: settings.bidons.bidon1.maxVolume * progress,
            bidon2: settings.bidons.bidon2.maxVolume * (1 - progress),
            bidon3: settings.bidons.bidon3.maxVolume * (1 - progress)
        };

        d3.select(mainSvg).selectAll(".bidon-group").remove();

        Object.entries(settings.bidons).forEach(([key, bidon]) => {
            createBidonIcon(mainSvg, {
                bidonId: bidon.id,
                maxVolume: bidon.maxVolume,
                currentVolume: volumes[key === 'bidon1' ? 'main' : key],
                xPos: bidon.position.x,
                yPos: bidon.position.y
            });
        });

        if (progress < 1) {
            requestAnimationFrame(updateAnimation);
        } else if (currentCycle === cycles - 1) {
            d3.select(".pump-impeller").interrupt();
        }
    }
    updateAnimation();
}
