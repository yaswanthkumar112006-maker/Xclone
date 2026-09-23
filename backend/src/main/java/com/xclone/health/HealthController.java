package com.xclone.health;

import com.xclone.common.dto.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/health")
public class HealthController {

    @GetMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> getHealthStatus() {
        Map<String, Object> healthData = new LinkedHashMap<>();
        healthData.put("status", "UP");
        healthData.put("service", "xclone-backend");
        healthData.put("version", "0.0.1-SNAPSHOT");
        healthData.put("serverTime", Instant.now().toString());

        return ResponseEntity.ok(ApiResponse.success(healthData, "XClone backend service is running"));
    }
}
