package com.wingbank.config.message.dto;

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
public class ApiMessageResponse {

    private UUID id;
    private String errorCode;
    private String type;
    private int httpStatus;
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
