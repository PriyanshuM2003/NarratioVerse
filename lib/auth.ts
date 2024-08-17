export const getAccessToken = () => {
  return getAccessToken();
};

export const getRefreshToken = () => {
  return localStorage.getItem("refreshToken");
};

export const setTokens = (accessToken: any, refreshToken: any): void => {
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", refreshToken);
};

export const clearTokens = (): void => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
};
