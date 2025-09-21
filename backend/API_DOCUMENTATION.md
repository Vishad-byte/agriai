# AgriAI Backend API Documentation

## Overview
This API provides endpoints for agricultural monitoring and analysis, including spectral health maps, temporal trend plots, anomaly alerts, soil condition summaries, and predicted risk zones.

## Base URL
```
http://localhost:8000/api/v1
```

## Authentication
Most endpoints require JWT authentication. Include the access token in the Authorization header:
```
Authorization: Bearer <access_token>
```

## Field ID Usage
- **URL Parameters**: Use string fieldIds like "A-1", "A-2", "B-1" in URLs
- **Database References**: Internal models use ObjectId references to Field._id
- **Example**: `/api/v1/spectral-health/field/A-1/map` uses string "A-1" but internally references the Field's ObjectId

## Endpoints

### User Management
- `POST /users/register` - Register a new user
- `POST /users/login` - Login user
- `POST /users/logout` - Logout user (requires auth)
- `POST /users/refresh-token` - Refresh access token
- `GET /users/current-user` - Get current user (requires auth)

### Field Management
- `POST /fields/create-field` - Create a new field
- `GET /fields/get-fields` - Get all fields with pagination
- `GET /fields/summary` - Get field summary statistics
- `GET /fields/get-field-by-id/:fieldId` - Get field by ID
- `PUT /fields/update-field/:fieldId` - Update field
- `DELETE /fields/delete-field/:fieldId` - Delete field

### Spectral Health (NDVI Data)
- `POST /spectral-health/create-data` - Create spectral health data
- `GET /spectral-health/field/:fieldId/map` - Get spectral health map for field
- `GET /spectral-health/field/:fieldId/zone/:zoneId` - Get spectral health data by zone
- `GET /spectral-health/field/:fieldId/summary` - Get spectral health summary
- `PUT /spectral-health/update-data/:id` - Update spectral health data

### Temporal Analysis
- `POST /temporal-analysis/create-temporal-data` - Create temporal analysis data
- `GET /temporal-analysis/field/:fieldId` - Get temporal analysis for field
- `GET /temporal-analysis/field/:fieldId/trends` - Get temporal trends
- `GET /temporal-analysis/field/:fieldId/environmental` - Get environmental conditions
- `GET /temporal-analysis/field/:fieldId/vegetation-moisture` - Get vegetation and moisture data

### Alerts
- `POST /alerts` - Create new alert
- `GET /alerts/active` - Get active alerts
- `GET /alerts/summary` - Get alert summary statistics
- `GET /alerts/recent` - Get recent alerts
- `GET /alerts/field/:fieldId` - Get alerts for specific field
- `PUT /alerts/:alertId/status` - Update alert status

### Soil Health
- `POST /soil-health` - Create soil health data
- `GET /soil-health/field/:fieldId/overview` - Get soil health overview
- `GET /soil-health/field/:fieldId/zone/:zoneId` - Get soil health by zone
- `GET /soil-health/field/:fieldId/summary` - Get soil health summary
- `GET /soil-health/field/:fieldId/trends` - Get soil health trends

### Risk Predictions
- `POST /risk-predictions` - Create risk prediction
- `GET /risk-predictions/field/:fieldId` - Get risk predictions for field
- `GET /risk-predictions/field/:fieldId/map` - Get risk zone map
- `GET /risk-predictions/field/:fieldId/summary` - Get risk summary
- `GET /risk-predictions/field/:fieldId/high-risk` - Get high risk zones
- `GET /risk-predictions/field/:fieldId/recommendations` - Get risk recommendations

### Seed Data (Development)
- `POST /seed` - Populate database with example agricultural data
- `GET /seed/examples` - Get example data structure

## Data Models

### Field
```json
{
  "fieldId": "string",
  "name": "string",
  "location": {
    "latitude": "number",
    "longitude": "number"
  },
  "area": "number",
  "cropType": "string",
  "plantingDate": "date",
  "expectedHarvestDate": "date",
  "status": "active|inactive|maintenance"
}
```

### Spectral Health
```json
{
  "fieldId": "ObjectId (references Field._id)",
  "zoneId": "string",
  "ndviValue": "number (0-1)",
  "healthPercentage": "number (0-100)",
  "healthStatus": "excellent|good|fair|poor",
  "coordinates": {
    "x": "number",
    "y": "number"
  },
  "sensorData": {
    "vegetationIndex": "number",
    "moistureIndex": "number",
    "temperatureIndex": "number"
  }
}
```

