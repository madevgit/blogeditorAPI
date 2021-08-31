#FROM nginx AS build

#COPY /
#COPY build /usr/share/nginx/html


FROM node:12.7-alpine AS build
RUN mkdir -p /blog-api
WORKDIR /blog-api
COPY package.json package-lock.json /blog-api/

RUN npm install
#RUN yarn install
COPY . /blog-api
CMD npm start
EXPOSE 8082
