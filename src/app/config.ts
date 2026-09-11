const gatewayUrl = import.meta.env.VITE_GATEWAY_URL || 'http://localhost:5080';

export const GATEWAY_URL = gatewayUrl;

export const OIDC = {
  authority: GATEWAY_URL,
  clientId: import.meta.env.VITE_OIDC_CLIENT_ID || 'web-spa',
  redirectUri: `${window.location.origin}/callback`,
  postLogoutRedirectUri: `${window.location.origin}/`,
  scope: 'openid profile email roles offline_access',
};

export const API_BASE = GATEWAY_URL;