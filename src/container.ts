import { Client } from '@elastic/elasticsearch';
import { Command } from '@lib/commands';
import { ClientFactory } from '@lib/factories/ClientFactory';
import { FileLoader } from '@lib/FileLoader';
import { indexesMap } from '@lib/indexes';
import { MigrationSaver } from '@lib/migrations/MigrationSaver';
import { MigrationsExecutor } from '@lib/migrations/MigrationsExecutor';
import { MigrationsProvider } from '@lib/migrations/MigrationsProvider';
import { MigrationsSorter } from '@lib/migrations/MigrationsSorter';
import { Sifter } from '@lib/migrations/Sifter';
import { Migrator } from '@lib/Migrator';
import { ClientOptionsValidator } from '@lib/options/ClientOptionsValidator';
import { ProcessEnvClientOptionsProvider } from '@lib/options/ProcessEnvClientOptionsProvider';
import { ExecutedMigrationRepository } from '@lib/repositories/ExecutedMigrationRepository';
import { Runner } from '@lib/Runner';
import { IndexCreator } from '@lib/services/IndexCreator';
import { IndexMapper } from '@lib/services/IndexMapper';
import { IndexNameResolver } from '@lib/services/IndexNameResolver';
import { Logger, LoggerInterface, LogLevel } from '@lib/services/Logger';
import { MigrationNameParser } from '@lib/services/MigrationNameParser';

type Type<T = never> = new (...args: never[]) => T;

export type Options = {
  readonly command: Command;
  readonly migrationsDir: string;
  readonly filePatterns: readonly string[];
  readonly migrationName: string | undefined;
  readonly migrationFileExtension: string | undefined;
};

export class Container {
  private services: Map<string, unknown> = new Map<string, unknown>();

  useLogger(logger: LoggerInterface): void {
    this.registerService(Logger, logger);
  }

  async init(cliOptions: Options): Promise<Container> {
    const fileLoader = new FileLoader();

    this.registerService(FileLoader, fileLoader);

    const logger = new Logger(LogLevel.INFO);

    this.registerService(Logger, logger);

    const migrationNameParser = new MigrationNameParser();

    this.registerService(MigrationNameParser, migrationNameParser);

    const sifter = new Sifter();

    this.registerService(Sifter, sifter);

    const migrationsProvider = new MigrationsProvider(
      fileLoader,
      sifter,
      migrationNameParser,
      cliOptions,
    );

    this.registerService(MigrationsProvider, migrationsProvider);

    const indexNameResolver = new IndexNameResolver();

    this.registerService(IndexNameResolver, indexNameResolver);

    const indexMapper = new IndexMapper(indexesMap);

    this.registerService(IndexMapper, indexMapper);

    const clientOptionsValidator = new ClientOptionsValidator();

    this.registerService(ClientOptionsValidator, clientOptionsValidator);

    const clientFactory = new ClientFactory();

    this.registerService(ClientFactory, clientFactory);

    const processEnvClientOptionsProvider = new ProcessEnvClientOptionsProvider(
      clientOptionsValidator,
    );

    this.registerService(
      ProcessEnvClientOptionsProvider,
      processEnvClientOptionsProvider,
    );

    const elasticsearchClient = await clientFactory.create(
      await processEnvClientOptionsProvider.provide(),
    );

    this.registerService(Client, elasticsearchClient);

    const executedMigrationRepository = new ExecutedMigrationRepository(
      elasticsearchClient,
      indexNameResolver,
    );

    this.registerService(
      ExecutedMigrationRepository,
      executedMigrationRepository,
    );

    const indexCreator = new IndexCreator(
      indexMapper,
      indexNameResolver,
      elasticsearchClient,
    );

    this.registerService(IndexCreator, indexCreator);

    const migrationSaver = new MigrationSaver(
      elasticsearchClient,
      indexNameResolver,
      migrationNameParser,
    );

    this.registerService(MigrationSaver, migrationSaver);

    const migrationsSorter = new MigrationsSorter(
      executedMigrationRepository,
      migrationNameParser,
    );

    this.registerService(MigrationsSorter, migrationsSorter);

    const migrationsExecutor = new MigrationsExecutor(
      migrationSaver,
      migrationsSorter,
      elasticsearchClient,
      logger,
    );

    this.registerService(MigrationsExecutor, migrationsExecutor);

    const runner = new Runner(
      indexCreator,
      logger,
      executedMigrationRepository,
      migrationsExecutor,
    );

    this.registerService(Runner, runner);

    const migrator = new Migrator(migrationsProvider, runner);

    this.registerService(Migrator, migrator);

    return this;
  }

  private registerService<TInput = unknown>(
    service: Type<TInput> | string,
    value: unknown,
  ): void {
    this.services.set(service.toString(), value);
  }

  getService<TInput = unknown, TResult = TInput>(
    typeOrToken: Type<TInput> | string,
  ): TResult {
    return <TResult>this.services.get(typeOrToken.toString());
  }
}
