import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

import useCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";
import Navigation from "./navigation";
import { ColorSchemeProvider } from "./components/ThemeContextProvider";
import Toast from "react-native-toast-message";
import { getToastConfig } from "./components/Themed";

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <ColorSchemeProvider>
        <SafeAreaProvider>
          <Navigation colorScheme={colorScheme} />
          <StatusBar style={colorScheme === "light" ? "dark" : "light"} />
          <Toast
            position="bottom"
            bottomOffset={100}
            visibilityTime={2500}
            config={getToastConfig(colorScheme)}
          ></Toast>
        </SafeAreaProvider>
      </ColorSchemeProvider>
    );
  }
}
