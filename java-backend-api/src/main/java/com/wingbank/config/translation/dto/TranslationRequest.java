package com.wingbank.config.translation.dto;

import com.fasterxml.jackson.annotation.JsonAnySetter;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.HashMap;
import java.util.Map;

@Data
public class TranslationRequest {

    @NotBlank(message = "Translation key is required")
    private String key;

    private String module;
    private String version;
    private String platform;

    private Map<String, String> languageValues = new HashMap<>();

    @JsonAnySetter
    public void setDynamicField(String name, String value) {
        if (name.endsWith("Value") && !name.equals("key")) {
            languageValues.put(name, value);
        }
    }
}
