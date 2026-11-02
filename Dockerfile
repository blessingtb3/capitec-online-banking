# syntax=docker/dockerfile:1

# ---------- 1. Install dependencies ----------
FROM node:24-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# ---------- 2. Type check + unit tests (docker build --target test .) ----------
FROM deps AS test
COPY . .
RUN npm run typecheck && npm run test:run

# ---------- 3. Build the production bundle (only after tests pass) ----------
FROM test AS build
RUN npx vite build

# ---------- 4. Serve the static site with nginx ----------
FROM nginx:stable-alpine AS runtime
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
