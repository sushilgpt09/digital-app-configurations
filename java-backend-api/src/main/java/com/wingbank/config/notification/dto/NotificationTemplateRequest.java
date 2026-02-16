package com.wingbank.config.notification.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class NotificationTemplateRequest {

    @NotBlank(message = "Template code is required")
    private String code;

    private String titleEn;
    private String titleKm;
    private String bodyEn;
    private String bodyKm;

    @NotBlank(message = "Notification type is required")
    private String type;

    private String status;
}
