import { ClientOptions } from '@elastic/elasticsearch';
import { ClientOptionsValidator } from '@lib/options/ClientOptionsValidator';

export interface ClientOptionsProvider {
  provide(): Promise<ClientOptions>;
}

export class ProcessEnvClientOptionsProvider implements ClientOptionsProvider {
  constructor(
    private readonly clientOptionsValidator: ClientOptionsValidator,
  ) {}

  async provide(): Promise<ClientOptions> {
    const options: Record<string, unknown> = {
      nodeUrl: process.env.ELASTICSEARCH_NODE_URL,
      password: process.env.ELASTICSEARCH_PASSWORD,
      username: process.env.ELASTICSEARCH_USERNAME,
    };

    this.clientOptionsValidator.validate(options);

    return {
      auth: {
        username: options.username,
        password: options.password,
      },
      node: options.nodeUrl,
      sniffOnStart: true,
      sniffInterval: 300,
    };
  }
}
