import { MigrationsProvider } from '@lib/migrations/MigrationsProvider';
import { Runner } from '@lib/Runner';

export class Migrator {
  constructor(
    private readonly migrationsProvider: MigrationsProvider,
    private readonly runner: Runner,
  ) {}

  async execute(): Promise<void> {
    const migrations = await this.migrationsProvider.provide();

    await this.runner.run(migrations);
  }
}
