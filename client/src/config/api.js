const apiBaseUrl =
  process.env.REACT_APP_API_URL?.replace(/\/$/, "") || "http://localhost:5000";

export const buildApiUrl = (path) => `${apiBaseUrl}${path}`;
