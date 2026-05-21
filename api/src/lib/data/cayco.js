
export const palletTypesRaw = [
    { name: "MINI", maxWeight: 150,  maxLength: 120, maxWidth: 100, maxHeight: 60 },
    { name: "CUARTO", maxWeight: 300,  maxLength: 120, maxWidth: 100, maxHeight: 80 },
    { name: "PLUMA", maxWeight: 300,  maxLength: 120, maxWidth: 80, maxHeight: 220 },
    { name: "MEDIO", maxWeight: 450,  maxLength: 120, maxWidth: 100, maxHeight: 180 },
    { name: "LIGERO", maxWeight: 600,  maxLength: 120, maxWidth: 100, maxHeight: 220 },
    { name: "COMPLETO", maxWeight: 800,  maxLength: 120, maxWidth: 100, maxHeight: 180 },
    { name: "SUPER", maxWeight: 1200,  maxLength: 120, maxWidth: 100, maxHeight: 220 }
];

export const zonesRaw = [
    { province: "ES-M", zone: "ZONA 1" },
    { province: "ES-TO", zone: "ZONA 2" },
    { province: "ES-AV", zone: "ZONA 3" },
    { province: "ES-GU", zone: "ZONA 3" },
    { province: "ES-SG", zone: "ZONA 3" },
    { province: "ES-VA", zone: "ZONA 3" },

    { province: "ES-VI", zone: "ZONA 4" },
    { province: "ES-A", zone: "ZONA 4" },
    { province: "ES-BU", zone: "ZONA 4" },
    { province: "ES-CS", zone: "ZONA 4" },
    { province: "ES-LE", zone: "ZONA 4" },
    { province: "ES-LO", zone: "ZONA 4" },
    { province: "ES-MU", zone: "ZONA 4" },
    { province: "ES-SA", zone: "ZONA 4" },
    { province: "ES-SO", zone: "ZONA 4" },
    { province: "ES-TE", zone: "ZONA 4" },
    { province: "ES-V", zone: "ZONA 4" },
    { province: "ES-Z", zone: "ZONA 4" },
    { province: "ES-CR", zone: "ZONA 4" },

    { province: "ES-O", zone: "ZONA 5" },
    { province: "ES-S", zone: "ZONA 5" },
    { province: "ES-CU", zone: "ZONA 5" },
    { province: "ES-SS", zone: "ZONA 5" },
    { province: "ES-NA", zone: "ZONA 5" },
    { province: "ES-BI", zone: "ZONA 5" },
    { province: "ES-P", zone: "ZONA 5" },
    { province: "ES-AB", zone: "ZONA 5" },
    { province: "ES-ZA", zone: "ZONA 5" },

    { province: "ES-B", zone: "ZONA 6" },
    { province: "ES-HU", zone: "ZONA 6" },
    { province: "ES-T", zone: "ZONA 6" },

    { province: "ES-C", zone: "ZONA 7" },
    { province: "ES-GI", zone: "ZONA 7" },
    { province: "ES-LU", zone: "ZONA 7" },
    { province: "ES-OR", zone: "ZONA 7" },
    { province: "ES-PO", zone: "ZONA 7" },
    { province: "ES-CC", zone: "ZONA 7" },
    { province: "ES-BA", zone: "ZONA 7" },
    { province: "ES-L", zone: "ZONA 7" },

    { province: "ES-AL", zone: "ZONA 11" },
    { province: "ES-J", zone: "ZONA 11" },
    { province: "ES-MA", zone: "ZONA 11" },

    { province: "ES-SE", zone: "ZONA 12" },
    { province: "ES-CO", zone: "ZONA 12" }
];

export const basicNames = [
    "MINI",
    "CUARTO",
    "MEDIO",
    "LIGERO",
    "PLUMA"
];

//-------------------------------- RATE ----------------------------------------
export const basicRates = {
    "ZONA 1": [28.43, 35.71, 44.10, 48.58, 44.51],
    "ZONA 2": [29.55, 36.82, 45.22, 49.70, 46.02],
    "ZONA 3": [30.67, 37.94, 47.46, 51.94, 46.92],
    "ZONA 4": [30.33, 38.17, 48.24, 52.72, 49.40],
    "ZONA 5": [35.71, 43.54, 51.94, 56.41, 51.23],
    "ZONA 6": [37.94, 45.89, 56.52, 62.57, 54.03],
    "ZONA 7": [39.06, 48.13, 63.24, 67.72, 58.01]
};

export const completoRates = {
    "ZONA 1": [54.45, 52.77, 51.66, 51.10, 50.54, 49.98, 49.42],
    "ZONA 2": [56.69, 55.01, 53.89, 53.33, 52.77, 52.22, 51.66],
    "ZONA 3": [60.05, 58.37, 57.25, 56.69, 56.13, 55.57, 55.01],
    "ZONA 4": [60.05, 58.37, 57.25, 56.69, 56.13, 55.57, 55.01],
    "ZONA 5": [69.00, 66.77, 65.65, 65.09, 64.53, 63.97, 63.41],
    "ZONA 6": [72.47, 69.12, 68.00, 66.88, 65.76, 64.64, 63.52],
    "ZONA 7": [82.55, 80.31, 77.96, 76.84, 74.71, 73.59, 73.03]
};

export const superRates = {
    "ZONA 1": [63.41, 58.37, 57.25, 56.69, 56.13, 55.57, 55.01],
    "ZONA 2": [62.29, 60.61, 59.49, 58.93, 58.37, 57.81, 57.25],
    "ZONA 3": [65.65, 63.97, 62.85, 62.29, 61.73, 61.17, 60.61],
    "ZONA 4": [65.65, 63.97, 62.85, 62.29, 61.73, 61.17, 60.61],
    "ZONA 5": [74.60, 72.36, 71.24, 70.12, 69.56, 69.00, 67.89],
    "ZONA 6": [79.08, 76.95, 73.59, 72.47, 71.36, 70.24, 69.12],
    "ZONA 7": [90.27, 88.14, 85.91, 84.79, 83.67, 82.55, 81.43]
};

//---------------------------- RATE ANDALUCIA ---------------------------------------
export const zona11 = [
    [50, 7.20], [60, 8.01], [70, 8.84], [80, 9.70], [90, 10.51],
    [100, 11.34], [120, 13.00], [140, 14.66], [160, 16.18],
    [180, 17.84], [200, 19.07], [230, 21.51], [260, 23.90],
    [290, 26.39], [320, 28.68], [350, 30.95], [380, 32.03],
    [410, 34.12], [440, 34.86], [470, 36.06], [500, 38.28],
    [550, 41.17], [600, 43.87], [650, 47.32], [700, 49.82],
    [750, 52.11], [800, 54.22], [850, 57.70], [900, 62.80],
    [1000, 67.07], [2000, 63.73], [3000, 53.92], [7000, 48.88]
];

export const zona12 = [
    [50, 7.20], [60, 8.01], [70, 8.84], [80, 9.70], [90, 10.51],
    [100, 11.34], [120, 13.00], [140, 14.66], [160, 16.18],
    [180, 17.84], [200, 19.07], [230, 21.51], [260, 23.90],
    [290, 26.39], [320, 28.68], [350, 30.95], [380, 32.03],
    [410, 34.12], [440, 34.86], [470, 36.06], [500, 38.28],
    [550, 41.17], [600, 43.87], [650, 47.32], [700, 49.82],
    [750, 52.11], [800, 54.22], [850, 57.70], [900, 62.80],
    [1000, 67.07], [2000, 63.73], [3000, 53.92], [7000, 47.25] 
];