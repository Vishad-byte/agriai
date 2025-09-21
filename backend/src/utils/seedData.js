// Example seed data for AgriAI agricultural monitoring system

export const exampleFields = [
    {
        fieldId: "A-1",
        name: "North Corn Field",
        location: {
            latitude: 40.7128,
            longitude: -74.0060
        },
        area: 25.5,
        cropType: "Corn",
        plantingDate: "2024-03-15",
        expectedHarvestDate: "2024-09-15",
        status: "active"
    },
    {
        fieldId: "A-2", 
        name: "South Wheat Field",
        location: {
            latitude: 40.7100,
            longitude: -74.0080
        },
        area: 18.2,
        cropType: "Wheat",
        plantingDate: "2024-02-20",
        expectedHarvestDate: "2024-07-20",
        status: "active"
    },
    {
        fieldId: "B-1",
        name: "East Soybean Field", 
        location: {
            latitude: 40.7150,
            longitude: -74.0040
        },
        area: 32.1,
        cropType: "Soybean",
        plantingDate: "2024-04-10",
        expectedHarvestDate: "2024-10-10",
        status: "active"
    }
];

export const exampleSpectralHealthData = [
    {
        zoneId: "A-1",
        ndviValue: 0.78,
        healthPercentage: 85,
        healthStatus: "excellent",
        coordinates: { x: 10, y: 15 },
        sensorData: {
            vegetationIndex: 0.82,
            moistureIndex: 0.75,
            temperatureIndex: 0.68
        }
    },
    {
        zoneId: "A-2", 
        ndviValue: 0.65,
        healthPercentage: 72,
        healthStatus: "good",
        coordinates: { x: 12, y: 18 },
        sensorData: {
            vegetationIndex: 0.68,
            moistureIndex: 0.70,
            temperatureIndex: 0.72
        }
    },
    {
        zoneId: "B-1",
        ndviValue: 0.45,
        healthPercentage: 38,
        healthStatus: "poor",
        coordinates: { x: 8, y: 12 },
        sensorData: {
            vegetationIndex: 0.42,
            moistureIndex: 0.35,
            temperatureIndex: 0.85
        }
    }
];

export const exampleSoilHealthData = [
    {
        zoneId: "A-1",
        phLevel: 6.8,
        moisture: 72,
        nitrogen: 85,
        phosphorus: 78,
        potassium: 92,
        organicMatter: 4.2,
        soilTemperature: 18.5,
        soilType: "loamy",
        healthStatus: "excellent",
        healthScore: 87
    },
    {
        zoneId: "A-2",
        phLevel: 7.2,
        moisture: 68,
        nitrogen: 82,
        phosphorus: 85,
        potassium: 88,
        organicMatter: 3.8,
        soilTemperature: 19.2,
        soilType: "clay",
        healthStatus: "good",
        healthScore: 81
    },
    {
        zoneId: "B-1",
        phLevel: 6.2,
        moisture: 45,
        nitrogen: 65,
        phosphorus: 68,
        potassium: 72,
        organicMatter: 2.1,
        soilTemperature: 22.1,
        soilType: "sandy",
        healthStatus: "poor",
        healthScore: 58
    }
];

export const exampleTemporalData = [
    {
        period: "6M",
        vegetationHealth: 75,
        moisture: 68,
        environmentalConditions: {
            temperature: 22.5,
            humidity: 65,
            rainfall: 15.2
        },
        trendData: {
            vegetationTrend: "increasing",
            moistureTrend: "stable"
        }
    },
    {
        period: "6M",
        vegetationHealth: 78,
        moisture: 72,
        environmentalConditions: {
            temperature: 24.1,
            humidity: 68,
            rainfall: 18.5
        },
        trendData: {
            vegetationTrend: "increasing",
            moistureTrend: "increasing"
        }
    }
];

