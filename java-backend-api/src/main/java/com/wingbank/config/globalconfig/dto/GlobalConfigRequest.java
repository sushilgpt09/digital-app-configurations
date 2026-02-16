package com.wingbank.config.globalconfig.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class GlobalConfigRequest {

    @NotBlank(message = "Config key is required")
    private String configKey;

    private String configValue;
    private String platform;
    private String version;
    private String description;
    private String status;
}
