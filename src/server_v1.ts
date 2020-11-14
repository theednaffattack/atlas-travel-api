import express, { RequestHandler } from "express";
import { ApolloServer, ApolloError, AuthenticationError } from "apollo-server-express";
import depthLimit from "graphql-depth-limit";
import compression from "compression";
import { GraphQLFormattedError } from "graphql/error/formatError";
import "reflect-metadata";
import { GraphQLError } from "graphql";
import session from "express-session";
import connectRedis from "connect-redis";
import internalIp from "internal-ip";
// import colors from "colors/safe";
import http from "http";
// import * as dotenv from "dotenv";
import { DbMate } from "dbmate";
import fs from "fs";
import { ExpressContext } from "apollo-server-express/dist/ApolloServer";

import { redis } from "./redis";
import { redisSessionPrefix } from "./constants";
import { MyContext } from "./typings";
import { logger } from "./logger";

import { createSchema } from "./utility.create-schema";
import { getConnectionString } from "./utility.get-connection-string";

interface CorsOptionsProps {
  credentials: boolean;
  origin: (origin: unknown, callback: unknown) => void;
}

const bootstrap = async () => {
  // dotenv.config();

  const app = express();

  const RedisStore = connectRedis(session);

  let sessionMiddleware: RequestHandler;

  const getContextFromHttpRequest = async (req: MyContext["req"], res: MyContext["res"]) => {
    if (req && req.session) {
      const { userId } = req.session;
      return { userId, req, res };
    }
    return ["No session detected"];
  };

  const getContextFromSubscription = (connection: any) => {
    const { userId } = connection.context.req.session;
    return {
      userId,
      req: connection.context.req,
    };
  };

  let port: number;

  const nodeEnvIsProd: boolean = process.env.NODE_ENV === "production";

  let retries = 5;

  async function runMigrations() {
    // construct a dbmate instance using a database url string
    // see https://github.com/amacneil/dbmate#usage for more details
    const dbmate = new DbMate(getConnectionString(process.env.NODE_ENV));

    let totalFiles;
    fs.readdir(`${process.cwd()}/db/migrations`, async function (error, files) {
      if (error) {
        throw new Error(`There was an unknown error accessing migration files\n ${error}`);
      } else {
        totalFiles = files.length; // return the number of files
      }
    });

    // invoke up, down, drop as necessary
    if (totalFiles !== undefined && totalFiles > 0) {
      try {
        await dbmate.up();
      } catch (dbmateError) {
        console.error("MIGRATION ERROR\n", dbmateError);
      }
    }
  }

  while (retries) {
    try {
      await runMigrations();
      console.log("MIGRATIONS HAVE BEEN RUN");

      break;
    } catch (error) {
      console.error("SOME KIND OF ERROR CONNECTING OCCURRED\n", {
        error,
        dirname: __dirname,
        POSTGRES_DBNAME: process.env.POSTGRES_DBNAME,
        POSTGRES_USER: process.env.POSTGRES_USER,
        POSTGRES_PASS: process.env.POSTGRES_PASS,
      });

      retries -= 1;
      // eslint-disable-next-line no-console
      console.log(`\n\nRETRIES LEFT: ${retries}\n\n`);
      // wait 5 seconds
      setTimeout(() => console.log("TIMEOUT FIRING"), 5000);
    }
  }

  if (process.env.ATAPI_VIRTUAL_PORT) {
    port = parseInt(process.env.ATAPI_VIRTUAL_PORT, 10);
  } else {
    port = 9000;
    console.log("ELSE", port);
  }

  const homeIp = internalIp.v4.sync();

  let hostUsed: string;
  let portUsed: number;

  const corsOptions: CorsOptionsProps = {
    credentials: true,
    origin: function (origin: any, callback: any) {
      const approvedOrigins = nodeEnvIsProd
        ? [
            `${process.env.PRODUCTION_CLIENT_ORIGIN}`,
            `${process.env.PRODUCTION_API_ORIGIN}`,
            `wss://${process.env.DOMAINS}`,
            `http://10.0.0.188:6000`,
            `ws://10.0.0.188:6000`,
          ]
        : [
            `http://localhost:3000`,
            `http://localhost:${port}`,
            `http://${homeIp}:3000`,
            `http://${homeIp}:${port}`,
            `http://${hostUsed}:${portUsed}`,
          ];

      if (!origin || approvedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        console.error(`cors error:: origin: `, {
          origin,
          hostUsed,
          portUsed,
          lanIp: `http://${homeIp ? homeIp : hostUsed}:${port ? port : portUsed}`,
          getIndex: approvedOrigins.indexOf(origin),
          test1: approvedOrigins.indexOf(origin) !== -1,
          test2: !origin,
          approvedOrigins,
        });
      }
    },
  };

  const apolloServer = new ApolloServer({
    schema: await createSchema(),
    playground: { version: "1.7.25", endpoint: "/graphql" },
    introspection: true,
    context: ({ req, res, connection }: ExpressContext) => {
      if (connection) {
        return getContextFromSubscription(connection);
      }

      return getContextFromHttpRequest(req, res);
    },
    subscriptions: {
      path: "/subscriptions",
      onConnect: (_: any, ws: any) => {
        return new Promise((res) =>
          sessionMiddleware(ws.upgradeReq, {} as any, () => {
            res({ req: ws.upgradeReq });
          }),
        );
      },
    },
    // custom error handling from:
    // https://github.com/19majkel94/type-graphql/issues/258
    formatError: (error: GraphQLError): GraphQLFormattedError => {
      if (error.originalError instanceof ApolloError) {
        return error;
      }

      const { extensions = {}, locations, message, path } = error;

      if (error.originalError instanceof AuthenticationError) {
        extensions.code = "AUTHENICATION_FAILED";

        throw new AuthenticationError("Not authenticated");
      }

      //   error.message = "Internal Server Error";

      return {
        message: extensions?.exception?.stacktrace[0].replace("Error: ", "") ?? message,
        path,
        locations,
        // extensions
      };
    },
    validationRules: [depthLimit(7)],
  });

  // needed to remove domain from our cookie
  // in non-production environments
  if (nodeEnvIsProd) {
    sessionMiddleware = session({
      name: "atg",
      secret: process.env.SESSION_SECRET as string,
      store: new RedisStore({
        client: redis as any,
        prefix: redisSessionPrefix,
      }),
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: true,
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days,
        domain: ".ednaff.dev",
      },
    });
  } else {
    console.log("ASSIGNING SESSION MIDDLEWARE");

    sessionMiddleware = session({
      name: "atg",
      secret: process.env.SESSION_SECRET as string,
      store: new RedisStore({
        client: redis as any,
        prefix: redisSessionPrefix,
      }),
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        // secure: true,
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days,
        domain: homeIp,
      },
    });
  }
  app.use(compression());

  app.use("/graphql", (req, res, next) => {
    const startHrTime = process.hrtime();

    res.on("finish", () => {
      if (req.body && req.body.operationName) {
        const elapsedHrTime = process.hrtime(startHrTime);
        const elapsedTimeInMs = elapsedHrTime[0] * 1000 + elapsedHrTime[1] / 1e6;
        logger.info({
          type: "timing",
          name: req.body.operationName,
          ms: elapsedTimeInMs,
        });
      }
    });

    next();
  });

  app.use(sessionMiddleware);

  apolloServer.applyMiddleware({ app, cors: corsOptions, path: "/graphql" });

  const httpServer = http.createServer(app);

  apolloServer.installSubscriptionHandlers(httpServer);

  //   // IMPORTED VERSION SERVER INIT
  //   if (process.env.ATAPI_VIRTUAL_PORT) {
  //     const configHost = nodeEnvIsProd ? "0.0.0.0" : "10.0.0.188";
  //     httpServer.listen(port, configHost, () => {
  //       console.log("LISTENING PORT", { server: httpServer.address() });
  //       if (httpServer) {
  //         const myHost = httpServer.address();
  //         if (myHost && typeof myHost !== "string") {
  //           const { address, port: myPort } = myHost;
  //           hostUsed = address;
  //           portUsed = myPort;
  //         } else {
  //           hostUsed = "not_defined";
  //           portUsed = -1;
  //         }
  //         console.log("LET'S CHECK THE ADDRESS INFO", myHost);
  //       }
  //       console.log(`

  // ${colors.bgYellow(colors.black("    server started    "))}

  // GraphQL Playground available at:
  //     ${colors.green("localhost")}: http://${hostUsed}:${portUsed}${apolloServer.graphqlPath}
  //           ${colors.green("LAN")}: http://${homeIp}:${portUsed}${apolloServer.graphqlPath}

  // WebSocket subscriptions available at:
  // ${colors.green("atlas_travel server")}: ws://${homeIp}:${portUsed}${apolloServer.subscriptionsPath}

  // `);
  //     });
  //   } else {
  //     throw "Environment variables are undefined.";
  //   }

  // ORIGINAL SERVER INIT
  // server.applyMiddleware({ app, path: "/graphql" });
  // const httpServer = createServer(app);
  httpServer.listen(port, (): void => {
    console.log("SERVER ADDRESS", httpServer);
    console.log(`\n🚀      GraphQL is now running on http://10.0.0.188:6000`);
  });
};

bootstrap()
  .then(() => console.log("bootstrap running"))
  .catch((error) => console.warn("SERVER BOOTSTRAP ERROR", error));
