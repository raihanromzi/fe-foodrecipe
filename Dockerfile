FROM harbor.cloudias79.com/devops-tools/node:18.16.0-alpine3.18 AS builder
WORKDIR /usr/src/app
RUN apk --update --no-cache add \
    libc6-compat \
    libpng-dev \
    automake \
    autoconf \
    file \
    g++ \
    tzdata \
    libtool \
    make \
    nasm \
    build-base \
    zlib \
    zlib-dev
USER root
ENV PATH /usr/src/app/node_modules/.bin:$PATH
COPY . /usr/src/app
RUN rm -f package-lock.json
RUN npm cache clean --force
RUN npm install --prefer-offline --no-audit
RUN npm run build --prefer-offline --no-audit

# RUNNER IMAGE
FROM harbor.cloudias79.com/devops-tools/nginx:stable
ENV TZ="Asia/Jakarta"
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /usr/src/app/dist /usr/share/nginx/html/book-recipe
RUN chmod g+rwx /var/cache/nginx /var/run /var/log/nginx 
RUN sed -i.bak 's/^user/#user/' /etc/nginx/nginx.conf
USER nginx
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]