FROM node:16-alpine as builder

ENV NODE_ENV build

WORKDIR /home/node 

COPY . /home/node

RUN npm install 
RUN chown -Rh 777 /home/node
RUN npm run prebuild 
RUN npm run build
RUN npm prune --production

# ---

FROM node:16-alpine

ENV NODE_ENV production

USER node
WORKDIR /home/node

COPY --from=builder /home/node/package*.json /home/node/
COPY --from=builder /home/node/node_modules/ /home/node/node_modules/
COPY --from=builder /home/node/dist/ /home/node/dist/

CMD ["node", "dist/server.js"]