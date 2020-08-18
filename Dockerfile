# STAGE 1 - Typescript to Javascript
FROM node:12.13-alpine as build-dependencies

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package.json ./
COPY yarn.lock ./
COPY ./.yarn ./.yarn 
COPY .yarnrc.yml ./
RUN yarn install

# Bundle app source
COPY public ./public
COPY src ./src
COPY .env ./
COPY .eslintignore ./
COPY .eslintrc.js ./
COPY .prettierrc.js ./
COPY next-env.d.ts ./
COPY next.config.js ./
COPY tsconfig.json ./
COPY tsconfig.server.json ./

# Build sources
RUN yarn build

# STAGE 2 - Docker server
FROM node:12.13-slim as prod

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package.json ./
COPY --from=build-dependencies app/yarn.lock ./
COPY --from=build-dependencies app/.yarn ./.yarn
COPY --from=build-dependencies app/.yarnrc.yml ./
RUN yarn install

# Copy app files
COPY .env ./
COPY next.config.js ./
COPY --from=build-dependencies app/dist dist
COPY --from=build-dependencies app/public public

ENV DOCKER 1
ENV NODE_ENV production

EXPOSE 5000
# ENTRYPOINT ["dumb-init", "--"]
CMD [ "yarn", "node", "./dist/app.js" ]
