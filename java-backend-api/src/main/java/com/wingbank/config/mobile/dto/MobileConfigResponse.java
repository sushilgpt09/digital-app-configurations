package com.wingbank.config.mobile.dto;

import com.wingbank.config.country.dto.CountryResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MobileConfigResponse {

    private Map<String, String> translations;
    private List<CountryResponse> countries;
    private Map<String, String> globalConfigs;
    private Map<String, String> apiMessages;
    private Map<String, Object> featureFlags;
}
