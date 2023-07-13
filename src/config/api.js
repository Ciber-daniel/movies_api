const axios = require("axios");

const api = axios.create({
  baseURL: process.env.API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

api.interceptors.request.use(function (config) {
  config.params = { ...config.params, api_key: process.env.API_KEY };
  return config;
});

module.exports = api;
