import { decodeSession, isWebRoleAllowed } from "./session";

const LOGIN_PATH = "/login";
const HOME_PATH = "/dashboard";

/**
 * Returns the path to redirect to, or null to allow the request through.
 * `pathname` is the request path; `cookieValue` is the raw session cookie.
 */
export function decideRedirect(pathname: string, cookieValue: string | undefined): string | null {
  const session = decodeSession(cookieValue);
  const authed = session !== null && isWebRoleAllowed(session.role);
  const onLogin = pathname === LOGIN_PATH;

  if (onLogin) {
    return authed ? HOME_PATH : null;
  }
  // every non-login path under the matcher is protected
  return authed ? null : LOGIN_PATH;
}
