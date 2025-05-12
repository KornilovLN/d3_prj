function createBidonIcon(parentSvg, bidonId, maxVolume, currentVolume, xPos, yPos) {
    // Calculate fill percentage based on current and max volume
    const fillLevel = currentVolume / maxVolume;
    
    // Original height calculation
    const baseHeight = 80;
    const heightScale = 0.2;
    const tankHeight = baseHeight + (maxVolume * heightScale);

    const bidonGroup = d3.select(parentSvg)
        .append("g")
        .attr("class", "bidon-group")
        .attr("transform", `translate(${xPos}, ${yPos})`);
    
    // Main tank body
    bidonGroup.append("rect")
        .attr("x", -40)
        .attr("y", -tankHeight/2)
        .attr("width", 80)
        .attr("height", tankHeight)
        .attr("fill", "#eef0d0")
        .attr("stroke", "#333")
        .attr("stroke-width", 2);

    // Update level meter fill
    bidonGroup.append("rect")
        .attr("x", -60)
        .attr("y", -tankHeight/2 + tankHeight * (1 - fillLevel))
        .attr("width", 15)
        .attr("height", tankHeight * fillLevel)
        .attr("fill", "#3498db")
        .attr("opacity", 0.7);

    // Update percentage display
    const percentage = Math.round(fillLevel * 100);
    
    // Top arc
    bidonGroup.append("path")
        .attr("d", `M-40,${-tankHeight/2} Q0,${-tankHeight/2 - 10} 40,${-tankHeight/2}`)
        .attr("fill", "none")
        .attr("stroke", "#333")
        .attr("stroke-width", 2);

    // Bottom arc
    bidonGroup.append("path")
        .attr("d", `M-40,${tankHeight/2} Q0,${tankHeight/2 + 10} 40,${tankHeight/2}`)
        .attr("fill", "none")
        .attr("stroke", "#333")
        .attr("stroke-width", 2);

    // Level meter glass tube
    bidonGroup.append("rect")
        .attr("x", -60)
        .attr("y", -tankHeight/2)
        .attr("width", 15)
        .attr("height", tankHeight)
        .attr("fill", "none")
        .attr("stroke", "#ccc")
        .attr("stroke-width", 2);

    // Level meter liquid
    bidonGroup.append("rect")
        .attr("x", -60)
        .attr("y", -tankHeight/2 + tankHeight * (1 - fillLevel))
        .attr("width", 15)
        .attr("height", tankHeight * fillLevel)
        .attr("fill", "#3498db")
        .attr("opacity", 0.7);

    // Percentage display background
    bidonGroup.append("rect")
        .attr("x", -30)
        .attr("y", tankHeight/4)
        .attr("width", 60)
        .attr("height", 30)
        .attr("fill", "#000")
        .attr("rx", 4);

    // Percentage value - adjusted position
    bidonGroup.append("text")
        .attr("x", -20)
        .attr("y", tankHeight/4 + 22)
        .attr("fill", "#ff0000")
        .attr("font-family", "monospace")
        .attr("font-size", "20px")
        .text(Math.round(fillLevel * 100));

    // Percentage symbol - adjusted position
    bidonGroup.append("text")
        .attr("x", 10)
        .attr("y", tankHeight/4 + 22)
        .attr("fill", "#ff0000")
        .attr("font-family", "sans-serif")
        .attr("font-size", "16px")
        .text("%");

    // Equipment ID label - now on tank surface
    bidonGroup.append("text")
        .attr("x", 0)
        .attr("y", -tankHeight/3)
        .attr("text-anchor", "middle")
        .attr("font-family", "Verdana")
        .attr("font-size", "14px")
        .text(bidonId);

    // Volume label - now below ID on tank surface
    bidonGroup.append("text")
        .attr("x", 0)
        .attr("y", -tankHeight/3 + 20)
        .attr("text-anchor", "middle")
        .attr("font-family", "Verdana")
        .attr("font-size", "12px")
        .text(currentVolume.toFixed(1) + " dm³");

}


// Function to update volumes during pumping
function updateBidonVolumes(mainBidonVolume, totalTime, elapsedTime) {
    const initialMainVolume = 900;
    const targetBidon2Volume = 500;
    const targetBidon3Volume = 400;
    
    // Calculate volumes for secondary bidons based on non-linear distribution
    const bidon2Volume = (targetBidon2Volume * elapsedTime) / totalTime;
    const bidon3Volume = (targetBidon3Volume * elapsedTime) / totalTime;
    
    return {
        main: mainBidonVolume,
        bidon2: bidon2Volume,
        bidon3: bidon3Volume
    };
}


// Animation function for pumping
function startPumping() {
    rotatePumpForward();  // добавляем в начало

    const duration = 10000; // 10 seconds for complete transfer
    const startTime = Date.now();
    
    function updateAnimation() {
        const elapsedTime = Date.now() - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
        
        const mainVolume = 900 * (1 - progress);
        const volumes = updateBidonVolumes(mainVolume, duration, elapsedTime);
        
        // Clear previous bidons
        d3.select(mainSvg).selectAll(".bidon-group").remove();

        // Update bidons with new volumes
        createBidonIcon(mainSvg, "Bidon-1", 900, volumes.main, 200, 300);
        createBidonIcon(mainSvg, "Bidon-2", 500, volumes.bidon2, 1000, 300);
        createBidonIcon(mainSvg, "Bidon-3", 400, volumes.bidon3, 1300, 300);
        
        if (progress < 1) {
            requestAnimationFrame(updateAnimation);
        }
    }
    
    updateAnimation();
}

function startReverseAnimation() {
    rotatePumpReverse();  // добавляем в начало

    const duration = 10000; // 10 seconds for complete transfer
    const startTime = Date.now();
    
    function updateAnimation() {
        const elapsedTime = Date.now() - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
        
        // Обратный расчет объемов
        const mainVolume = 900 * progress;
        const bidon2Volume = 500 * (1 - progress);
        const bidon3Volume = 400 * (1 - progress);
        
        // Clear previous bidons
        d3.select(mainSvg).selectAll(".bidon-group").remove();
        
        // Update bidons with new volumes
        createBidonIcon(mainSvg, "Bidon-1", 900, mainVolume, 200, 300);
        createBidonIcon(mainSvg, "Bidon-2", 500, bidon2Volume, 1000, 300);
        createBidonIcon(mainSvg, "Bidon-3", 400, bidon3Volume, 1300, 300);
        
        if (progress < 1) {
            requestAnimationFrame(updateAnimation);
        } else if (currentCycle === cycles - 1) {
            // Останавливаем вращение крыльчатки на последнем цикле
            d3.select(".pump-impeller").interrupt();
        }
    }
    
    updateAnimation();
}

