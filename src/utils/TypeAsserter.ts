export function assertIsString(value: unknown): asserts value is string {
  if (typeof value !== 'string' && !(value instanceof String)) {
    throw new Error(`Expected a string, got: ${value}`);
  }
}
