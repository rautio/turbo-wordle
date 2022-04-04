const API_URL = "http://localhost:9001";

export const api = {
  get: (endpoint: string): Promise<any> =>
    new Promise((resolve, reject) =>
      // Remove leading slashes from endpoint
      fetch(`${API_URL}/${endpoint.replace(/^\/+/, "")}`)
        .then((res) => res.json())
        .then((res) => {
          if ("ok" in res && !res.ok) {
            throw new Error(res.statusText);
          } else {
            resolve(res);
          }
        })
        .catch((e) => {
          reject(e);
        })
    ),
};
export default api;
