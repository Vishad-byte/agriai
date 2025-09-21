# Agricultural Data Examples

This document provides realistic examples of agricultural data that can be used to test and demonstrate the AgriAI system.

## 🌾 Field Examples

### Field A-1: North Corn Field
```json
{
  "fieldId": "A-1",
  "name": "North Corn Field",
  "location": {
    "latitude": 40.7128,
    "longitude": -74.0060
  },
  "area": 25.5,
  "cropType": "Corn",
  "plantingDate": "2024-03-15",
  "expectedHarvestDate": "2024-09-15",
  "status": "active"
}
```

### Field A-2: South Wheat Field
```json
{
  "fieldId": "A-2",
  "name": "South Wheat Field", 
  "location": {
    "latitude": 40.7100,
    "longitude": -74.0080
  },
  "area": 18.2,
  "cropType": "Wheat",
  "plantingDate": "2024-02-20",
  "expectedHarvestDate": "2024-07-20",
  "status": "active"
}
```

## 🌱 Spectral Health (NDVI) Examples

### Excellent Health Zone
```json
{
  "zoneId": "A-1",
  "ndviValue": 0.78,
  "healthPercentage": 85,
  "healthStatus": "excellent",
  "coordinates": { "x": 10, "y": 15 },
  "sensorData": {
    "vegetationIndex": 0.82,
    "moistureIndex": 0.75,
    "temperatureIndex": 0.68
  }
}
```

### Poor Health Zone
```json
{
  "zoneId": "B-1",
  "ndviValue": 0.45,
  "healthPercentage": 38,
  "healthStatus": "poor",
  "coordinates": { "x": 8, "y": 12 },
  "sensorData": {
    "vegetationIndex": 0.42,
    "moistureIndex": 0.35,
    "temperatureIndex": 0.85
  }
}
```

## 🌍 Soil Health Examples

### Excellent Soil Health
```json
{
  "zoneId": "A-1",
  "phLevel": 6.8,
  "moisture": 72,
  "nitrogen": 85,
  "phosphorus": 78,
  "potassium": 92,
  "organicMatter": 4.2,
  "soilTemperature": 18.5,
  "soilType": "loamy",
  "healthStatus": "excellent",
  "healthScore": 87
}
```

### Poor Soil Health
```json
{
  "zoneId": "B-1",
  "phLevel": 6.2,
  "moisture": 45,
  "nitrogen": 65,
  "phosphorus": 68,
  "potassium": 72,
  "organicMatter": 2.1,
  "soilTemperature": 22.1,
  "soilType": "sandy",
  "healthStatus": "poor",
  "healthScore": 58
}
```

## 📊 Temporal Analysis Examples

### Vegetation Health Trend
```json
{
  "period": "6M",
  "vegetationHealth": 75,
  "moisture": 68,
  "environmentalConditions": {
    "temperature": 22.5,
    "humidity": 65,
    "rainfall": 15.2
  },
  "trendData": {
    "vegetationTrend": "increasing",
    "moistureTrend": "stable"
  }
}
```

## 🚨 Alert Examples

### Drought Alert
```json
{
  "zoneId": "A-3",
  "alertType": "drought",
  "severity": "high",
  "title": "Severe drought detected in Field A-3",
  "description": "Moisture levels have dropped below 30% for 3 consecutive days",
  "aiConfidence": 94,
  "metadata": {
    "sensorData": {
      "moisture": 28,
      "temperature": 32.5,
      "humidity": 25
    },
    "recommendations": [
      "Increase irrigation frequency",
      "Apply mulch to retain moisture",
      "Monitor soil moisture hourly"
    ]
  }
}
```

### Pest Alert
```json
{
  "zoneId": "B-2",
  "alertType": "pest",
  "severity": "medium",
  "title": "Pest risk elevated in Section B-2",
  "description": "Increased pest activity detected in corn field",
  "aiConfidence": 87,
  "metadata": {
    "sensorData": {
      "pestActivity": 0.75,
      "vegetationHealth": 0.65
    },
    "recommendations": [
      "Apply targeted pesticide treatment",
      "Increase field monitoring frequency",
      "Consider biological pest control"
    ]
  }
}
```

### Irrigation Success Alert
```json
{
  "zoneId": "All Fields",
  "alertType": "irrigation",
  "severity": "low",
  "title": "Irrigation cycle completed successfully",
  "description": "Automated irrigation system completed scheduled watering",
  "aiConfidence": 98,
  "metadata": {
    "sensorData": {
      "waterApplied": 2.5,
      "duration": 45
    },
    "recommendations": [
      "Monitor soil moisture levels",
      "Schedule next irrigation cycle"
    ]
  }
}
```

## ⚠️ Risk Prediction Examples

### Low Risk Zone
```json
{
  "zoneId": "A-1",
  "riskLevel": "low",
  "riskType": "drought",
  "probability": 15,
  "aiConfidence": 92,
  "coordinates": { "x": 10, "y": 15 },
  "timeHorizon": "1week",
  "factors": {
    "weather": {
      "temperature": 22.5,
      "humidity": 65,
      "rainfall": 15.2,
      "windSpeed": 8.5
    },
    "soil": {
      "moisture": 72,
      "ph": 6.8,
      "nutrients": {
        "nitrogen": 85,
        "phosphorus": 78,
        "potassium": 92
      }
    },
    "vegetation": {
      "ndvi": 0.78,
      "healthIndex": 85
    }
  },
  "recommendations": [
    {
      "action": "Monitor soil moisture",
      "priority": "low",
      "description": "Continue regular monitoring"
    }
  ]
}
```

