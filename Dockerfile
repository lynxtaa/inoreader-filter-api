FROM node:16.13.1-alpine

WORKDIR /server

COPY package*.json ./

RUN npm ci

COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build \
  && npm prune --production \
  && rm -rf ./src ./api \
  && npm cache clean --force

CMD ["npm", "start"]
