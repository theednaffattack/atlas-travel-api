# Dead Package Json blah blah

## Old package scripts

```json

    "drop-test-db": "ts-node -r dotenv/config src/utility.drop-test-database.ts",
    "seed-db": "yarn drop-test-db && ts-node -r dotenv/config src/utility.prepare-database",
```