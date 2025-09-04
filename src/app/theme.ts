"use client";

import { extendTheme, ThemeConfig } from "@chakra-ui/react";

const config: ThemeConfig = {
  initialColorMode: "light",
  useSystemColorMode: false,
};

const theme = extendTheme({
  config,
  styles: {
    global: {
      "html, body": {
        padding: 0,
        margin: 0,
        fontFamily: "Inter, system-ui, sans-serif",
        bg: "gray",
        color: "gray.800",
        lineHeight: "tall",
      },
      a: {
        color: "teal.500",
        _hover: {
          textDecoration: "underline",
        },
      },
    },
  },
  colors: {
    brand: {
      50: "#ffe5e5",
      100: "#fbb5b5",
      200: "#f98585",
      300: "#f65555",
      400: "#f32525",
      500: "#e72a1a", // Main theme color
      600: "#b02015",
      700: "#7a160f",
      800: "#440c09",
      900: "#1a0202",
    },
  },
});

export default theme;
