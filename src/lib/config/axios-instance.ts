import axios from "axios";
import { env } from "../env";

const baseURL = `${env.NEXT_PUBLIC_APP_URL}/api`;

const api = axios.create({
  baseURL,
  withCredentials: true,
});

export default api;
