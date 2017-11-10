FROM node:9
LABEL maintainer="a1p4ca(SeongMin Park) <sm@murye.io>"
ENV HOME=/app

RUN npm install pm2 -g

# http://bitjudo.com/blog/2014/03/13/building-efficient-dockerfiles-node-dot-js/
COPY package.json /tmp/package.json
COPY package-lock.json /tmp/package-lock.json
RUN cd /tmp && npm install
RUN mkdir -p $HOME && cp -a /tmp/node_modules $HOME

WORKDIR $HOME
RUN npm run build

# Expose ports
EXPOSE 8080

# Start
CMD ["pm2-docker", "start", "--auto-exit", "--env", "production", "ecosystem.config.js"]
