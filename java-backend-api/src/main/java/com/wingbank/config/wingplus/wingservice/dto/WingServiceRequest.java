package com.wingbank.config.wingplus.wingservice.dto;
import lombok.Data;
import java.util.Map;
@Data
public class WingServiceRequest {
    private String icon;
    private String imageUrl;
    private boolean isPopular;
    private boolean isNew;
    private int sortOrder;
    private String status;
    private Map<String, WingServiceTranslationData> translations;
}
