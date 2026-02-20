package com.wingbank.config.wingplus.popularcard.dto;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;
@Data @Builder
public class WingPopularCardResponse {
    private UUID id;
    private String emoji;
    private String bgColor;
    private String borderColor;
    private String linkUrl;
    private int sortOrder;
    private String status;
    private Map<String, WingPopularCardTranslationData> translations;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
