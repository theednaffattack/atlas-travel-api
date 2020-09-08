module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  setupFiles: ["dotenv/config"],
  roots: ["__tests__"],
  // setupFilesAfterEnv: [
  //   "./config/jest-setup.js",
  //   // can have more setup files here
  // ],

  transform: { "\\.ts$": ["ts-jest"] },
  // transform: {
  //   "^\\.(gql|graphql)$": "@jagi/jest-transform-graphql",
  // },
};
