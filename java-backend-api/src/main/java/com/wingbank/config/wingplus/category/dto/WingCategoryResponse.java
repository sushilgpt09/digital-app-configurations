package com.wingbank.config.wingplus.category.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

@Data @Builder
public class WingCategoryResponse {
    private UUID id;
    private String key;
    private String icon;
    private int sortOrder;
    private String status;
    private Map<String, WingCategoryTranslationData> translations;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
