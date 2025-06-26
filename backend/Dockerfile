# ---- Base image ----
FROM node:16-alpine AS base
WORKDIR /usr/src/app

# Install dependencies only, leveraging cache
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy app source for build
COPY tsconfig.json ./
COPY src ./src

# ---- Build image ----
FROM base AS build
RUN yarn build

# ---- Production image ----
FROM node:16-alpine AS production
WORKDIR /usr/src/app

# Install PM2 globally
RUN yarn global add pm2

# Copy only built files and production dependencies
COPY --from=base /usr/src/app/package.json ./
COPY --from=base /usr/src/app/yarn.lock ./
RUN yarn install --frozen-lockfile --production

COPY --from=build /usr/src/app/build ./build
COPY processes.config.js ./
RUN mkdir -p log && touch log/.keep

EXPOSE 8080

CMD ["pm2-runtime", "processes.config.js"]
