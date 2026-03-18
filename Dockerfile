FROM node:20-alpine AS build
WORKDIR /app

ARG VITE_SITE_URL
ARG VITE_BASE_URL
ARG VITE_IMAGE_URL

ENV VITE_SITE_URL=$VITE_SITE_URL
ENV VITE_BASE_URL=$VITE_BASE_URL
ENV VITE_IMAGE_URL=$VITE_IMAGE_URL

COPY package.json bun.lock ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 8500
CMD ["nginx", "-g", "daemon off;"]
