export type BaseClientOptions = Readonly<{
  username: string;
  password: string;
  nodeUrl: string;
}>;

export class ClientOptionsValidator {
  /**
   * @throws Error
   */
  validate(
    options: Record<string, unknown>,
  ): asserts options is BaseClientOptions {
    if (typeof options.username !== 'string') {
      throw new Error(`username expected to be a string`);
    }

    if (typeof options.password !== 'string') {
      throw new Error(`password expected to be a string`);
    }

    if (typeof options.nodeUrl !== 'string') {
      throw new Error(`node expected to be a string`);
    }
  }
}
