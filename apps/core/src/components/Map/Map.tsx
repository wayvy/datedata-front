import { useCallback, useEffect, useRef, useState } from 'react';
import MapLibre, { MapMouseEvent, MapRef, Marker, NavigationControl } from 'react-map-gl/maplibre';

import 'maplibre-gl/dist/maplibre-gl.css';

const useCurrentPosition = () => {
  const [position, setPosition] = useState<GeolocationPosition | null>(null);
  const [error, setError] = useState<GeolocationPositionError | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const getCurrentPosition = useCallback(() => {
    if (navigator.geolocation) {
      setIsLoading(true);

      navigator.geolocation.getCurrentPosition(
        (geoPosition) => {
          setPosition(geoPosition);
          setIsLoading(false);
        },
        (error) => {
          setError(error);
          setIsLoading(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        },
      );
    }
  }, []);

  useEffect(() => {
    getCurrentPosition();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    isLoading,
    position,
    error,
  };
};

const getGeoData = async (latitude: number, longitude: number) => {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
  );
  const data = await response.json();

  return data;
};

const MARKER_DEFAULT = { latitude: 51.5007, longitude: -0.1246 };

const Map: React.FC = () => {
  const mapRef = useRef<MapRef | null>(null);

  const [marker, setMarker] = useState(MARKER_DEFAULT);
  const handleSetMarker = useCallback(({ latitude, longitude }: { latitude: number; longitude: number }) => {
    setMarker({
      latitude,
      longitude,
    });

    mapRef.current?.flyTo({
      center: [longitude, latitude],
    });
  }, []);

  const [markerGeoData, setMarkerGeoData] = useState<any>(null);

  useEffect(() => {
    if (marker !== MARKER_DEFAULT) {
      getGeoData(marker.latitude, marker.longitude).then((data) => {
        setMarkerGeoData(data);
      });
    }
  }, [marker]);

  const { position } = useCurrentPosition();

  useEffect(() => {
    if (position) {
      handleSetMarker({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    }
  }, [handleSetMarker, position]);

  const handleMapClick = useCallback(
    (event: MapMouseEvent) => {
      const { lngLat } = event;

      handleSetMarker({
        latitude: lngLat.lat,
        longitude: lngLat.lng,
      });
    },
    [handleSetMarker],
  );

  const setRef = (node: MapRef | null) => {
    if (node !== null && mapRef.current === null) {
      mapRef.current = node;
      node.jumpTo({
        center: [marker.longitude, marker.latitude],
      });
    }
  };

  return (
    <div>
      <MapLibre
        ref={setRef}
        initialViewState={{
          longitude: 37.6173,
          latitude: 55.7558,
          zoom: 10,
        }}
        onClick={handleMapClick}
        mapLib={import('maplibre-gl')}
        style={{ width: '100%', height: '300px' }}
        mapStyle={{
          version: 8,
          sources: {
            'osm-tiles': {
              type: 'raster',
              tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
              tileSize: 300,
              attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            },
          },
          layers: [
            {
              id: 'osm-tiles-layer',
              type: 'raster',
              source: 'osm-tiles',
            },
          ],
        }}
      >
        <Marker latitude={marker.latitude} longitude={marker.longitude}>
          <div style={{ cursor: 'pointer', color: 'red', fontSize: '20px' }}>📍</div>
        </Marker>

        <NavigationControl position="top-left" />
      </MapLibre>
      <div>
        {marker.latitude.toFixed(4)}, {marker.longitude.toFixed(4)}
      </div>
      <div>{markerGeoData?.display_name}</div>
    </div>
  );
};

export default Map;