export const exampleAlerts = [
    {
        zoneId: "A-3",
        alertType: "drought",
        severity: "high",
        title: "Severe drought detected in Field A-3",
        description: "Moisture levels have dropped below 30% for 3 consecutive days",
        aiConfidence: 94,
        metadata: {
            sensorData: {
                moisture: 28,
                temperature: 32.5,
                humidity: 25
            },
            recommendations: [
                "Increase irrigation frequency",
                "Apply mulch to retain moisture",
                "Monitor soil moisture hourly"
            ]
        }
    },
    {
        zoneId: "B-2",
        alertType: "pest",
        severity: "medium",
        title: "Pest risk elevated in Section B-2",
        description: "Increased pest activity detected in corn field",
        aiConfidence: 87,
        metadata: {
            sensorData: {
                pestActivity: 0.75,
                vegetationHealth: 0.65
            },
            recommendations: [
                "Apply targeted pesticide treatment",
                "Increase field monitoring frequency",
                "Consider biological pest control"
            ]
        }
    },
    {
        zoneId: "All Fields",
        alertType: "irrigation",
        severity: "low",
        title: "Irrigation cycle completed successfully",
        description: "Automated irrigation system completed scheduled watering",
        aiConfidence: 98,
        metadata: {
            sensorData: {
                waterApplied: 2.5,
                duration: 45
            },
            recommendations: [
                "Monitor soil moisture levels",
                "Schedule next irrigation cycle"
            ]
        }
    }
];

export const exampleRiskPredictions = [
    {
        zoneId: "A-1",
        riskLevel: "low",
        riskType: "drought",
        probability: 15,
        aiConfidence: 92,
        coordinates: { x: 10, y: 15 },
        timeHorizon: "1week",
        factors: {
            weather: {
                temperature: 22.5,
                humidity: 65,
                rainfall: 15.2,
                windSpeed: 8.5
            },
            soil: {
                moisture: 72,
                ph: 6.8,
                nutrients: { nitrogen: 85, phosphorus: 78, potassium: 92 }
            },
            vegetation: {
                ndvi: 0.78,
                healthIndex: 85
            }
        },
        recommendations: [
            {
                action: "Monitor soil moisture",
                priority: "low",
                description: "Continue regular monitoring"
            }
        ]
    },
    {
        zoneId: "B-1",
        riskLevel: "high",
        riskType: "disease",
        probability: 78,
        aiConfidence: 89,
        coordinates: { x: 8, y: 12 },
        timeHorizon: "3days",
        factors: {
            weather: {
                temperature: 28.5,
                humidity: 85,
                rainfall: 5.2,
                windSpeed: 3.2
            },
            soil: {
                moisture: 45,
                ph: 6.2,
                nutrients: { nitrogen: 65, phosphorus: 68, potassium: 72 }
            },
            vegetation: {
                ndvi: 0.45,
                healthIndex: 38
            }
        },
        recommendations: [
            {
                action: "Apply fungicide treatment",
                priority: "high",
                description: "Immediate fungicide application recommended"
            },
            {
                action: "Improve drainage",
                priority: "medium",
                description: "Address soil drainage issues"
            }
        ]
    }
];

export const exampleCropTypes = [
    "Corn", "Wheat", "Soybean", "Rice", "Cotton", "Barley", "Oats", "Rye", "Sorghum"
];

export const exampleSoilTypes = [
    "clay", "sandy", "loamy", "silty", "peaty", "chalky"
];

export const examplePestTypes = [
    "Aphids", "Corn Borer", "Armyworm", "Cutworm", "Thrips", "Whitefly", "Spider Mites"
];

export const exampleDiseases = [
    "Rust", "Blight", "Mildew", "Root Rot", "Leaf Spot", "Virus", "Bacterial Wilt"
];

export const exampleNutrients = {
    nitrogen: { optimal: 80, range: [60, 100] },
    phosphorus: { optimal: 75, range: [50, 95] },
    potassium: { optimal: 85, range: [65, 100] },
    calcium: { optimal: 70, range: [50, 90] },
    magnesium: { optimal: 60, range: [40, 80] }
};

export const exampleWeatherConditions = {
    temperature: { min: 15, max: 35, optimal: 22 },
    humidity: { min: 30, max: 90, optimal: 65 },
    rainfall: { min: 0, max: 50, optimal: 20 },
    windSpeed: { min: 0, max: 25, optimal: 8 }
};