### Soil Health
```json
{
  "fieldId": "ObjectId (references Field._id)",
  "zoneId": "string",
  "phLevel": "number (0-14)",
  "moisture": "number (0-100)",
  "nitrogen": "number (0-100)",
  "phosphorus": "number (0-100)",
  "potassium": "number (0-100)",
  "healthStatus": "excellent|good|fair|poor",
  "healthScore": "number (0-100)"
}
```

### Alert
```json
{
  "fieldId": "ObjectId (references Field._id)",
  "zoneId": "string",
  "alertType": "drought|pest|disease|irrigation|nutrient|weather|equipment",
  "severity": "low|medium|high|critical",
  "title": "string",
  "description": "string",
  "status": "active|acknowledged|resolved|dismissed",
  "aiConfidence": "number (0-100)"
}
```

### Risk Prediction
```json
{
  "fieldId": "ObjectId (references Field._id)",
  "zoneId": "string",
  "riskLevel": "low|medium|high",
  "riskType": "drought|pest|disease|weather|nutrient|equipment",
  "probability": "number (0-100)",
  "aiConfidence": "number (0-100)",
  "coordinates": {
    "x": "number",
    "y": "number"
  },
  "timeHorizon": "1day|3days|1week|2weeks|1month"
}
```

## Example Usage

### Seed Database with Example Data
```bash
# First, register and login to get authentication token
POST /api/v1/users/register
{
  "fullName": "John Farmer",
  "username": "johnfarmer",
  "email": "john@farm.com",
  "password": "password123"
}

POST /api/v1/users/login
{
  "email": "john@farm.com",
  "password": "password123"
}

# Then seed the database with example data
POST /api/v1/seed
Authorization: Bearer <access_token>
```

### Create a Field
```bash
POST /api/v1/fields
{
  "fieldId": "A-1",
  "name": "North Corn Field",
  "location": {
    "latitude": 40.7128,
    "longitude": -74.0060
  },
  "area": 25.5,
  "cropType": "Corn",
  "plantingDate": "2024-03-15"
}
```

### Create Spectral Health Data
```bash
POST /api/v1/spectral-health/create-data
{
  "fieldId": "A-1",
  "zoneId": "A-1",
  "ndviValue": 0.78,
  "healthPercentage": 85,
  "coordinates": {
    "x": 10,
    "y": 15
  },
  "sensorData": {
    "vegetationIndex": 0.82,
    "moistureIndex": 0.75,
    "temperatureIndex": 0.68
  }
}
```

### Create Soil Health Data
```bash
POST /api/v1/soil-health
{
  "fieldId": "A-1",
  "zoneId": "A-1",
  "phLevel": 6.8,
  "moisture": 72,
  "nitrogen": 85,
  "phosphorus": 78,
  "potassium": 92,
  "organicMatter": 4.2,
  "soilTemperature": 18.5,
  "soilType": "loamy"
}
```

### Create Alert
```bash
POST /api/v1/alerts
{
  "fieldId": "A-1",
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

### Create Risk Prediction
```bash
POST /api/v1/risk-predictions
{
  "fieldId": "B-1",
  "zoneId": "B-1",
  "riskLevel": "high",
  "riskType": "disease",
  "probability": 78,
  "aiConfidence": 89,
  "coordinates": {
    "x": 8,
    "y": 12
  },
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
    }
  ]
}
```

### Get Soil Health Overview
```bash
GET /api/v1/soil-health/field/A-1/overview
```

### Get Spectral Health Map
```bash
GET /api/v1/spectral-health/field/A-1/map
```

### Get Active Alerts
```bash
GET /api/v1/alerts/active?severity=high&limit=5
```

### Get Risk Zone Map
```bash
GET /api/v1/risk-predictions/field/A-1/map?timeHorizon=1week
```

## Response Format
All responses follow this format:
```json
{
  "statusCode": 200,
  "data": {},
  "message": "Success message",
  "success": true
}
```

## Error Handling
Errors are returned in this format:
```json
{
  "statusCode": 400,
  "data": null,
  "message": "Error message",
  "success": false
}
```

## Pagination
List endpoints support pagination with these query parameters:
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)

## Filtering
Many endpoints support filtering with query parameters:
- `status` - Filter by status
- `severity` - Filter by severity level
- `riskLevel` - Filter by risk level
- `alertType` - Filter by alert type
- `period` - Filter by time period (6M, 1Y)
