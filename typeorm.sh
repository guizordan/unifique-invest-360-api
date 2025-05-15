#!/bin/bash

# --- Configuration ---
TYPEORM_CLI="./node_modules/typeorm/cli-ts-node-commonjs.js"
DOTENV_CONFIG="-r dotenv/config"
MIGRATIONS_DIR="src/infra/database/migrations"
DATA_SOURCE="src/infra/database/dataSource.ts"

# --- Functions ---

create_migration() {
  if [ -z "$1" ]; then
    echo "Error: Please provide a migration name."
    echo "Usage: $0 create <MigrationName>"
    return 1
  fi

  MIGRATION_NAME="$1"
  CREATE_COMMAND="$TYPEORM_CLI migration:create $MIGRATIONS_DIR/$MIGRATION_NAME"

  echo "Creating migration: $MIGRATION_NAME in $MIGRATIONS_DIR"
  if $TYPEORM_CLI migration:create $MIGRATIONS_DIR/$MIGRATION_NAME; then
    echo "Migration '$MIGRATION_NAME' created successfully in $MIGRATIONS_DIR"
  else
    echo "Error creating migration '$MIGRATION_NAME'."
    return 1
  fi
}

run_migrations() {
  echo "Running migrations..."
  if $TYPEORM_CLI migration:run --dataSource="$DATA_SOURCE"; then
    echo "Migrations completed successfully."
  else
    echo "Error running migrations."
    return 1
  fi
}

# --- Main Script ---

COMMAND="$1"

case "$COMMAND" in
  create)
    create_migration "$2"
    ;;
  run)
    run_migrations
    ;;
  *)
    echo "Usage: $0 <command> [migration_name]"
    echo "Commands: create <MigrationName>, run"
    exit 1
    ;;
esac

exit 0