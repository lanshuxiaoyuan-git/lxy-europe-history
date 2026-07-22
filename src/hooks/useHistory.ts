import { useMemo } from 'react';
import { eras } from '../data/eras';
import { events } from '../data/events';
import { countries } from '../data/countries';
import { empires } from '../data/empires';
import { comparisonPoints } from '../data/comparison';
import { geoData, getGeoDataByKeys } from '../data/geo-data/western-europe';
import type { Era, HistoryEvent, Country, Empire, GeoJsonFeature, ComparisonPoint, Region } from '../data/types';

export function useEras(region?: Region): Era[] {
  return useMemo(() => {
    if (!region) return eras;
    return eras.filter(e => e.region === region);
  }, [region]);
}

export function useEvents(region?: Region, filter?: { category?: string; yearRange?: [number, number] }): HistoryEvent[] {
  return useMemo(() => {
    let filtered = events;
    if (region) filtered = filtered.filter(e => e.region === region);
    if (filter?.category) filtered = filtered.filter(e => e.category === filter.category);
    if (filter?.yearRange) {
      filtered = filtered.filter(e => e.year >= filter.yearRange![0] && e.year <= filter.yearRange![1]);
    }
    return filtered.sort((a, b) => a.year - b.year);
  }, [region, filter]);
}

export function useCountries(region?: Region): Country[] {
  return useMemo(() => {
    if (!region) return countries;
    return countries.filter(c => c.region === region);
  }, [region]);
}

export function useEmpires(region?: Region): Empire[] {
  return useMemo(() => {
    if (!region) return empires;
    return empires.filter(e => e.region === region);
  }, [region]);
}

export function useCountry(id: string): Country | undefined {
  return useMemo(() => countries.find(c => c.id === id), [id]);
}

export function useEmpire(id: string): Empire | undefined {
  return useMemo(() => empires.find(e => e.id === id), [id]);
}

export function useEvent(id: string): HistoryEvent | undefined {
  return useMemo(() => events.find(e => e.id === id), [id]);
}

export function useEra(id: string): Era | undefined {
  return useMemo(() => eras.find(e => e.id === id), [id]);
}

export function useGeoData(region?: Region): GeoJsonFeature[] {
  return useMemo(() => {
    if (!region) return geoData;
    return geoData.filter(g => g.properties.region === region);
  }, [region]);
}

export function useComparisonPoints(): ComparisonPoint[] {
  return comparisonPoints;
}

export function useEventsByYear(year: number, region?: Region): HistoryEvent[] {
  return useMemo(() => {
    let filtered = events.filter(e => e.year === year);
    if (region) filtered = filtered.filter(e => e.region === region);
    return filtered;
  }, [year, region]);
}

export function useEventsInRange(startYear: number, endYear: number, region?: Region): HistoryEvent[] {
  return useMemo(() => {
    let filtered = events.filter(e => e.year >= startYear && e.year <= endYear);
    if (region) filtered = filtered.filter(e => e.region === region);
    return filtered.sort((a, b) => a.year - b.year);
  }, [startYear, endYear, region]);
}

export function useCountryTerritories(country: Country | undefined): { entry: Country['territoryEvolution'][number]; geoJson: GeoJsonFeature }[] {
  return useMemo(() => {
    if (!country || !country.territoryEvolution.length) return [];
    const keys = country.territoryEvolution.map(e => e.geoJsonKey);
    const features = getGeoDataByKeys(keys);
    return country.territoryEvolution
      .map(entry => {
        const geoJson = features.find(f => f.properties.name === entry.geoJsonKey);
        return geoJson ? { entry, geoJson } : null;
      })
      .filter(Boolean) as { entry: Country['territoryEvolution'][number]; geoJson: GeoJsonFeature }[];
  }, [country]);
}

export function formatYear(year: number): string {
  if (year < 0) return `${Math.abs(year)} BC`;
  return `${year} AD`;
}
