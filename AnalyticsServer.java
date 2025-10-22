import com.sun.net.httpserver.HttpServer;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpExchange;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

/**
 * Simple HTTP Server for Analytics API
 * Standalone Java application - no dependencies needed
 * Compile: javac AnalyticsServer.java
 * Run: java AnalyticsServer
 * Access: http://localhost:8081
 */
public class AnalyticsServer {
    
    private static final int PORT = 8081;
    
    public static void main(String[] args) throws Exception {
        HttpServer server = HttpServer.create(new InetSocketAddress("localhost", PORT), 0);
        
        // Health check endpoint
        server.createContext("/api/analytics/health", exchange -> {
            String response = "{\"status\":\"UP\"}";
            sendResponse(exchange, response, 200);
        });
        
        // Monthly summary endpoint
        server.createContext("/api/analytics/monthly-summary", exchange -> {
            String response = "{\n" +
                "  \"totalIncome\": 5000,\n" +
                "  \"totalExpense\": 3200,\n" +
                "  \"netIncome\": 1800,\n" +
                "  \"byCategory\": {\n" +
                "    \"Food\": 850,\n" +
                "    \"Transport\": 420,\n" +
                "    \"Utilities\": 320,\n" +
                "    \"Entertainment\": 680,\n" +
                "    \"Shopping\": 930\n" +
                "  },\n" +
                "  \"transactionCount\": 47,\n" +
                "  \"month\": \"October\",\n" +
                "  \"year\": \"2025\"\n" +
                "}";
            sendResponse(exchange, response, 200);
        });
        
        // Spending forecast endpoint
        server.createContext("/api/analytics/spending-forecast", exchange -> {
            String response = "{\n" +
                "  \"predictedMonthlySpending\": {\n" +
                "    \"Food\": 900,\n" +
                "    \"Transport\": 450,\n" +
                "    \"Utilities\": 320,\n" +
                "    \"Entertainment\": 700,\n" +
                "    \"Shopping\": 850\n" +
                "  },\n" +
                "  \"averageMonthlyExpense\": 3220,\n" +
                "  \"recommendation\": \"Your spending is stable. Consider increasing savings by 10%.\",\n" +
                "  \"trends\": {\n" +
                "    \"Food\": \"stable\",\n" +
                "    \"Transport\": \"increasing\",\n" +
                "    \"Entertainment\": \"increasing\"\n" +
                "  }\n" +
                "}";
            sendResponse(exchange, response, 200);
        });
        
        // Category breakdown endpoint
        server.createContext("/api/analytics/category-breakdown", exchange -> {
            String response = "[\n" +
                "  {\"category\": \"Food\", \"totalAmount\": 850, \"percentage\": 26.56, \"transactionCount\": 12, \"trend\": \"up\"},\n" +
                "  {\"category\": \"Transport\", \"totalAmount\": 420, \"percentage\": 13.13, \"transactionCount\": 8, \"trend\": \"down\"},\n" +
                "  {\"category\": \"Utilities\", \"totalAmount\": 320, \"percentage\": 10.0, \"transactionCount\": 3, \"trend\": \"stable\"},\n" +
                "  {\"category\": \"Entertainment\", \"totalAmount\": 680, \"percentage\": 21.25, \"transactionCount\": 9, \"trend\": \"up\"},\n" +
                "  {\"category\": \"Shopping\", \"totalAmount\": 930, \"percentage\": 29.06, \"transactionCount\": 15, \"trend\": \"up\"}\n" +
                "]";
            sendResponse(exchange, response, 200);
        });
        
        // Budget tracking endpoint
        server.createContext("/api/analytics/budget-tracking", exchange -> {
            String response = "{\n" +
                "  \"budgetLimit\": 3500,\n" +
                "  \"currentSpending\": 3200,\n" +
                "  \"remaining\": 300,\n" +
                "  \"percentageUsed\": 91.43,\n" +
                "  \"status\": \"warning\",\n" +
                "  \"byCategory\": {\n" +
                "    \"Food\": {\"limit\": 1000, \"spent\": 850, \"remaining\": 150},\n" +
                "    \"Transport\": {\"limit\": 500, \"spent\": 420, \"remaining\": 80},\n" +
                "    \"Utilities\": {\"limit\": 400, \"spent\": 320, \"remaining\": 80},\n" +
                "    \"Entertainment\": {\"limit\": 800, \"spent\": 680, \"remaining\": 120},\n" +
                "    \"Shopping\": {\"limit\": 1000, \"spent\": 930, \"remaining\": 70}\n" +
                "  }\n" +
                "}";
            sendResponse(exchange, response, 200);
        });
        
        // Insights endpoint
        server.createContext("/api/analytics/insights", exchange -> {
            String response = "{\n" +
                "  \"message\": \"You spent $3,200 this month across 5 categories\",\n" +
                "  \"status\": \"success\",\n" +
                "  \"totalTransactions\": 47,\n" +
                "  \"highestSpendingDay\": \"2025-10-15\"\n" +
                "}";
            sendResponse(exchange, response, 200);
        });
        
        // Monthly comparison endpoint
        server.createContext("/api/analytics/monthly-comparison", exchange -> {
            String response = "{\n" +
                "  \"currentMonth\": 3200,\n" +
                "  \"previousMonth\": 3100,\n" +
                "  \"changePercentage\": 3.23,\n" +
                "  \"trend\": \"up\"\n" +
                "}";
            sendResponse(exchange, response, 200);
        });
        
        server.setExecutor(null);
        server.start();
        
        System.out.println("");
        System.out.println("========================================");
        System.out.println("  Analytics Service (Java)");
        System.out.println("========================================");
        System.out.println("  ✅ Server running on http://localhost:" + PORT);
        System.out.println("  📊 Health: http://localhost:" + PORT + "/api/analytics/health");
        System.out.println("");
        System.out.println("  Available endpoints:");
        System.out.println("  - /api/analytics/health");
        System.out.println("  - /api/analytics/monthly-summary");
        System.out.println("  - /api/analytics/spending-forecast");
        System.out.println("  - /api/analytics/category-breakdown");
        System.out.println("  - /api/analytics/budget-tracking");
        System.out.println("  - /api/analytics/insights");
        System.out.println("  - /api/analytics/monthly-comparison");
        System.out.println("");
        System.out.println("  Press Ctrl+C to stop");
        System.out.println("========================================");
        System.out.println("");
    }
    
    private static void sendResponse(HttpExchange exchange, String response, int code) throws Exception {
        // Enable CORS
        exchange.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
        exchange.getResponseHeaders().set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        exchange.getResponseHeaders().set("Content-Type", "application/json; charset=UTF-8");
        
        byte[] responseBytes = response.getBytes(StandardCharsets.UTF_8);
        exchange.sendResponseHeaders(code, responseBytes.length);
        
        try (OutputStream os = exchange.getResponseBody()) {
            os.write(responseBytes);
        }
    }
}
