package com.wingbank.config.translation.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class TranslationRequest {

    @NotBlank(message = "Translation key is required")
    private String key;

    private String enValue;
    private String kmValue;
    private String module;
    private String version;
    private String platform;
}
