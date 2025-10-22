package com.finora;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

/**
 * Main Spring Boot Application for Finora Analytics Microservice
 * Runs on port 8081
 * Provides advanced analytics, forecasting, and reporting features
 */
@SpringBootApplication
public class FinoraAnalyticsApplication {

    public static void main(String[] args) {
        SpringApplication.run(FinoraAnalyticsApplication.class, args);
    }

    /**
     * CORS Configuration - Allows requests from Next.js frontend
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // Allow requests from Vercel deployment and localhost
        configuration.setAllowedOrigins(Arrays.asList(
            "https://finora-six.vercel.app",
            "http://localhost:3000",
            "http://localhost:8081",
            "*"
        ));
        
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        
        return source;
    }
}
