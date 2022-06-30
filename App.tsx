import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

import AssetsProvider from "./Provider/Assets";
import { getToastConfig } from "./components/Themed";
import useCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";
import { useStatusBarStyle } from "./hooks/useStatusBarStyle";
import Navigation from "./navigation";

import LayoutProvider from "@/Provider/Layout";
import ThemeProvider from "@/Provider/Theme";

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();
  const statusBarStyle = useStatusBarStyle();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <ThemeProvider>
        <LayoutProvider>
          <AssetsProvider>
            <SafeAreaProvider>
              <Navigation colorScheme={colorScheme} />
              <StatusBar style={statusBarStyle} />
              <Toast
                position="bottom"
                bottomOffset={100}
                visibilityTime={2500}
                config={getToastConfig(colorScheme)}
              />
            </SafeAreaProvider>
          </AssetsProvider>
        </LayoutProvider>
      </ThemeProvider>
    );
  }
}
