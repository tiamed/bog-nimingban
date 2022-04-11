import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

import { ColorSchemeProvider } from "./components/ThemeContextProvider";
import { getToastConfig } from "./components/Themed";
import useCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";
import Navigation from "./navigation";
import { checkUpdate } from "./tasks/checkAppUpdate";

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  useEffect(() => {
    checkUpdate();
  }, []);

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
          />
        </SafeAreaProvider>
      </ColorSchemeProvider>
    );
  }
}
