import MapView, { Marker } from "react-native-maps";

interface RestaurantMarker {
  id: number;
  latitude: number;
  longitude: number;
  title: string;
}

interface RestaurantLocationMapProps {
  latitude: number;
  longitude: number;
  title: string;
  description: string;
  restaurantMarkers?: RestaurantMarker[];
  userLocation?: { latitude: number; longitude: number };
}

export default function RestaurantLocationMap({
  latitude,
  longitude,
  title,
  description,
  restaurantMarkers,
  userLocation,
}: RestaurantLocationMapProps) {
  return (
    <MapView
      style={{ flex: 1 }}
      initialRegion={{
        latitude,
        longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }}
      region={{
        latitude,
        longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }}
    >
      <Marker
        coordinate={{ latitude, longitude }}
        title={title}
        description={description}
      />

      {restaurantMarkers?.map((marker) => (
        <Marker
          key={marker.id}
          coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
          title={marker.title}
          pinColor="green"
        />
      ))}

      {userLocation && (
        <Marker
          coordinate={userLocation}
          title="내 위치"
          pinColor="blue"
        />
      )}
    </MapView>
  );
}
