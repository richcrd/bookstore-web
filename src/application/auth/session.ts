import type { User } from "oidc-client-ts";
import type { SessionUser } from "../../domain/models";
import { customerIdFromSub } from "../../shared/lib/identity";

export function toSessionUser(user: User): SessionUser {
  const role = user.profile.role;
  const roles = Array.isArray(role) ? role : role ? [role] : [];
  const sub = user.profile.sub ?? '';

  return {
    sub,
    name: (user.profile.name as string | undefined) ?? sub,
    roles,
    customerId: customerIdFromSub(sub),
    accessToken: user.access_token ?? null,
  };
}
