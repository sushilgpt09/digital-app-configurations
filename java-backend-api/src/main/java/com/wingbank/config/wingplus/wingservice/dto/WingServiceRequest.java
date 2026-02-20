package com.wingbank.config.wingplus.wingservice.dto;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.util.Map;
import java.util.UUID;
@Data
public class WingServiceRequest {
    @NotNull(message = "Category ID is required")
    private UUID categoryId;
    private String icon;
    private String imageUrl;
    private int sortOrder;
    private String status;
    private Map<String, WingServiceTranslationData> translations;
}
