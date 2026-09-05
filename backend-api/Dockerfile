# ── Étape 1 : Build avec Maven ──────────────────────────────
FROM maven:3.9.6-eclipse-temurin-17 AS build

WORKDIR /app

# Copier pom.xml en premier pour profiter du cache Docker
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copier le code source
COPY src ./src

# Builder le jar sans les tests
RUN mvn clean package -DskipTests

# ── Étape 2 : Image finale légère ───────────────────────────
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Créer un utilisateur non-root pour la sécurité
RUN addgroup -S gymgroup && adduser -S gymuser -G gymgroup

# Copier le jar depuis l'étape de build
COPY --from=build /app/target/*.jar app.jar

# Donner les droits à l'utilisateur
RUN chown gymuser:gymgroup app.jar

USER gymuser

# Port exposé
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD wget -q -O /dev/null http://localhost:8080/actuator/health || exit 1

# Lancer l'application
ENTRYPOINT ["java", "-jar", "app.jar"]