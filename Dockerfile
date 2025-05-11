# Бэкенд
FROM eclipse-temurin:17-jdk-jammy as backend
WORKDIR /app
COPY backend .
RUN chmod +x ./gradlew && ./gradlew build -x test  # Пропускаем тесты
RUN ls -l build/libs/

# Фронтенд
FROM node:18 as frontend
WORKDIR /app
COPY frontend .
RUN npm install && npm run build

# Финальный образ
FROM eclipse-temurin:17-jdk-jammy
WORKDIR /app
COPY --from=backend /app/build/libs/*.jar app.jar
COPY --from=frontend /app/build /frontend
RUN apt-get update && apt-get install -y nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 8080 80
CMD service nginx start && \
    java -Xmx256m -Xms128m -jar app.jar  # Ограничиваем память Java
