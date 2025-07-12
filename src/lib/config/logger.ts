import { blue, green, magenta, red, yellow } from "colorette";
import * as sourceMapSupport from "source-map-support";
import util from "util";
import winston, { format, transports } from "winston";
import { MongoDB, MongoDBTransportInstance } from "winston-mongodb";
import { ApplicationEnvironment } from "../constants";
import { env } from "../env";

// Linking Trace Support
sourceMapSupport.install();

const colorizeLevel = (level: string) => {
  switch (level) {
    case "ERROR":
      return red(level);
    case "INFO":
      return blue(level);
    case "WARN":
      return yellow(level);
    default:
      return level;
  }
};

const consoleLogFormat = format.printf((info) => {
  const { level, message, timestamp, meta = {} } = info;
  const customLevel = colorizeLevel(level.toUpperCase());
  const customTimestamp = green(timestamp as string);
  const line = "----------------";
  const customMessage = message;
  const customMeta = util.inspect(meta, {
    showHidden: false,
    depth: null,
    colors: true,
  });
  const customLog = `${line}\n${customLevel} [${customTimestamp}] ${customMessage}\n${magenta("META")} ${customMeta}\n${line}`;
  return customLog;
});

const consoleTransport =
  (): Array<winston.transports.ConsoleTransportInstance> => {
    if (env.NODE_ENV === ApplicationEnvironment.DEVELOPMENT) {
      return [
        new transports.Console({
          level: "info",
          format: format.combine(format.timestamp(), consoleLogFormat),
        }),
      ];
    }
    return [];
  };

const getCollectionName = (level: string): string => {
  switch (level) {
    case "info":
      return "app-info";
    case "error":
      return "app-error";
    case "warn":
      return "app-warn";
    default:
      return "app-logs";
  }
};

const mongodbTransport = (): Array<MongoDBTransportInstance> => {
  return [
    new MongoDB({
      level: "info",
      db: env.DATABASE_URL,
      metaKey: "meta",
      expireAfterSeconds: 3600 * 24 * 30,
      collection: getCollectionName("info"),
    }),
    new MongoDB({
      level: "error",
      db: env.DATABASE_URL,
      metaKey: "meta",
      expireAfterSeconds: 3600 * 24 * 30,
      collection: getCollectionName("error"),
    }),
    new MongoDB({
      level: "warn",
      db: env.DATABASE_URL,
      metaKey: "meta",
      expireAfterSeconds: 3600 * 24 * 30,
      collection: getCollectionName("warn"),
    }),
  ];
};

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
  defaultMeta: { service: "predictye-ai" },
  transports: [...consoleTransport(), ...mongodbTransport()],
});

export default logger;
