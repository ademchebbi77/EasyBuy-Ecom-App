package com.esprit.microservice.apigatewaydemo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpHeaders;

@SpringBootApplication
@EnableDiscoveryClient
public class ApiGatewayDemoApplication {

  public static void main(String[] args) {
    SpringApplication.run(ApiGatewayDemoApplication.class, args);
  }

  // Global filter: forwards Authorization header to ALL downstream services
  @Bean
  public GlobalFilter forwardAuthGlobalFilter() {
    return (exchange, chain) -> {
      String auth = exchange.getRequest().getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
      if (auth != null) {
        exchange = exchange.mutate()
            .request(r -> r.headers(h -> h.set(HttpHeaders.AUTHORIZATION, auth)))
            .build();
      }
      return chain.filter(exchange);
    };
  }

  @Bean
  public RouteLocator gatewayroutes(RouteLocatorBuilder builder) {
    return builder.routes()
            .route("user-service-route",
                    r -> r.path("/user-service/**")
                            .filters(f -> f.rewritePath("/user-service/(?<segment>.*)", "/${segment}"))
                            .uri("lb://user-service"))
            .route("order-service-route",
                    r -> r.path("/order-service/**")
                            .filters(f -> f.rewritePath("/order-service/(?<segment>.*)", "/${segment}"))
                            .uri("lb://order-service"))
            .route("product-service-route",
                    r -> r.path("/product-service/**")
                            .filters(f -> f.rewritePath("/product-service/(?<segment>.*)", "/${segment}"))
                            .uri("lb://product-service"))
            .route("category-service-route",
                    r -> r.path("/category-service/**")
                            .filters(f -> f.rewritePath("/category-service/(?<segment>.*)", "/${segment}"))
                            .uri("lb://category-service"))
            .route("review-service-route",
                    r -> r.path("/review-service/**")
                            .filters(f -> f.rewritePath("/review-service/(?<segment>.*)", "/${segment}"))
                            .uri("lb://review-service"))
            .route("payment-service-route",
                    r -> r.path("/payment-service/**")
                            .filters(f -> f.rewritePath("/payment-service/(?<segment>.*)", "/${segment}"))
                            .uri("lb://payment-service"))
            .build();
  }
}