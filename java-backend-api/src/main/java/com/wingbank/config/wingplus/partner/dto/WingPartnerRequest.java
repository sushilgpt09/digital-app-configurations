package com.wingbank.config.wingplus.partner.dto;
import lombok.Data;
import java.util.Map;
@Data
public class WingPartnerRequest {
    private String icon;
    private String bgColor;
    private String borderColor;
    private String badge;
    private int sortOrder;
    private String status;
    private Map<String, WingPartnerTranslationData> translations;
}
