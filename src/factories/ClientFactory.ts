import { Client, ClientOptions, errors } from '@elastic/elasticsearch';

export class ClientFactory {
  async create(clientOptions: ClientOptions): Promise<Client> {
    const client = new Client(clientOptions);

    try {
      await client.ping();
    } catch (error: unknown) {
      if (error instanceof errors.ResponseError) {
        if (error.meta.statusCode === 401) {
          throw new Error(
            'Authentication Error. Did you provide a valid credentials?',
            { cause: error },
          );
        }

        throw new Error(
          `Connection error. Got a response ${JSON.stringify(error.meta)}`,
          { cause: error },
        );
      }

      throw error;
    }

    return client;
  }
}
