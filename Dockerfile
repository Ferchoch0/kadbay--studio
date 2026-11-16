FROM node:lts-slim
WORKDIR /srv/app

# NEXT_PUBLIC_* se fijan al compilar; el .env no viaja, por eso van acá.
ENV NEXT_PUBLIC_API_URL=https://otturn.otterlyinternal.qzz.io \
    NEXT_PUBLIC_BUSINESS_SLUG=kad-bay \
    NEXT_PUBLIC_GOOGLE_CLIENT_ID=TU_CLIENT_ID \
    NEXT_TELEMETRY_DISABLED=1

COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build && chown -R node:node /srv/app

USER node
EXPOSE 3000
CMD ["sh", "-c", "cd /srv/app && exec node_modules/.bin/next start -p ${PORT:-3000}"]