import { UserManager, type User } from "oidc-client-ts";
import { OIDC } from "../../app/config";

export const userManager = new UserManager({
  authority: OIDC.authority,
  client_id: OIDC.clientId,
  redirect_uri: OIDC.redirectUri,
  post_logout_redirect_uri: OIDC.postLogoutRedirectUri,
  response_type: 'code',
  scope: OIDC.scope,
  automaticSilentRenew: true,
  silent_redirect_uri: OIDC.redirectUri,
  includeIdTokenInSilentRenew: true,
  loadUserInfo: false,
  checkSessionIntervalInSeconds: 300,
});

export type { User };
