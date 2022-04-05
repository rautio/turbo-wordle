const API_URL = "https://turbo-words-api.herokuapp.com";

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
