###################
# BUILD
###################

FROM node:24-alpine AS build

WORKDIR /usr/src/app

COPY --chown=node:node package.json package-lock.json ./

RUN npm ci --ignore-scripts

COPY --chown=node:node . .

RUN npm run build

ENV NODE_ENV=production

RUN npm prune --ignore-scripts --omit=dev

USER node

###################
# PRODUCTION
###################

FROM node:24-alpine AS production

WORKDIR /usr/src/app

ENV NODE_ENV=production

COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist

USER node

CMD [ "node", "dist/Bot.js" ]
