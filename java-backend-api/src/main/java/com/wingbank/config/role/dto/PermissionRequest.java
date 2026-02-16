package com.wingbank.config.role.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class PermissionRequest {

    @NotBlank(message = "Permission name is required")
    private String name;

    @NotBlank(message = "Module is required")
    private String module;

    private String description;
}
