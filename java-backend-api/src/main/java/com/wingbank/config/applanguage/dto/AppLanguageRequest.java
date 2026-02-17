package com.wingbank.config.applanguage.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class AppLanguageRequest {

    @NotBlank(message = "Language name is required")
    private String name;

    private String nativeName;

    @NotBlank(message = "Language code is required")
    @Size(min = 2, max = 10, message = "Language code must be 2-10 characters")
    private String code;

    private String status;
}
