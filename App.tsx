import React, { useState } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import {
  Animated as AnimatedMap,
  AnimatedRegion,
  Marker,
} from "react-native-maps";
import PriceMarker from "./PriceMarker";

const screen = Dimensions.get("window");

const ASPECT_RATIO = screen.width / screen.height;

const LATITUDE = 37.78825;
const LONGITUDE = -122.4324;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const markers = [
  {
    id: 0,
    amount: 99,
    coordinate: {
      latitude: LATITUDE,
      longitude: LONGITUDE,
    },
  },
  {
    id: 1,
    amount: 199,
    coordinate: {
      latitude: LATITUDE + 0.004,
      longitude: LONGITUDE - 0.004,
    },
  },
  {
    id: 2,
    amount: 285,
    coordinate: {
      latitude: LATITUDE - 0.004,
      longitude: LONGITUDE - 0.004,
    },
  },
];

const App = () => {
  const [selectedHotel, setSelectedHotel] = useState(0);

  const region = new AnimatedRegion({
    latitude: LATITUDE,
    longitude: LONGITUDE,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  });

  return (
    <View style={styles.container}>
      <AnimatedMap
        //   provider={this.props.provider}
        style={styles.map}
        region={region}
      >
        {markers.map((marker: any, i: any) => {
          return (
            <Marker
              key={marker.id}
              coordinate={marker.coordinate}
              onPress={() => {
                setSelectedHotel(i);
              }}
            >
              <PriceMarker
                style={{
                  opacity: 1,
                  transform: [{ scale: 1 }],
                }}
                amount={marker.amount}
                selected={marker.id === selectedHotel}
              />
            </Marker>
          );
        })}
      </AnimatedMap>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  map: {
    backgroundColor: "transparent",
    ...StyleSheet.absoluteFillObject,
  },
});

export default App;
