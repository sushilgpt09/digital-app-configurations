package com.wingbank.config.translation.dto;

import com.fasterxml.jackson.annotation.JsonAnyGetter;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TranslationResponse {

    private UUID id;
    private String key;
    private String module;
    private String version;
    private String platform;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @JsonIgnore
    @Builder.Default
    private Map<String, String> languageValues = new HashMap<>();

    @JsonAnyGetter
    public Map<String, String> getLanguageValues() {
        return languageValues;
    }
}
