export const AUTH_STORAGE_KEY = "hiresmart_auth";

export const getStoredAuth = () => {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const rawAuth = window.localStorage.getItem(AUTH_STORAGE_KEY);

    if (!rawAuth) {
      return null;
    }

    const parsed = JSON.parse(rawAuth);

    if (!parsed?.accessToken || !parsed?.user?.id) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
};

export const setStoredAuth = ({ user, accessToken }) => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ user, accessToken }));
};

export const clearStoredAuth = () => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(AUTH_STORAGE_KEY);
};

export const getStoredAccessToken = () => getStoredAuth()?.accessToken || "";

export const updateStoredUser = (updates) => {
  const stored = getStoredAuth();

  if (!stored) {
    return null;
  }

  const nextAuth = {
    ...stored,
    user: {
      ...stored.user,
      ...updates
    }
  };

  setStoredAuth(nextAuth);
  return nextAuth.user;
};
