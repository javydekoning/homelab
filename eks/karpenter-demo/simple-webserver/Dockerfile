FROM node:lts-alpine
WORKDIR /usr/src/
COPY ./src /usr/src/
RUN npm i
RUN npm i -g typescript ts-node
EXPOSE 9091
CMD ["/usr/local/bin/ts-node" ,"index.ts"]
