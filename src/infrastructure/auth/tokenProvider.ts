type UnauthorizedHandler = () => void;

const state = {
  accessToken: null as string | null,
  onUnauthorized: null as UnauthorizedHandler | null,
};

export const tokenProvider = {
  setAccessToken(token: string | null) {
    state.accessToken = token;
  },
  getAccessToken() {
    return state.accessToken;
  },
  setUnauthorizedHandler(handler: UnauthorizedHandler | null) {
    state.onUnauthorized = handler;
  },
  triggerUnauthorized() {
    state.onUnauthorized?.();
  },
};
