function initializeBidon(containerId, bidonId, maxVolume, currentVolume, xPos, yPos) {
    const bidon = new BidonModel(containerId, bidonId, maxVolume, currentVolume, xPos, yPos);
    return bidon.create();
}
