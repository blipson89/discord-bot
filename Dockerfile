FROM node:20

WORKDIR /build
COPY ["package.json", "package-lock.json", "tsconfig.json", ".env", "/build/"]
RUN ["npm", "install"]
COPY ./src /build/src
RUN ["npm", "run", "build-prod"]

ENTRYPOINT [ "npm", "run", "start" ]
