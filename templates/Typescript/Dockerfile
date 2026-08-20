###################
# BUILD
###################

FROM node:24-alpine AS build

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./

RUN npm install

COPY --chown=node:node . .

RUN npm run build

ENV NODE_ENV production

RUN npm prune --omit=dev

USER node

###################
# PRODUCTION
###################

FROM node:24-alpine AS production

WORKDIR /usr/src/app

COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist

USER node

CMD [ "node", "dist/Bot.js" ]
