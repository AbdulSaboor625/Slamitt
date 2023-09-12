import API from "./apiServices";

export const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

const Api = new API({
  baseUrl: baseUrl,
});

export default Api;
