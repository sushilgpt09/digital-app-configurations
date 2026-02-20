package com.wingbank.config.wingplus.wingservice.dto;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;
@Data @Builder
public class WingServiceResponse {
    private UUID id;
    private UUID categoryId;
    private String categoryKey;
    private String icon;
    private String imageUrl;
    private int sortOrder;
    private String status;
    private Map<String, WingServiceTranslationData> translations;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