### High Risk Zone
```json
{
  "zoneId": "B-1",
  "riskLevel": "high",
  "riskType": "disease",
  "probability": 78,
  "aiConfidence": 89,
  "coordinates": { "x": 8, "y": 12 },
  "timeHorizon": "3days",
  "factors": {
    "weather": {
      "temperature": 28.5,
      "humidity": 85,
      "rainfall": 5.2,
      "windSpeed": 3.2
    },
    "soil": {
      "moisture": 45,
      "ph": 6.2,
      "nutrients": {
        "nitrogen": 65,
        "phosphorus": 68,
        "potassium": 72
      }
    },
    "vegetation": {
      "ndvi": 0.45,
      "healthIndex": 38
    }
  },
  "recommendations": [
    {
      "action": "Apply fungicide treatment",
      "priority": "high",
      "description": "Immediate fungicide application recommended"
    },
    {
      "action": "Improve drainage",
      "priority": "medium",
      "description": "Address soil drainage issues"
    }
  ]
}
```

## 🌾 Crop Types
- **Corn** - High NDVI values (0.7-0.9), requires good soil moisture
- **Wheat** - Moderate NDVI values (0.6-0.8), drought tolerant
- **Soybean** - Variable NDVI values (0.5-0.8), nitrogen-fixing
- **Rice** - High moisture requirements, NDVI 0.6-0.9
- **Cotton** - Moderate NDVI (0.5-0.7), heat tolerant

## 🌍 Soil Types
- **Loamy** - Ideal for most crops, good drainage and water retention
- **Clay** - High water retention, can be poorly drained
- **Sandy** - Good drainage, low water retention
- **Silty** - Fine texture, good for root development
- **Peaty** - High organic matter, acidic
- **Chalky** - Alkaline, good for certain crops

## 🐛 Common Pests
- **Aphids** - Sucking insects, cause yellowing
- **Corn Borer** - Larvae bore into corn stalks
- **Armyworm** - Feed on leaves and stems
- **Cutworm** - Cut plants at soil level
- **Thrips** - Cause silvering on leaves
- **Whitefly** - Sucking insects, spread diseases
- **Spider Mites** - Cause stippling on leaves

## 🦠 Common Diseases
- **Rust** - Fungal disease, orange/brown spots
- **Blight** - Bacterial/fungal, causes wilting
- **Mildew** - White powdery coating
- **Root Rot** - Fungal, affects root system
- **Leaf Spot** - Circular lesions on leaves
- **Virus** - Various viral infections
- **Bacterial Wilt** - Causes sudden wilting

## 📈 Nutrient Ranges
- **Nitrogen (N)**: 60-100% (optimal: 80%)
- **Phosphorus (P)**: 50-95% (optimal: 75%)
- **Potassium (K)**: 65-100% (optimal: 85%)
- **Calcium (Ca)**: 50-90% (optimal: 70%)
- **Magnesium (Mg)**: 40-80% (optimal: 60%)

## 🌡️ Weather Conditions
- **Temperature**: 15-35°C (optimal: 22°C)
- **Humidity**: 30-90% (optimal: 65%)
- **Rainfall**: 0-50mm (optimal: 20mm)
- **Wind Speed**: 0-25 km/h (optimal: 8 km/h)

## 🎯 Health Score Calculations

### Soil Health Score Formula
```
Health Score = (pH Score × 0.3) + (Moisture Score × 0.4) + (Nutrient Score × 0.3)

Where:
- pH Score = 100 - |pH - 6.5| × 10
- Moisture Score = moisture percentage
- Nutrient Score = (N + P + K) / 3
```

### Health Status Ranges
- **Excellent**: 80-100%
- **Good**: 60-79%
- **Fair**: 40-59%
- **Poor**: 0-39%

## 🔄 Trend Calculations

### Vegetation Health Trend
- **Increasing**: Change > 5%
- **Decreasing**: Change < -5%
- **Stable**: Change between -5% and 5%

### Moisture Trend
- **Increasing**: Change > 5%
- **Decreasing**: Change < -5%
- **Stable**: Change between -5% and 5%

## 📊 Dashboard Data Mapping

### Spectral Health Map
- **Grid Layout**: 4 rows × 7 columns (28 zones)
- **Color Coding**:
  - Green (80-100%): Excellent
  - Light Green (60-80%): Good
  - Yellow (40-60%): Fair
  - Red (0-40%): Poor

### Risk Zone Map
- **Grid Layout**: 6 rows × 8 columns (48 zones)
- **Color Coding**:
  - Green: Low Risk
  - Yellow: Medium Risk
  - Red: High Risk

### Alert Types
- **Drought**: Red warning triangle
- **Pest**: Orange warning triangle
- **Irrigation**: Blue bell icon
- **Disease**: Red warning triangle
- **Weather**: Yellow warning triangle
