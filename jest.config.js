module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  setupFiles: ["dotenv/config"],
  roots: ["__tests__"],
  // transform: {
  //   "^\\.(gql|graphql)$": "@jagi/jest-transform-graphql",
  // },
};
