export default function isValidJwt(
  header: string | null,
  payload: string | null
): boolean {
  let serializedHeader: Record<string, string>;
  let serializedPayload: Record<string, string>;

  if (!header || !payload) {
    return false;
  }

  try {
    serializedHeader = JSON.parse(header);

    // check the header only contains the algorithm and type properties
    if (
      Object.keys(serializedHeader).find(
        (value) => value !== 'alg' && value !== 'typ'
      )
    ) {
      return false;
    }

    // check the algorithm and type properties conform to the sign data expected values
    if (
      serializedHeader['alg'] !== 'ES256' ||
      serializedHeader['typ'] !== 'JWT'
    ) {
      return false;
    }

    serializedPayload = JSON.parse(payload);

    return true;
  } catch (error) {
    return false;
  }
}
