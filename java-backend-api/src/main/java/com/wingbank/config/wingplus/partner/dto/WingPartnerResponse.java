package com.wingbank.config.wingplus.partner.dto;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;
@Data @Builder
public class WingPartnerResponse {
    private UUID id;
    private String icon;
    private String bgColor;
    private String badge;
    private boolean isNewPartner;
    private int sortOrder;
    private String status;
    private Map<String, WingPartnerTranslationData> translations;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
