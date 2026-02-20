package com.wingbank.config.wingplus.popularcard.dto;
import lombok.Data;
import java.util.Map;
@Data
public class WingPopularCardRequest {
    private String emoji;
    private String bgColor;
    private String borderColor;
    private String linkUrl;
    private int sortOrder;
    private String status;
    private Map<String, WingPopularCardTranslationData> translations;
}
