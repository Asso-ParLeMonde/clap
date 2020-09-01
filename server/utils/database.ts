import mysql from "mysql";
import path from "path";
import { Client } from "pg";
import { Connection, createConnection, ConnectionOptions, EntityManager } from "typeorm";

import { logger } from "./logger";
import { sleep } from "./utils";

const dbType = "postgres" as const;

const getDBConfig = (): ConnectionOptions => {
  let connectionOptions:
    | {
        database: string;
        host: string;
        password: string;
        port: number;
        type: "mariadb" | "postgres" | "mysql";
        username: string;
        extra: {
          ssl: boolean;
        };
      }
    | { type: "mariadb" | "postgres" | "mysql"; url: string };

  if (process.env.DATABASE_URL) {
    connectionOptions = {
      type: (process.env.DB_TYPE || dbType) as "mariadb" | "postgres" | "mysql",
      url: process.env.DATABASE_URL,
    };
  } else {
    connectionOptions = {
      database: process.env.DB_DB || process.env.DB_NAME || "PLMO",
      host: process.env.DB_HOST,
      password: process.env.DB_PASS,
      port: parseInt(process.env.DB_PORT || "5432", 10),
      type: (process.env.DB_TYPE || dbType) as "mariadb" | "postgres" | "mysql",
      username: process.env.DB_USER,
      extra: process.env.DB_SSL
        ? {
            ssl: true,
          }
        : { ssl: false },
    };
  }

  return {
    charset: "utf8mb4_unicode_ci",
    logging: true,
    entities: [path.join(__dirname, "../entities/*.js")],
    migrations: [path.join(__dirname, "../migration/**/*.js")],
    subscribers: [],
    synchronize: true,
    timezone: "utc",
    ...connectionOptions,
  };
};

function query(q: string, connection: mysql.Connection): Promise<void> {
  return new Promise((resolve, reject) => {
    connection.query(q, (error: Error) => {
      if (error) {
        reject(error);
        return;
      }
      resolve();
    });
  });
}

async function createMySQLDB(): Promise<void> {
  try {
    const connection = mysql.createConnection({
      charset: "utf8mb4_unicode_ci",
      host: process.env.DB_HOST,
      password: process.env.DB_PASS,
      timezone: "utc",
      user: process.env.DB_USER,
    });

    await query("CREATE DATABASE IF NOT EXISTS PLMO CHARACTER SET = 'utf8mb4' COLLATE = 'utf8mb4_unicode_ci';", connection);
    logger.info("Database PLMO created!");
  } catch (e) {
    logger.error(e);
  }
}

async function createPostgresDB(): Promise<void> {
  let connectionData:
    | {
        connectionString: string;
      }
    | {
        host: string;
        user: string;
        password: string;
        database: string;
      };
  let dbName: string;
  if (process.env.DATABASE_URL) {
    const url_parts = process.env.DATABASE_URL.split("/");
    dbName = url_parts.pop();
    url_parts.push("postgres");
    connectionData = {
      connectionString: url_parts.join("/"),
    };
  } else {
    dbName = process.env.DB_DB || process.env.DB_NAME;
    connectionData = {
      host: process.env.DB_HOST,
      password: process.env.DB_PASS,
      user: process.env.DB_USER,
      database: "postgres",
    };
  }
  const client = new Client(connectionData);
  await client.connect();
  await client.query(`CREATE DATABASE ${dbName};`);
  logger.info(`Database ${dbName} created!`);
  await client.end();
}

async function createSequences(connection: Connection): Promise<void> {
  await connection.transaction(async (manager: EntityManager) => {
    await manager.query(`CREATE SEQUENCE IF NOT EXISTS SCENARIO_SEQUENCE START WITH 1 INCREMENT BY 1`);
  });
}

export async function connectToDatabase(tries: number = 10): Promise<Connection | null> {
  if (tries === 0) {
    return null;
  }
  let connection: Connection | null = null;
  try {
    connection = await createConnection(getDBConfig());
  } catch (e) {
    if ((e.message || "").split(":")[0] === "ER_BAD_DB_ERROR") {
      await createMySQLDB();
    } else if (e.code && e.code === "3D000") {
      try {
        await createPostgresDB();
      } catch (e2) {
        logger.info("Could not create database...");
        return null;
      }
    } else {
      logger.info(e);
      logger.info("Could not connect to database. Retry in 10 seconds...");
      await sleep(10000);
    }
    connection = await connectToDatabase(tries - 1);
  }
  if (connection !== null) {
    await createSequences(connection);
  }
  return connection;
}
