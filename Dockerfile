FROM node:9
LABEL maintainer="a1p4ca(SeongMin Park) <sm@murye.io>"
ENV HOME=/app
ENV APP=$HOME/gongmo
RUN mkdir -p $APP
WORKDIR $APP

RUN curl -o- -L https://yarnpkg.com/install.sh | bash

RUN yarn global add pm2

# http://bitjudo.com/blog/2014/03/13/building-efficient-dockerfiles-node-dot-js/
COPY package.json $APP/package.json
COPY yarn.lock $APP/yarn.lock
RUN yarn install

COPY . $APP

RUN yarn run build

# Expose ports
EXPOSE 8080

# Start
CMD ["pm2-docker", "start", "--auto-exit", "--env", "production", "ecosystem.config.js"]
