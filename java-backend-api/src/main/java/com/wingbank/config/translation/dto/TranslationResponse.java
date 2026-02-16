package com.wingbank.config.translation.dto;

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
public class TranslationResponse {

    private UUID id;
    private String key;
    private String enValue;
    private String kmValue;
    private String module;
    private String version;
    private String platform;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
