// Стили и размеры бидона
const BIDON_CONFIG = {
    baseHeight: 80,
    heightScale: 0.2,
    colors: {
        tank: "#eef0d0",
        liquid: "#3498db",
        stroke: "#333",
        percentage: "#ff0000"
    },
    dimensions: {
        width: 80,
        levelMeterWidth: 15
    },
    fonts: {
        percentage: {
            family: "monospace",
            size: "20px"
        },
        labels: {
            family: "Verdana",
            size: "14px"
        }
    }
};

// Конфигурация анимации и параметров бидонов
const ANIMATION_CONFIG = {
    duration: 10000,
    bidons: {
        bidon1: {
            id: "Bidon-1",
            maxVolume: 900,
            initialVolume: 900,
            position: {x: 200, y: 300}
        },
        bidon2: {
            id: "Bidon-2",
            maxVolume: 500,
            initialVolume: 0,
            position: {x: 1000, y: 300}
        },
        bidon3: {
            id: "Bidon-3",
            maxVolume: 400,
            initialVolume: 0,
            position: {x: 1300, y: 300}
        }
    }
};

