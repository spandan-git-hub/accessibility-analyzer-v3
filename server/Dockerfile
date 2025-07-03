FROM ghcr.io/puppeteer/puppeteer:24.11.0

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

EXPOSE 5000

CMD ["node", "index.js"]