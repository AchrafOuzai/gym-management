# ── Étape 1 : Build Angular ─────────────────────────────────
FROM node:20-alpine AS build

WORKDIR /app

# Copier package.json en premier pour le cache
COPY package*.json ./
RUN npm ci --silent

# Copier le code source
COPY . .

# Builder en mode production
RUN npm run build -- --configuration=production

# ── Étape 2 : Servir avec Nginx ─────────────────────────────
FROM nginx:alpine

# Copier la config Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copier les fichiers buildés depuis l'étape 1
COPY --from=build /app/dist/gym-frontend/browser /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD wget -q -O /dev/null http://localhost:80 || exit 1

CMD ["nginx", "-g", "daemon off;"]