package com.wingbank.config.message.dto;

import com.fasterxml.jackson.annotation.JsonAnySetter;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.HashMap;
import java.util.Map;

@Data
public class ApiMessageRequest {

    @NotBlank(message = "Error code is required")
    private String errorCode;

    private String type;
    private Integer httpStatus;

    private Map<String, String> languageValues = new HashMap<>();

    @JsonAnySetter
    public void setDynamicField(String name, String value) {
        if (name.endsWith("Message") && !name.equals("errorCode")) {
            languageValues.put(name, value);
        }
    }
}
