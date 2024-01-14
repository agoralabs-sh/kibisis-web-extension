export default function createAuthorizationHeader(
  accessToken: string
): Record<'Authorization', string> {
  return {
    Authorization: `Bearer ${accessToken}`,
  };
}
