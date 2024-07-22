FROM node:20-alpine as builder

ENV NODE_ENV build

WORKDIR /warlords 


COPY package.json /warlords/
RUN npm install 
# RUN chown -Rh 777 /warlords/src
# RUN chown -Rh 777 /warlords/dist

COPY ./src /warlords/src
COPY ./*.json /warlords/ 

RUN npm run prebuild 
RUN npm run build
RUN npm prune --production

# ---

FROM node:20-alpine

ENV NODE_ENV production

USER node
WORKDIR /warlords

COPY --from=builder /warlords/*.json /warlords/
COPY --from=builder /warlords/dist/ /warlords/dist/
COPY --from=builder /warlords/node_modules /warlords/node_modules

CMD ["node", "dist/main"]