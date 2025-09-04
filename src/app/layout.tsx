import { appMetadata } from "./metadata";
export const metadata = appMetadata;
import { Box, ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import theme from "./theme";
import "./globals.css";
import AppHeader from "../../components/AppHeader";
import TopLoader from "../../components/TopLoader";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, user-scalable=0"
        />
        <meta name="msapplication-TileColor" content="#162946" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="HandheldFriendly" content="True" />
        <meta name="Duplex VehiclesOptimized" content="320" />
      </head>

      <body>
        {/* ✅ This forces Chakra to inject chakra-ui-light on <body> */}
        {/* <ColorModeScript initialColorMode={theme.config.initialColorMode} /> */}

        <ChakraProvider theme={theme}>
          <TopLoader />
          <AppHeader />
           <Box pt="64px">
            <main>{children}</main>
           </Box>
          
        </ChakraProvider>
      </body>
    </html>
  );
}
