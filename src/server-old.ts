/* eslint-disable no-console */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import "reflect-metadata";
import { ApolloServer, ApolloError } from "apollo-server-express";
import * as Express from "express";
import { ArgumentValidationError } from "type-graphql";

import { GraphQLFormattedError, GraphQLError } from "graphql";
import session from "express-session";
import connectRedis from "connect-redis";
import internalIp from "internal-ip";
import colors from "colors/safe";
import http from "http";
import * as dotenv from "dotenv";
// import { inspect } from "util";

import { redis } from "./redis";
import { redisSessionPrefix } from "./constants";
import { createSchema } from "./utility.create-schema";
import { MyContext } from "./typings";

// import { createUsersLoader } from "./modules/utils/data-loaders/batch-user-loader";

// loading .env file
dotenv.config();

interface CorsOptionsProps {
  credentials: boolean;
  origin: (origin: unknown, callback: unknown) => void;
}

let port: number;

if (process.env.ATAPI_VIRTUAL_PORT) {
  port = parseInt(process.env.ATAPI_VIRTUAL_PORT, 10);

  console.log("IF PROCESS.ENV.ATAPI_VIRTUAL_PORT", port);
} else {
  port = 9000;
  console.log("ELSE", port);
}

const RedisStore = connectRedis(session);

let sessionMiddleware: Express.RequestHandler;

// const nodeEnvIsDev = process.env.NODE_ENV === "development";
// const nodeEnvIs_NOT_Prod = process.env.NODE_ENV !== "production";
const nodeEnvIsProd = process.env.NODE_ENV === "production";

const getContextFromHttpRequest = async (req: MyContext["req"], res: MyContext["res"]) => {
  if (req && req.session) {
    const { teamId, userId } = req.session;
    return { userId, req, res, teamId, connectionName: "default" };
  }
  return ["No session detected"];
};

const getContextFromSubscription = (connection: any) => {
  const { userId } = connection.context.req.session;
  return {
    userId,
    req: connection.context.req,
    teamId: connection.context.teamId,
    connectionName: "default",
  };
};

// type IntegrationContext = {
//   req: Express.Request;
//   res: Express.Response;
// }

const main = async () => {
  // createConnection is put into a try catch
  // for docker-compose's sake. It needs to retry
  // instead of quick-failing
  // const retries = 5;
  // let myPostgresConnection;
  // while (retries) {
  //   try {
  //     myPostgresConnection = await createConnection(ormConnection);

  //     break;
  //   } catch (error) {
  //     console.error("SOME KIND OF ERROR CONNECTING OCCURRED\n", {
  //       error,
  //       dirname: __dirname,
  //       POSTGRES_DBNAME: process.env.POSTGRES_DBNAME,
  //       POSTGRES_USER: process.env.POSTGRES_USER,
  //       POSTGRES_PASS: process.env.POSTGRES_PASS,
  //     });
  //     console.log(inspect({ ormConnection, env: nodeEnvIsProd ? "prod" : "not-prod" }, false, 3, true));

  //     retries -= 1;
  //     // eslint-disable-next-line no-console
  //     console.log(`\n\nRETRIES LEFT: ${retries}\n\n`);
  //     // wait 5 seconds
  //     await new Promise((res) => setTimeout(res, 5000));
  //   }
  // }

  const schema = await createSchema();

  const apolloServer = new ApolloServer({
    schema,
    playground: { version: "1.7.25", endpoint: "/graphql" },
    introspection: true,
    context: ({ req, res, connection }: any) => {
      if (connection) {
        return getContextFromSubscription(connection);
        // return {
        //   ...getContextFromSubscription(connection),
        //   usersLoader: createUsersLoader()
        // };
      }

      return getContextFromHttpRequest(req, res);

      // return {
      //   ...getContextFromHttpRequest(req, res),
      //   usersLoader: createUsersLoader()
      // };

      // return { req, res, connection }
    },
    subscriptions: {
      path: "/subscriptions",
      onConnect: (_, ws: any) => {
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

      if (error.originalError instanceof ArgumentValidationError) {
        extensions.code = "GRAPHQL_VALIDATION_FAILED";

        return {
          extensions,
          locations,
          message,
          path,
        };
      }

      //   error.message = "Internal Server Error";

      return {
        message: extensions?.exception?.stacktrace[0].replace("Error: ", "") ?? message,
        path,
        locations,
        // extensions
      };
    },
    validationRules: [
      // queryComplexity({
      //   // queries above this threshold are rejected
      //   maximumComplexity: 8,
      //   variables: {},
      //   onComplete: (complexity: number) => {
      //     console.log("Query Complexity:", complexity);
      //   },
      //   estimators: [
      //     fieldConfigEstimator(),
      //     simpleEstimator({
      //       defaultComplexity: 1
      //     })
      //   ]
      // }) as any
    ],
  });

  const homeIp = internalIp.v4.sync();

  const app = Express.default();

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
            `http://192.168.1.4:7000`,
          ]
        : [
            `http://192.168.1.4:7000`,
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

  // // we're bypassing cors used by apollo-server-express here
  // app.use(
  //   cors({
  //     credentials: true,
  //     origin: function(origin, callback) {
  //       if (approvedOrigins.indexOf(origin) !== -1 || !origin) {
  //         callback(null, true);
  //       } else {
  //         callback(new Error("Not allowed by CORS"));
  //       }
  //     }
  //   })
  // );

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
        domain: ".eddienaff.dev",
      },
    });
  } else {
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
        domain: `${homeIp}`,
      },
    });
  }

  app.use(sessionMiddleware);

  apolloServer.applyMiddleware({ app, cors: corsOptions });

  const httpServer = http.createServer(app);
  apolloServer.installSubscriptionHandlers(httpServer);

  // needed for heroku deployment
  app.enable("trust proxy");

  // needed for heroku deployment
  // they set the "x-forwarded-proto" header???
  if (nodeEnvIsProd) {
    app.use(function (req, res, next) {
      if (req.header("x-forwarded-proto") !== "https") {
        res.redirect("https://" + req.header("host") + req.url);
      } else {
        next();
      }
    });
  }

  if (process.env.ATAPI_VIRTUAL_PORT) {
    httpServer.listen(port, "10.0.0.188", () => {
      console.log("LISTENING PORT", { port, env: process.env.PORT });
      if (httpServer) {
        const myHost = httpServer.address();
        if (myHost && typeof myHost !== "string") {
          const { address, port } = myHost;
          hostUsed = address;
          portUsed = port;
        } else {
          hostUsed = "not_defined";
          portUsed = -1;
        }
        console.log("LET'S CHECK THE ADDRESS INFO", myHost);
      }
      console.log(`
  
  ${colors.bgYellow(colors.black("    server started    "))}
  
  
  
  GraphQL Playground available at:
      ${colors.green("localhost")}: http://${hostUsed}:${portUsed}${apolloServer.graphqlPath}
            ${colors.green("LAN")}: http://${homeIp}:${portUsed}${apolloServer.graphqlPath}
  
  WebSocket subscriptions available at:
  ${colors.green("atlas_travel server")}: ws://${homeIp}:${portUsed}${apolloServer.subscriptionsPath}
  
  
  `);
    });
  } else {
    throw "Environment variables are undefined.";
  }
};

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error("SERVER ERROR", { err });
});
