import React, { useEffect, useRef } from "react";
import { StyleSheet, Text, Animated } from "react-native";

const AnimatedPriceMarker = (props: any) => {
  const { amount, selected, style } = props;
  const selectedAnim = useRef(new Animated.Value(0)).current;
  let animation = Animated.loop(
    Animated.sequence([
      Animated.timing(selectedAnim, {
        toValue: 4,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(selectedAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ])
  );

  useEffect(() => {
    if (selected) {
      animation.start();
    } else {
      animation.stop();
    }
  }, [selected]);
  const background = selected ? "#d25000" : "#ed9042";

  return (
    <Animated.View
      style={[
        styles.container,
        style,
        {
          transform: [{ translateY: selectedAnim }],
        },
        {
          zIndex: selected ? 200 : 1,
        },
      ]}
    >
      <Animated.View
        style={[
          styles.bubble,
          {
            backgroundColor: background,
          },
        ]}
      >
        <Text style={styles.dollar}>£</Text>
        <Text
          style={[
            styles.amount,
            {
              fontWeight: selected ? "bold" : "normal",
            },
          ]}
        >
          {amount}
        </Text>
      </Animated.View>
      <Animated.View
        style={[styles.arrowBorder, { borderTopColor: "#d25000" }]}
      />
      <Animated.View style={[styles.arrow, { borderTopColor: background }]} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    alignSelf: "flex-start",
  },
  bubble: {
    flex: 0,
    flexDirection: "row",
    alignSelf: "flex-start",
    backgroundColor: "#FF5A5F",
    paddingVertical: 2,
    paddingHorizontal: 4,
    borderRadius: 3,
    borderColor: "#D23F44",
    borderWidth: 0.5,
  },
  dollar: {
    color: "#fff",
    fontSize: 10,
  },
  amount: {
    color: "#fff",
    fontSize: 13,
  },
  arrow: {
    backgroundColor: "transparent",
    borderColor: "transparent",
    borderWidth: 4,
    borderTopColor: "#FF5A5F",
    alignSelf: "center",
    marginTop: -9,
  },
  arrowBorder: {
    backgroundColor: "transparent",
    borderColor: "transparent",
    borderWidth: 4,
    borderTopColor: "#D23F44",
    alignSelf: "center",
    marginTop: -0.5,
  },
  selectedBubble: {
    backgroundColor: "#4da2ab",
    borderColor: "#007a87",
  },
  selectedArrow: {
    borderTopColor: "#4da2ab",
  },
  selectedArrowBorder: {
    borderTopColor: "#007a87",
  },
});

export default AnimatedPriceMarker;
