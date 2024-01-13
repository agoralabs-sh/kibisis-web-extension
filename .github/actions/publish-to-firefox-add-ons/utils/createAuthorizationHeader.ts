export default function createAuthorizationHeader(
  jwt: string
): Record<'Authorization', string> {
  return {
    Authorization: `JWT ${jwt}`,
  };
}
