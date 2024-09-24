/**
 * Convenience function simply serializes a value by stringifying it then using `JSON.parse()` to reform the value.
 *
 * NOTE: useful to deep copy an object for mutating immutable values.
 * @param {unkown} value - the value to serialize.
 * @returns {unknown} the serilaized value.
 */
export default function serialize<Type = unknown>(value: Type): Type {
  return JSON.parse(JSON.stringify(value));
}
