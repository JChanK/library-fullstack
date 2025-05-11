# Мульти-стадийная сборка для бэкенда и фронтенда
FROM --platform=linux/amd64 eclipse-temurin:17-jdk-jammy as backend
WORKDIR /app
COPY backend .
RUN chmod +x ./gradlew && ./gradlew build
RUN ls -l build/libs/

FROM --platform=linux/amd64 node:18 as frontend
WORKDIR /app
COPY frontend .
RUN npm install && npm run build

# Финальный образ
FROM --platform=linux/amd64 eclipse-temurin:17-jdk-jammy
WORKDIR /app

# Копируем бэкенд
COPY --from=backend /app/build/libs/*.jar app.jar

# Копируем фронтенд
COPY --from=frontend /app/build /frontend

# Устанавливаем Nginx
RUN apt-get update && apt-get install -y nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080 80
CMD service nginx start && java -jar app.jar
