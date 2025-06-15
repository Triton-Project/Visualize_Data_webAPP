# Vehicle Tracker Web App

A real-time vehicle tracking web application built with React, TypeScript, and Google Maps. Reads sensor telemetry data from a Google Apps Script endpoint and displays it on an interactive map with detailed sensor information.

## Features

- **Real-time tracking**: Automatic data refresh with configurable intervals (5s, 10s, 30s, 60s)
- **Interactive map**: Google Maps integration with custom markers and polylines
- **Vehicle management**: Tab-based vehicle selection with real-time status
- **Detailed sensor data**: Side panel showing GPS coordinates, temperatures, and air pressure
- **Data export**: Export individual vehicle or all vehicle data as CSV/JSON
- **Keyboard shortcuts**: Quick navigation and control
- **Dark theme**: GitHub-inspired monochrome design
- **Connection monitoring**: Live connection status and retry tracking

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS 3 (dark mode)
- **Maps**: Google Maps JavaScript API via `@react-google-maps/api`
- **State Management**: Zustand
- **Data Fetching**: SWR with polling
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Data Export**: PapaParse

## Quick Start

1. **Clone and install dependencies**:
   ```bash
   git clone <repository-url>
   cd vehicle-tracker
   npm install
   ```

2. **Configure environment variables**:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and add your API keys:
   ```
   VITE_GMAPS_API_KEY=your_google_maps_api_key_here
   VITE_GAS_ENDPOINT=your_google_apps_script_web_app_url_here
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

## Google Apps Script Setup

Your GAS endpoint should support the following actions:

### GET Endpoints

- `?action=getAllVehicles` - Returns all vehicle data
- `?action=getVehicle&vehicleId=VEHICLE_ID` - Returns specific vehicle data
- `?action=getVehicleList` - Returns list of available vehicles

### Expected Data Format

```typescript
interface TelemetryDataPoint {
  timestamp: string;           // ISO 8601
  vehicleId: string;
  latitude: number;
  longitude: number;
  altitude: number;
  satellites: number;
  waterTemperature: number;
  airPressure: number;
  airTemperature: number;
}
```

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `[` / `]` | Switch between vehicle tabs |
| `1-9` | Select vehicle by number |
| `P` | Pause/resume data polling |
| `E` | Export all vehicle data as CSV |
| `ESC` | Close side panel |
| `←` / `→` | Navigate between vehicles |

## Project Structure

```
src/
├── api/               # API layer (GAS integration)
├── components/        # React components
│   ├── TopBar.tsx    # Status bar with controls
│   ├── VehicleTabs.tsx # Vehicle selection tabs
│   ├── MapContainer.tsx # Google Maps wrapper
│   ├── VehicleMarker.tsx # Map markers
│   ├── TrackPolyline.tsx # Vehicle tracks
│   ├── SidePanel.tsx # Sensor detail panel
│   └── StatusBar.tsx # Connection status and export
├── hooks/            # Custom React hooks
├── store/            # Zustand state management
├── types/            # TypeScript definitions
├── utils/            # Utility functions
├── constants/        # Configuration constants
└── styles/           # CSS and styling
```

## Configuration

### Map Styling
The app uses a custom monochrome Google Maps style defined in `src/constants/map.ts`. You can customize the appearance by modifying the `MONOCHROME_MAP_STYLE` array.

### Polling Intervals
Default refresh intervals can be modified in the TopBar component. Available options: 5s, 10s, 30s, 60s.

### Theme Colors
Dark theme colors are configured in `tailwind.config.js`:
- Background: `#0d1117`
- Surface: `#161b22`  
- Accent: `#58a6ff`
- Text: `#c9d1d9`
- Muted: `#8b949e`

## Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel/Netlify
The app is pre-configured for easy deployment to Vercel or Netlify. Just connect your repository and set the environment variables in the deployment dashboard.

## Development

### Code Style
- Uses TypeScript strict mode
- ESLint configuration for code quality
- Prettier for code formatting

### Testing
```bash
npm run test
```

### Type Checking
```bash
npm run type-check
```

## License

MIT License - see LICENSE file for details.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request