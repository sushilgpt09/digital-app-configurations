package com.wingbank.config.notification.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationTemplateResponse {

    private UUID id;
    private String code;
    private String titleEn;
    private String titleKm;
    private String bodyEn;
    private String bodyKm;
    private String type;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
