package com.wingbank.config.notification.dto;

import com.fasterxml.jackson.annotation.JsonAnySetter;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.HashMap;
import java.util.Map;

@Data
public class NotificationTemplateRequest {

    @NotBlank(message = "Template code is required")
    private String code;

    @NotBlank(message = "Notification type is required")
    private String type;

    private String status;

    // Maps like "titleEn" -> "Welcome", "bodyKm" -> "..."
    private Map<String, String> languageValues = new HashMap<>();

    @JsonAnySetter
    public void setDynamicField(String name, String value) {
        if (name.startsWith("title") || name.startsWith("body")) {
            languageValues.put(name, value);
        }
    }
}
