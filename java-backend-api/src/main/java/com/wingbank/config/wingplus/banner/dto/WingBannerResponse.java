package com.wingbank.config.wingplus.banner.dto;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;
@Data @Builder
public class WingBannerResponse {
    private UUID id;
    private String linkUrl;
    private int sortOrder;
    private String status;
    private Map<String, WingBannerTranslationData> translations;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
