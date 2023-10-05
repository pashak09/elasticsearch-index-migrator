# Elasticsearch Index Migration

This repository contains scripts for managing Elasticsearch index migrations using the `elasticsearch-index-migrator`
tool.

## Installation

```bash
yarn add elasticsearch-index-migrator
```

## Cli options

The `cli options` is used to configure and provide options for the Elasticsearch migration scripts. Below is a table
that describes each option:

| Property                 | Description                                                                                                      |
|--------------------------|------------------------------------------------------------------------------------------------------------------|
| `command`                | Specifies the command to be executed (e.g., `createEmptyMigration` or `runMigrations`).                          |
| `migrationsDir`          | Specifies the directory where migration files are stored.                                                        |
| `migrationName`          | Specifies the name of the new migration.                                                                         |
| `migrationFileExtension` | Specifies the file extension for migration files (e.g., `.js`, `.ts`).                                           |
| `filePatterns`           | An array of file patterns used to identify migration files within the `migrationsDir` (default: `*.js`, `*.ts`). |

Add these command to `package.json` file:

```json
"elasticsearch-create-migration": "node -r ts-node/register -r tsconfig-paths/register elasticsearch-index-migrator --command=createEmptyMigration --migrationsDir=./elasticsearch-migrations --migrationName=Test",
"elasticsearch-run-migrations": "node -r ts-node/register -r tsconfig-paths/register elasticsearch-index-migrator --command=runMigrations --migrationsDir=./elasticsearch-migrations"
```

This package uses these environment variables to pass Elasticsearch authorizations by default:

```ts
process.env.ELASTICSEARCH_NODE_URL;
process.env.ELASTICSEARCH_PASSWORD;
process.env.ELASTICSEARCH_USERNAME;
```
