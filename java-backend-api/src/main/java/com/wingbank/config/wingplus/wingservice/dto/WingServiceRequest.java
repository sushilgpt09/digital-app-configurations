package com.wingbank.config.wingplus.wingservice.dto;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import java.util.Map;
@Data
public class WingServiceRequest {
    private String icon;
    private String imageUrl;
    @JsonProperty("isPopular") private boolean isPopular;
    @JsonProperty("isNew") private boolean isNew;
    private int sortOrder;
    private String status;
    private Map<String, WingServiceTranslationData> translations;

    // Popular Partners display config
    private int popularSortOrder;
    private String popularEmoji;
    private String popularBgColor;
    private String popularBorderColor;

    // New Partners display config
    private int newSortOrder;
    private String newBgColor;
    private String newBorderColor;
    private String newBadge;
}
