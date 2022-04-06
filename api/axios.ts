import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import qs from "qs";

const http = axios.create({
  baseURL: "http://bog.ac/",
});

const reqInterceptor = async (config: any) => {
  const cookie = await AsyncStorage.getItem("cookie");
  if (cookie) {
    config.headers.cookie = `${cookie}`;
  }
  if (config.data) {
    config.data = qs.stringify(config.data, {
      arrayFormat: "brackets",
    });
  }
  return config;
};

// Add a request interceptor
http.interceptors.request.use(reqInterceptor, (error) => Promise.reject(error));

// Add a response interceptor
// http.interceptors.response.use((response) => response.data, resInterceptor);

export default http;
