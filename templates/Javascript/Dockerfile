###################
# APPLICATION
###################

FROM node:24-alpine

WORKDIR /usr/src/app

COPY --chown=node:node package.json package-lock.json ./

RUN npm ci --ignore-scripts --omit=dev

COPY --chown=node:node . .

ENV NODE_ENV=production

USER node

CMD [ "node", "src/Bot.js" ]
