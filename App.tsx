import React, { useEffect, useRef, useState } from "react";
import { Dimensions, Image, StyleSheet, Text, View } from "react-native";
import {
  Animated as AnimatedMap,
  AnimatedRegion,
  Marker,
} from "react-native-maps";
import PriceMarker from "./PriceMarker";
import Carousel, { ICarouselInstance } from "react-native-reanimated-carousel";
import { createApi } from "unsplash-js";
import "react-native-url-polyfill/auto";
import { faker } from "@faker-js/faker";
import { FontAwesome } from "@expo/vector-icons";

const screen = Dimensions.get("window");

const ASPECT_RATIO = screen.width / screen.height;

const LATITUDE = 37.78825;
const LONGITUDE = -122.4324;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const unsplash = createApi({
  accessKey: "4rG0ykgXMDJCUM29I-O1iPkKoVjjgN_gHHuP4MiigKo",
});

const randomIntFromInterval = (min: number, max: number) => {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const randomFloatFromInterval = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min) + 10000) / 10000;
};

const markers = [
  {
    id: 0,
    amount: 99,
    coordinate: {
      latitude: LATITUDE,
      longitude: LONGITUDE,
    },
    name: "Grand Central Hotel",
  },
  {
    id: 1,
    amount: 199,
    coordinate: {
      latitude: LATITUDE + 0.004,
      longitude: LONGITUDE - 0.004,
    },
    name: "Grand Middle Hotel",
  },
  {
    id: 2,
    amount: 285,
    coordinate: {
      latitude: LATITUDE - 0.004,
      longitude: LONGITUDE - 0.004,
    },
    name: "Central Hotel",
  },
];

const App = () => {
  const [selectedHotel, setSelectedHotel] = useState(0);
  const [markers, setMarkers] = useState<
    {
      image: string;
      id: number;
      name: string;
      stars: number;
      amount: number;
      coordinate: { latitude: number; longitude: number };
    }[]
  >([]);
  const carouselRef = useRef<ICarouselInstance>(null);
  useEffect(() => {
    const run = async () => {
      const photos = await unsplash.search.getPhotos({
        query: "hotel room",
        page: 1,
        perPage: 10,
        orientation: "landscape",
      });

      const newMarkers = photos.response?.results.map((result, index) => ({
        image: result.urls.regular,
        id: index,
        name: faker.location.city() + " Hotel",
        stars: randomIntFromInterval(1, 5),
        amount: randomIntFromInterval(50, 800),
        coordinate: {
          latitude: faker.location.latitude({
            min: LATITUDE - 0.004,
            max: LATITUDE + 0.004,
          }),
          longitude: faker.location.longitude({
            min: LONGITUDE - 0.004,
            max: LONGITUDE + 0.004,
          }),
        },
      }));
      setMarkers(newMarkers ?? []);
    };
    run();
  }, []);

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
          const selected = marker.id === selectedHotel;

          return (
            <Marker
              key={marker.id}
              coordinate={marker.coordinate}
              onPress={() => {
                setSelectedHotel(i);
                carouselRef.current?.scrollTo({ index: i, animated: true });
              }}
            >
              <PriceMarker
                style={{
                  opacity: 1,
                  transform: [{ scale: 1 }],
                }}
                amount={marker.amount}
                selected={selected}
              />
            </Marker>
          );
        })}
      </AnimatedMap>
      <View style={{ flex: 1 }}>
        <Carousel
          ref={carouselRef}
          width={screen.width}
          data={markers}
          scrollAnimationDuration={600}
          onSnapToItem={(index) => setSelectedHotel(index)}
          defaultIndex={selectedHotel}
          mode="parallax"
          renderItem={({ index, item }) => (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                borderRadius: 6,
                backgroundColor: "#FFFFFF",
                shadowColor: "#D25000",
                shadowOffset: {
                  width: 5,
                  height: 5,
                },
                shadowOpacity: 0.3,
                shadowRadius: 7,
                elevation: 8,
              }}
            >
              <Image
                source={{ uri: item.image }}
                style={{
                  width: "100%",
                  flex: 2,
                  borderTopLeftRadius: 6,
                  borderTopRightRadius: 6,
                }}
              />
              <View
                style={{
                  position: "absolute",
                  right: 0,
                  top: 20,
                  backgroundColor: "#faaf3e",
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                }}
              >
                <Text
                  style={{ fontSize: 20, fontWeight: "bold", color: "#FFFFFF" }}
                >{`£ ${item.amount}`}</Text>
              </View>
              <View style={{ flex: 1, padding: 12 }}>
                <View>
                  <View style={{ display: "flex", flexDirection: "row" }}>
                    {[...Array(item.stars).keys()].map((val) => (
                      <FontAwesome
                        key={`star-${val}-${index}`}
                        name="star"
                        size={24}
                        color="#faaf3e"
                        style={{ marginRight: 4 }}
                      />
                    ))}
                  </View>
                </View>
                <Text style={{ fontSize: 24, fontWeight: "bold" }}>
                  {item.name}
                </Text>
              </View>
            </View>
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  map: {
    backgroundColor: "transparent",
    width: "100%",
    height: "70%",
  },
});

export default App;
