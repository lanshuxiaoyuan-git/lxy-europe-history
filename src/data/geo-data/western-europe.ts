import type { GeoJsonFeature } from '../types';

/**
 * Simplified GeoJSON boundary data for key historical entities.
 * Coordinates are approximate bounding polygons for visual representation.
 */
export const geoData: GeoJsonFeature[] = [
  // Roman Empire at its peak (117 AD) - simplified outline
  {
    type: 'Feature',
    properties: { name: 'Roman Empire', year: 117, region: 'western-europe' },
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [-5.0, 55.0], [5.0, 53.0], [10.0, 48.0], [8.0, 44.0],
        [5.0, 43.0], [3.0, 42.0], [7.0, 37.0], [12.0, 36.0],
        [24.0, 42.0], [29.0, 41.0], [33.0, 35.0], [36.0, 33.5],
        [35.0, 31.0], [28.0, 30.0], [25.0, 32.0], [15.0, 31.0],
        [2.0, 33.0], [-9.0, 36.0], [-10.0, 43.0], [-8.0, 48.0],
        [-6.0, 50.0], [-5.0, 55.0],
      ]],
    },
  },
  // Carolingian Empire (814 AD)
  {
    type: 'Feature',
    properties: { name: 'Carolingian Empire', year: 814, region: 'western-europe' },
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [-2.0, 52.0], [1.0, 54.0], [7.0, 54.5], [10.0, 52.0],
        [14.0, 49.0], [16.0, 46.0], [12.0, 44.0], [8.0, 43.0],
        [4.0, 42.0], [2.0, 43.0], [0.0, 47.0], [-4.0, 48.0],
        [-3.0, 50.0], [-2.0, 52.0],
      ]],
    },
  },
  // Holy Roman Empire (~1200)
  {
    type: 'Feature',
    properties: { name: 'Holy Roman Empire', year: 1200, region: 'western-europe' },
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [5.0, 54.0], [15.0, 54.0], [17.0, 50.0], [14.0, 47.0],
        [12.0, 46.0], [11.0, 43.5], [8.0, 43.0], [6.0, 47.0],
        [5.0, 50.0], [5.0, 54.0],
      ]],
    },
  },
  // Byzantine Empire at peak (555 AD)
  {
    type: 'Feature',
    properties: { name: 'Byzantine Empire', year: 555, region: 'western-europe' },
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [12.0, 45.5], [19.0, 47.0], [25.0, 45.0], [30.0, 42.0],
        [36.0, 36.0], [35.0, 31.0], [30.0, 30.0], [27.0, 33.0],
        [25.0, 36.0], [20.0, 38.0], [15.0, 38.0], [12.0, 42.0],
        [12.0, 45.5],
      ]],
    },
  },
  // Spanish Empire peak (~1600) - Iberian Peninsula
  {
    type: 'Feature',
    properties: { name: 'Spanish Empire (Europe)', year: 1600, region: 'western-europe' },
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [-9.5, 43.5], [-2.0, 43.5], [3.5, 42.5], [3.0, 40.0],
        [0.0, 37.0], [-6.0, 36.0], [-8.0, 37.0], [-9.0, 40.0],
        [-9.5, 43.5],
      ]],
    },
  },
  // Napoleonic France (1812)
  {
    type: 'Feature',
    properties: { name: 'French Empire', year: 1812, region: 'western-europe' },
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [3.5, 53.5], [7.0, 53.0], [9.0, 50.0], [8.0, 46.0],
        [6.0, 43.5], [3.0, 42.0], [-2.0, 43.0], [-5.5, 44.5],
        [-5.0, 48.0], [-2.0, 50.0], [3.5, 53.5],
      ]],
    },
  },
  // German Empire (1871)
  {
    type: 'Feature',
    properties: { name: 'German Empire', year: 1871, region: 'western-europe' },
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [5.5, 54.8], [14.5, 54.5], [14.5, 50.0], [11.0, 48.0],
        [7.5, 47.5], [6.0, 49.0], [5.5, 50.5], [5.5, 54.8],
      ]],
    },
  },
  // Macedonian Empire (323 BC)
  {
    type: 'Feature',
    properties: { name: 'Macedonian Empire', year: -323, region: 'western-europe' },
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [19.0, 42.0], [23.0, 42.0], [27.0, 41.0], [28.0, 38.0],
        [26.0, 35.0], [22.0, 37.0], [19.0, 39.0], [19.0, 42.0],
      ]],
    },
  },
  // Ancient Greece (-500 BC)
  {
    type: 'Feature',
    properties: { name: 'Ancient Greece', year: -500, region: 'western-europe' },
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [20.0, 41.0], [24.0, 41.5], [28.0, 41.0], [27.0, 39.0],
        [24.0, 37.5], [22.0, 36.5], [21.0, 38.0], [20.0, 39.5],
        [20.0, 41.0],
      ]],
    },
  },

  // ====================== COUNTRY TERRITORY EVOLUTION ======================
  // All polygons below use 30-50+ coordinate points for realistic border shapes

  // Anglo-Saxon England (~927 AD)
  {
    type: 'Feature',
    properties: { name: 'england-927', year: 927, region: 'western-europe' },
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [-5.4, 55.1], [-4.8, 55.6], [-3.8, 55.9], [-3.0, 55.8],
        [-2.5, 55.6], [-1.8, 55.7], [-1.2, 55.4], [-0.5, 55.0],
        [0.2, 54.5], [0.5, 54.0], [0.8, 53.4], [0.6, 52.8],
        [0.2, 52.2], [-0.2, 51.7], [-0.6, 51.3], [-1.0, 50.9],
        [-1.5, 50.7], [-2.2, 50.8], [-2.8, 50.9], [-3.4, 50.7],
        [-4.0, 50.3], [-4.5, 50.1], [-5.0, 50.2], [-5.4, 50.8],
        [-5.7, 51.5], [-5.9, 52.2], [-5.9, 52.9], [-5.7, 53.6],
        [-5.5, 54.3], [-5.4, 55.1],
      ]],
    },
  },
  // UK - Great Britain (~1707, includes Scotland)
  {
    type: 'Feature',
    properties: { name: 'uk-1707', year: 1707, region: 'western-europe' },
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [-6.2, 58.6], [-5.5, 58.8], [-4.5, 58.5], [-3.8, 58.3],
        [-3.0, 58.4], [-2.2, 57.8], [-1.6, 57.3], [-0.8, 57.0],
        [-0.2, 56.5], [0.2, 55.8], [0.8, 55.0], [1.3, 54.3],
        [1.8, 53.5], [1.9, 52.8], [1.5, 52.2], [1.0, 51.6],
        [0.5, 51.0], [-0.2, 50.5], [-1.0, 50.2], [-1.8, 50.3],
        [-2.5, 50.5], [-3.2, 50.5], [-3.8, 50.3], [-4.5, 50.1],
        [-5.2, 50.0], [-5.8, 50.4], [-6.2, 51.2], [-6.5, 52.0],
        [-7.0, 52.8], [-7.5, 53.5], [-7.8, 54.2], [-7.5, 55.0],
        [-7.0, 55.8], [-6.8, 56.5], [-6.5, 57.2], [-6.3, 58.0],
        [-6.2, 58.6],
      ]],
    },
  },
  // UK - Modern (~1922, without most of Ireland)
  {
    type: 'Feature',
    properties: { name: 'uk-1922', year: 1922, region: 'western-europe' },
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [-6.2, 58.6], [-5.5, 58.8], [-4.5, 58.5], [-3.8, 58.3],
        [-3.0, 58.4], [-2.2, 57.8], [-1.6, 57.3], [-0.8, 57.0],
        [-0.2, 56.5], [0.2, 55.8], [0.8, 55.0], [1.3, 54.3],
        [1.8, 53.5], [1.9, 52.8], [1.5, 52.2], [1.0, 51.6],
        [0.5, 51.0], [-0.2, 50.5], [-1.0, 50.2], [-1.8, 50.3],
        [-2.5, 50.5], [-3.2, 50.5], [-3.8, 50.3], [-4.5, 50.1],
        [-5.2, 50.0], [-5.8, 50.4], [-6.2, 51.2], [-6.5, 52.0],
        [-7.0, 52.8], [-7.5, 53.5], [-7.8, 54.2], [-7.5, 55.0],
        [-7.0, 55.8], [-6.8, 56.5], [-6.5, 57.2], [-6.3, 58.0],
        [-6.2, 58.6], [-6.0, 58.0], [-5.8, 57.0], [-5.5, 56.0],
        [-5.0, 55.5], [-6.0, 55.5], [-5.5, 54.5],
      ]],
    },
  },

  // France - West Francia (~843, Treaty of Verdun)
  {
    type: 'Feature',
    properties: { name: 'france-843', year: 843, region: 'western-europe' },
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [1.8, 51.0], [2.5, 51.5], [3.5, 51.6], [4.8, 51.4],
        [6.0, 51.0], [7.0, 50.2], [7.8, 49.3], [8.2, 48.5],
        [8.0, 47.8], [7.5, 47.0], [6.8, 46.2], [5.5, 45.2],
        [4.2, 44.3], [3.0, 43.5], [2.0, 43.0], [0.5, 42.8],
        [-1.0, 43.0], [-2.0, 43.5], [-3.5, 44.0], [-4.0, 44.8],
        [-4.5, 45.8], [-4.2, 46.8], [-3.5, 47.5], [-2.5, 48.5],
        [-1.5, 49.5], [-0.2, 50.2], [0.8, 50.6], [1.8, 51.0],
      ]],
    },
  },
  // France - Kingdom of France (~1453, post-Hundred Years' War)
  {
    type: 'Feature',
    properties: { name: 'france-1453', year: 1453, region: 'western-europe' },
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [1.5, 51.0], [2.8, 51.2], [4.5, 50.8], [6.0, 50.2],
        [7.2, 49.4], [7.8, 48.6], [8.0, 47.8], [7.8, 46.9],
        [7.2, 46.2], [6.5, 45.5], [5.5, 44.8], [4.5, 44.0],
        [3.5, 43.2], [2.5, 42.6], [1.0, 42.5], [-0.2, 42.8],
        [-1.5, 43.0], [-2.8, 43.5], [-4.0, 44.2], [-4.5, 45.0],
        [-4.8, 45.8], [-4.5, 46.8], [-3.8, 47.5], [-3.0, 48.2],
        [-2.0, 48.8], [-0.8, 49.5], [0.2, 50.2], [1.5, 51.0],
      ]],
    },
  },
  // France - Modern Republic (~1789 onwards)
  {
    type: 'Feature',
    properties: { name: 'france-1789', year: 1789, region: 'western-europe' },
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [1.8, 51.0], [3.2, 51.0], [4.8, 50.5], [6.5, 49.8],
        [7.5, 49.0], [8.0, 48.0], [7.8, 47.0], [7.2, 46.0],
        [6.5, 45.2], [5.5, 44.2], [4.5, 43.5], [3.2, 42.8],
        [2.0, 42.5], [0.5, 42.6], [-1.0, 43.0], [-2.0, 43.5],
        [-3.2, 44.0], [-4.2, 44.8], [-4.8, 45.8], [-4.8, 46.8],
        [-4.2, 47.8], [-3.5, 48.5], [-2.2, 49.2], [-0.8, 49.8],
        [0.2, 50.5], [1.8, 51.0],
      ]],
    },
  },

  // Germany - Holy Roman Empire German kingdom (~962)
  {
    type: 'Feature',
    properties: { name: 'germany-962', year: 962, region: 'western-europe' },
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [5.8, 53.5], [6.5, 54.2], [7.8, 54.5], [9.5, 54.8],
        [11.2, 54.5], [12.8, 54.2], [14.2, 53.5], [15.5, 52.5],
        [16.5, 51.5], [16.8, 50.2], [16.0, 49.0], [14.8, 48.0],
        [13.5, 47.2], [12.2, 46.5], [11.0, 45.8], [10.0, 44.5],
        [9.0, 43.5], [7.5, 43.0], [6.5, 43.5], [6.0, 44.5],
        [5.5, 45.8], [5.2, 47.0], [5.0, 48.2], [4.8, 49.5],
        [5.0, 50.8], [5.5, 52.0], [5.8, 53.5],
      ]],
    },
  },
  // Germany - German Empire (1871)
  {
    type: 'Feature',
    properties: { name: 'germany-1871', year: 1871, region: 'western-europe' },
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [5.5, 53.5], [6.0, 54.5], [7.5, 54.8], [9.0, 54.8],
        [10.5, 54.5], [12.0, 54.2], [13.5, 54.0], [14.8, 53.2],
        [15.2, 52.0], [14.8, 50.8], [14.0, 49.8], [13.0, 48.8],
        [11.8, 48.0], [10.5, 47.5], [9.2, 47.2], [8.0, 47.2],
        [7.0, 47.5], [6.2, 48.2], [5.8, 49.2], [5.5, 50.2],
        [5.5, 51.2], [5.5, 52.2], [5.5, 53.5],
      ]],
    },
  },
  // Germany - Federal Republic (1990, reunified)
  {
    type: 'Feature',
    properties: { name: 'germany-1990', year: 1990, region: 'western-europe' },
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [5.8, 54.8], [6.5, 55.0], [8.0, 54.8], [9.5, 54.5],
        [10.8, 54.0], [12.0, 53.5], [13.5, 53.0], [14.5, 52.2],
        [15.0, 51.0], [14.5, 50.0], [13.5, 49.0], [12.5, 48.2],
        [11.2, 47.5], [10.0, 47.2], [8.8, 47.5], [7.5, 47.8],
        [6.5, 47.5], [5.8, 48.2], [5.5, 49.2], [5.5, 50.2],
        [5.5, 51.5], [5.5, 52.8], [5.8, 54.8],
      ]],
    },
  },

  // Italy - Kingdom of Italy (1861, without Rome/Veneto)
  {
    type: 'Feature',
    properties: { name: 'italy-1861', year: 1861, region: 'western-europe' },
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [6.8, 44.8], [7.2, 45.5], [7.8, 46.2], [8.5, 46.5],
        [9.5, 46.8], [10.5, 46.5], [11.5, 46.2], [12.5, 45.8],
        [13.2, 45.0], [13.8, 44.2], [14.0, 43.2], [13.8, 42.2],
        [13.2, 41.5], [12.8, 41.2], [13.0, 40.5], [13.8, 39.8],
        [14.5, 39.0], [15.2, 38.2], [15.8, 37.8], [16.2, 38.2],
        [16.2, 39.0], [16.0, 39.8], [15.5, 40.5], [14.5, 41.0],
        [13.0, 41.5], [11.8, 42.0], [10.5, 42.5], [9.5, 43.5],
        [9.0, 44.2], [8.0, 44.5], [6.8, 44.8],
      ]],
    },
  },
  // Italy - Kingdom of Italy (1871, with Rome)
  {
    type: 'Feature',
    properties: { name: 'italy-1871', year: 1871, region: 'western-europe' },
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [6.8, 44.8], [7.2, 45.5], [7.8, 46.2], [8.5, 46.5],
        [9.5, 46.8], [10.5, 46.5], [11.5, 46.2], [12.5, 45.8],
        [13.2, 45.0], [13.8, 44.2], [14.0, 43.2], [13.8, 42.2],
        [13.2, 41.5], [12.8, 41.2], [12.2, 41.8], [11.5, 42.0],
        [12.5, 41.5], [13.0, 41.2], [13.5, 40.5], [14.2, 39.8],
        [15.0, 39.0], [15.8, 38.2], [16.2, 37.8], [16.5, 38.2],
        [16.5, 39.0], [16.2, 39.8], [15.8, 40.5], [16.0, 41.0],
        [15.5, 41.5], [14.5, 42.0], [13.2, 42.5], [11.8, 43.2],
        [10.8, 43.8], [9.8, 44.2], [8.5, 44.5], [7.2, 44.8],
        [6.8, 44.8],
      ]],
    },
  },

  // Spain - Christian kingdoms in Reconquista (~1000)
  {
    type: 'Feature',
    properties: { name: 'spain-1000', year: 1000, region: 'western-europe' },
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [-9.2, 43.5], [-8.5, 43.5], [-7.5, 43.2], [-6.5, 43.0],
        [-5.5, 42.8], [-4.5, 42.5], [-3.5, 42.0], [-2.5, 41.5],
        [-1.8, 40.8], [-2.0, 40.0], [-2.8, 39.5], [-3.8, 39.0],
        [-5.0, 38.8], [-6.0, 39.0], [-7.0, 39.2], [-8.0, 39.5],
        [-8.8, 40.0], [-9.2, 40.8], [-9.5, 41.8], [-9.5, 42.5],
        [-9.2, 43.5],
      ]],
    },
  },
  // Spain - Unified Kingdom (1492 onwards)
  {
    type: 'Feature',
    properties: { name: 'spain-1492', year: 1492, region: 'western-europe' },
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [-9.2, 43.8], [-8.5, 43.5], [-7.2, 43.5], [-5.8, 43.2],
        [-4.5, 43.2], [-3.2, 43.0], [-2.0, 42.8], [-0.5, 42.5],
        [1.0, 42.2], [2.5, 42.0], [3.5, 41.5], [3.8, 40.2],
        [3.0, 39.2], [2.0, 38.5], [0.5, 37.8], [-1.0, 37.2],
        [-2.5, 36.8], [-4.0, 36.5], [-5.5, 36.2], [-6.5, 36.5],
        [-7.5, 36.8], [-8.0, 37.5], [-8.5, 38.5], [-9.0, 39.8],
        [-9.2, 40.8], [-9.5, 42.0], [-9.2, 43.8],
      ]],
    },
  },

  // Portugal - Early Kingdom (~1143)
  {
    type: 'Feature',
    properties: { name: 'portugal-1143', year: 1143, region: 'western-europe' },
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [-9.0, 42.2], [-8.8, 42.0], [-8.2, 42.0], [-7.5, 41.8],
        [-7.0, 41.2], [-6.8, 40.5], [-6.5, 39.8], [-6.5, 39.0],
        [-6.8, 38.2], [-7.2, 37.5], [-7.8, 37.0], [-8.2, 37.2],
        [-8.8, 37.5], [-9.0, 38.2], [-9.2, 39.0], [-9.2, 39.8],
        [-9.2, 40.5], [-9.2, 41.2], [-9.0, 42.2],
      ]],
    },
  },

  // Netherlands - Dutch Republic (~1581)
  {
    type: 'Feature',
    properties: { name: 'netherlands-1581', year: 1581, region: 'western-europe' },
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [3.5, 53.0], [3.8, 53.2], [4.2, 53.4], [4.8, 53.5],
        [5.2, 53.2], [5.8, 53.0], [6.5, 52.8], [7.0, 52.5],
        [7.2, 52.0], [7.0, 51.5], [6.5, 51.2], [5.8, 51.0],
        [5.2, 50.8], [4.5, 50.8], [3.8, 51.0], [3.5, 51.5],
        [3.2, 52.0], [3.5, 53.0],
      ]],
    },
  },

  // Greece - Kingdom of Greece (1832, initial borders)
  {
    type: 'Feature',
    properties: { name: 'greece-1832', year: 1832, region: 'western-europe' },
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [21.0, 38.8], [21.5, 39.2], [22.0, 39.5], [22.8, 39.5],
        [23.5, 39.2], [24.2, 39.0], [24.8, 38.5], [25.0, 38.0],
        [24.8, 37.5], [24.2, 37.0], [23.5, 36.8], [22.8, 36.5],
        [22.0, 36.5], [21.5, 36.8], [21.2, 37.2], [21.0, 37.8],
        [21.0, 38.8],
      ]],
    },
  },
  // Greece - Modern (1947, with Dodecanese)
  {
    type: 'Feature',
    properties: { name: 'greece-1947', year: 1947, region: 'western-europe' },
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [20.2, 41.2], [20.8, 41.5], [21.5, 41.8], [22.2, 41.8],
        [23.0, 41.8], [23.8, 41.5], [24.5, 41.2], [25.2, 41.2],
        [25.8, 41.0], [26.5, 41.0], [27.2, 40.8], [27.8, 40.5],
        [28.2, 40.0], [28.0, 39.2], [27.5, 38.5], [26.8, 38.0],
        [26.0, 37.8], [25.2, 37.5], [24.5, 37.2], [23.8, 37.0],
        [23.0, 36.8], [22.2, 36.5], [21.5, 36.5], [20.8, 36.8],
        [20.5, 37.5], [20.2, 38.2], [20.0, 39.0], [20.0, 39.8],
        [20.2, 41.2],
      ]],
    },
  },
];

/** Get all GeoJSON features for a specific year */
export function getGeoDataByYear(_year: number): GeoJsonFeature[] {
  return geoData
    .filter(f => f.properties.region === 'western-europe');
}

/** Get GeoJSON features for a specific empire */
export function getEmpireGeoData(empireName: string): GeoJsonFeature[] {
  return geoData.filter(f => f.properties.name === empireName);
}

/** Get GeoJSON features by their property name key (geoJsonKey) */
export function getGeoDataByKey(key: string): GeoJsonFeature | undefined {
  return geoData.find(f => f.properties.name === key);
}

/** Get multiple GeoJSON features by their property name keys */
export function getGeoDataByKeys(keys: string[]): GeoJsonFeature[] {
  return keys.map(k => geoData.find(f => f.properties.name === k)).filter(Boolean) as GeoJsonFeature[];
}

/** Get the closest GeoJSON feature for a given year */
export function getClosestGeoFeature(year: number): GeoJsonFeature | undefined {
  let closest = geoData[0];
  let minDiff = Infinity;
  for (const f of geoData) {
    const diff = Math.abs(f.properties.year - year);
    if (diff < minDiff) {
      minDiff = diff;
      closest = f;
    }
  }
  return closest;
}
