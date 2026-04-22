FROM eclipse-temurin:17
EXPOSE 8086
ADD target/payment-service-0.0.1-SNAPSHOT.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]