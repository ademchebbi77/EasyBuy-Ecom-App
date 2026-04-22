FROM eclipse-temurin:17
EXPOSE 8083
ADD target/product-service-1.0.0.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]