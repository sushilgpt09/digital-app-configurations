package com.wingbank.config.wingplus.category.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.Map;

@Data
public class WingCategoryRequest {
    @NotBlank(message = "Key is required")
    private String key;
    private String icon;
    private String imageUrl;
    private int sortOrder;
    private String status;
    private Map<String, WingCategoryTranslationData> translations;
}
