FROM node:12-alpine
COPY . .
RUN yarn install --production
RUN npm install pm2 -g
RUN npm run build
CMD ["pm2-runtime", "start", "ecosystem.config.js"]