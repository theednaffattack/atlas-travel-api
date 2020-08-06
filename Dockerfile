#
# Builder stage.
# This state compile our TypeScript to get the JavaScript code
#
FROM node:12.13.0 AS builder

WORKDIR /usr/src/app

COPY package*.json ./
COPY tsconfig*.json ./
COPY ./src ./src
COPY ./.env ./
RUN yarn install --frozen-lockfile && yarn build
# RUN npm ci --quiet && npm run build

#
# Production stage.
# This state compile get back the JavaScript code from builder stage
# It will also install the production package only
#
FROM node:12.13.0-slim

WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
RUN yarn install --frozen-lockfile --production
# RUN npm ci --quiet --only=production

## We just need the build to execute the command
COPY --from=builder /usr/src/app/dist ./dist
# Not sure if copying the env is a good idea. Maybe just for dev
COPY .env .
# COPY wait-for-postgres.sh .
COPY wait-for-it.sh .

# Inform Docker that the container is listening on the specified port at runtime.
# EXPOSE 6000

# start the app 
CMD ["node", "/app/dist/index.js"]