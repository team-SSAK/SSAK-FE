import MapView, { Marker } from "react-native-maps";

interface RestaurantLocationMapProps {
  latitude: number;
  longitude: number;
  title: string;
  description: string;
}

export default function RestaurantLocationMap({
  latitude,
  longitude,
  title,
  description,
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
    </MapView>
  );
}
