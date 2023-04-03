export default function isValidJwt(
  header: string | null,
  payload: string | null
): boolean {
  let serializedHeader: Record<string, string>;

  if (!header || !payload) {
    return false;
  }

  try {
    serializedHeader = JSON.parse(header);

    // check the algorithm and type properties conform to the sign data expected values
    if (serializedHeader['typ'] !== 'JWT') {
      return false;
    }

    JSON.parse(payload);

    return true;
  } catch (error) {
    return false;
  }
}
