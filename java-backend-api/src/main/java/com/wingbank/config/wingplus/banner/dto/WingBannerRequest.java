package com.wingbank.config.wingplus.banner.dto;
import lombok.Data;
import java.util.Map;
@Data
public class WingBannerRequest {
    private String linkUrl;
    private int sortOrder;
    private String status;
    private Map<String, WingBannerTranslationData> translations;
}
