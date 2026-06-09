FROM node:24 AS builder

ARG VITE_API_URL_PROD
ENV VITE_API_URL_PROD=$VITE_API_URL_PROD

COPY ./web /opt/web
WORKDIR /opt/web
RUN npm i
RUN npm run build

FROM node:24-alpine

COPY ./api /opt/ship-api
WORKDIR /opt/ship-api
RUN npm i --omit=dev
COPY --from=builder /opt/web/dist /opt/ship-api/web/build

EXPOSE 3000

CMD ["npm", "start"]