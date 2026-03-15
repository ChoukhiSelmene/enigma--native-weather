# Interface `WeatherResponse` — Documentation Open-Meteo

Documentation de l'interface TypeScript utilisée pour parser la réponse de l'API
`https://api.open-meteo.com/v1/forecast`.

---

## URL d'appel complète

```
https://api.open-meteo.com/v1/forecast
  ?latitude={lat}
  &longitude={lon}
  &current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,cloud_cover,wind_speed_10m,wind_direction_10m,wind_gusts_10m,is_day
  &hourly=temperature_2m,weather_code,precipitation_probability
  &daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,uv_index_max,sunrise,sunset
  &timezone=auto
  &forecast_days=7
```

> `&timezone=auto` permet à l'API de résoudre automatiquement le fuseau horaire local
> en fonction des coordonnées. Les heures retournées sont alors en heure locale.

---

## Structure TypeScript

```ts
export interface WeatherResponse {
  latitude: number;
  longitude: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  current: CurrentWeather;
  hourly: HourlyWeather;
  daily: DailyWeather;
}
```

---

## `WeatherResponse` — objet racine

| Champ                   | Type             | Description                                 |
| ----------------------- | ---------------- | ------------------------------------------- |
| `latitude`              | `number`         | Latitude de la grille météo utilisée        |
| `longitude`             | `number`         | Longitude de la grille météo                |
| `timezone`              | `string`         | Ex : `"Europe/Paris"`                       |
| `timezone_abbreviation` | `string`         | Ex : `"CET"`                                |
| `elevation`             | `number`         | Altitude en mètres du point météo           |
| `current`               | `CurrentWeather` | Conditions météo à l'instant présent        |
| `hourly`                | `HourlyWeather`  | Prévisions heure par heure (168h = 7 jours) |
| `daily`                 | `DailyWeather`   | Résumé journalier sur 7 jours               |

---

## `CurrentWeather` — météo actuelle

Valeurs instantanées. **C'est la section principale de la vue.**

```ts
export interface CurrentWeather {
  time: string;
  interval: number;
  temperature_2m: number;
  relative_humidity_2m: number;
  apparent_temperature: number;
  weather_code: number;
  cloud_cover: number;
  wind_speed_10m: number;
  wind_direction_10m: number;
  wind_gusts_10m: number;
  is_day: number;
}
```

| Champ                  | Type     | Unité        | Description                                                   |
| ---------------------- | -------- | ------------ | ------------------------------------------------------------- |
| `time`                 | `string` | ISO 8601     | Heure de la mesure, ex : `"2026-03-12T14:00"`                 |
| `interval`             | `number` | secondes     | Durée de mesure (généralement 900 = 15 min)                   |
| `temperature_2m`       | `number` | °C           | Température à 2m du sol                                       |
| `apparent_temperature` | `number` | °C           | Température ressentie (vent + humidité + radiation)           |
| `relative_humidity_2m` | `number` | %            | Humidité relative (0–100)                                     |
| `weather_code`         | `number` | WMO code     | Code représentant la condition météo (voir table plus bas)    |
| `cloud_cover`          | `number` | %            | Couverture nuageuse totale (0–100)                            |
| `wind_speed_10m`       | `number` | km/h         | Vitesse du vent à 10m                                         |
| `wind_direction_10m`   | `number` | degrés 0–360 | Direction du vent (0=N, 90=E, 180=S, 270=O)                   |
| `wind_gusts_10m`       | `number` | km/h         | Rafales maximales récentes                                    |
| `is_day`               | `number` | 0 ou 1       | `1` = jour, `0` = nuit (utile pour choisir icône soleil/lune) |

---

## `HourlyWeather` — prévisions heure par heure

Chaque champ est un **tableau parallèle** : `time[i]` correspond à `temperature_2m[i]`, etc.
L'API retourne **168 entrées** (7 jours × 24h), démarrant à **00:00 du jour courant**.

```ts
export interface HourlyWeather {
  time: string[];
  temperature_2m: number[];
  weather_code: number[];
  precipitation_probability: number[];
}
```

| Champ                       | Type       | Unité    | Description                                          |
| --------------------------- | ---------- | -------- | ---------------------------------------------------- |
| `time`                      | `string[]` | ISO 8601 | Ex : `["2026-03-12T00:00", "2026-03-12T01:00", ...]` |
| `temperature_2m`            | `number[]` | °C       | Température pour chaque heure                        |
| `weather_code`              | `number[]` | WMO code | Condition météo pour chaque heure                    |
| `precipitation_probability` | `number[]` | %        | Probabilité de précipitation pour chaque heure       |

> ⚠️ **Important** : les 168 heures commencent à 00:00 du jour courant, pas à l'heure actuelle.
> Pour afficher uniquement "à partir de maintenant", tu dois trouver l'index correspondant à
> l'heure courante et slicer le tableau à partir de là.

```ts
// Trouver l'index de l'heure courante
const currentHourPrefix = current.time.substring(0, 13); // ex: "2026-03-12T14"
const startIdx = hourly.time.findIndex(
  (t) => t.substring(0, 13) >= currentHourPrefix,
);

// Récupérer les 24 prochaines heures
const next24h = hourly.time.slice(startIdx, startIdx + 24).map((t, i) => ({
  time: t,
  temp: hourly.temperature_2m[startIdx + i],
  code: hourly.weather_code[startIdx + i],
  precipProb: hourly.precipitation_probability[startIdx + i],
}));
```

---

## `DailyWeather` — résumé sur 7 jours

