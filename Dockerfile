FROM node:10
LABEL maintainer="a1p4ca(SeongMin Park) <dev.alpaca@gmail.com>"
ENV HOME=/app
ENV APP=$HOME/gongmo
RUN mkdir -p $APP
WORKDIR $APP

RUN yarn global add pm2@3

# http://bitjudo.com/blog/2014/03/13/building-efficient-dockerfiles-node-dot-js/
COPY package.json $APP/package.json
COPY yarn.lock $APP/yarn.lock
RUN yarn install

COPY . $APP

RUN yarn run build

# Expose ports
EXPOSE ${APP_INTERNAL_PORT}

# Start
ENTRYPOINT ["pm2-runtime", "start", "--env", "production", "ecosystem.config.js"]