Tableaux parallèles. `time[0]` = aujourd'hui, `time[1]` = demain, etc.

```ts
export interface DailyWeather {
  time: string[];
  weather_code: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  precipitation_probability_max: number[];
  uv_index_max: number[];
  sunrise: string[];
  sunset: string[];
}
```

| Champ                           | Type       | Unité        | Description                              |
| ------------------------------- | ---------- | ------------ | ---------------------------------------- |
| `time`                          | `string[]` | YYYY-MM-DD   | Ex : `["2026-03-12", "2026-03-13", ...]` |
| `weather_code`                  | `number[]` | WMO code     | Condition la plus sévère de la journée   |
| `temperature_2m_max`            | `number[]` | °C           | Température maximale du jour             |
| `temperature_2m_min`            | `number[]` | °C           | Température minimale du jour             |
| `precipitation_probability_max` | `number[]` | %            | Probabilité max de pluie dans la journée |
| `uv_index_max`                  | `number[]` | indice 0–11+ | Indice UV maximal                        |
| `sunrise`                       | `string[]` | ISO 8601     | Ex : `"2026-03-12T07:23"`                |
| `sunset`                        | `string[]` | ISO 8601     | Ex : `"2026-03-12T19:41"`                |

---

## Table des `weather_code` (WMO)

Entier retourné par l'API. Tu l'utilises pour choisir une icône et un texte descriptif.

| Code(s)    | Condition                     |
| ---------- | ----------------------------- |
| `0`        | Ciel dégagé                   |
| `1`        | Principalement dégagé         |
| `2`        | Partiellement nuageux         |
| `3`        | Couvert                       |
| `45`, `48` | Brouillard                    |
| `51–55`    | Bruine (légère à dense)       |
| `56`, `57` | Bruine verglaçante            |
| `61–65`    | Pluie (légère à forte)        |
| `66`, `67` | Pluie verglaçante             |
| `71–75`    | Neige (légère à forte)        |
| `77`       | Grains de neige               |
| `80–82`    | Averses (légères à violentes) |
| `85`, `86` | Averses de neige              |
| `95`       | Orage                         |
| `96`, `99` | Orage avec grêle              |

```ts
// Exemple de fonction utilitaire pour le label
function getWeatherLabel(code: number): string {
  if (code === 0) return "Ciel dégagé";
  if (code <= 2) return "Partiellement nuageux";
  if (code === 3) return "Couvert";
  if (code <= 48) return "Brouillard";
  if (code <= 55) return "Bruine";
  if (code <= 67) return "Pluie";
  if (code <= 77) return "Neige";
  if (code <= 82) return "Averses";
  if (code <= 86) return "Averses de neige";
  if (code === 95) return "Orage";
  return "Orage avec grêle";
}
```

---

## Exemple de JSON brut retourné par l'API

```json
{
  "latitude": 48.85,
  "longitude": 2.35,
  "timezone": "Europe/Paris",
  "timezone_abbreviation": "CET",
  "elevation": 35,
  "current": {
    "time": "2026-03-12T14:00",
    "interval": 900,
    "temperature_2m": 12.4,
    "apparent_temperature": 9.1,
    "relative_humidity_2m": 72,
    "weather_code": 3,
    "cloud_cover": 88,
    "wind_speed_10m": 18.2,
    "wind_direction_10m": 220,
    "wind_gusts_10m": 29.5,
    "is_day": 1
  },
  "hourly": {
    "time": ["2026-03-12T00:00", "2026-03-12T01:00", "...168 entrées..."],
    "temperature_2m": [8.1, 7.9, "..."],
    "weather_code": [3, 3, "..."],
    "precipitation_probability": [10, 15, "..."]
  },
  "daily": {
    "time": ["2026-03-12", "2026-03-13", "...7 entrées..."],
    "weather_code": [3, 1, "..."],
    "temperature_2m_max": [13.2, 15.0, "..."],
    "temperature_2m_min": [5.4, 6.1, "..."],
    "precipitation_probability_max": [30, 5, "..."],
    "uv_index_max": [3, 4, "..."],
    "sunrise": ["2026-03-12T07:23", "..."],
    "sunset": ["2026-03-12T19:41", "..."]
  }
}
```

---

## Récap — Quoi afficher où (style HyperOS)

| Section de la vue      | Donnée à utiliser                                                                |
| ---------------------- | -------------------------------------------------------------------------------- |
| Température principale | `current.temperature_2m`                                                         |
| Icône météo            | `current.weather_code` + `current.is_day` → fonction `getWeatherLabel()`         |
| Ressenti               | `current.apparent_temperature`                                                   |
| Min / Max du jour      | `daily.temperature_2m_min[0]` / `daily.temperature_2m_max[0]`                    |
| Scroll horaire         | `hourly.*` slicé à partir de l'heure courante, sur 24 entrées                    |
| Prévisions 7 jours     | Loop sur `daily.time` avec min, max, code, % pluie                               |
| Humidité               | `current.relative_humidity_2m`                                                   |
| Vent                   | `current.wind_speed_10m` + `current.wind_direction_10m` (convertir en N/NE/E...) |
| Rafales                | `current.wind_gusts_10m`                                                         |
| Couverture nuageuse    | `current.cloud_cover`                                                            |
| Indice UV              | `daily.uv_index_max[0]`                                                          |
| Lever / Coucher soleil | `daily.sunrise[0]` / `daily.sunset[0]` (extraire HH:mm)                          |
| % précipitations       | `daily.precipitation_probability_max[0]`                                         |
