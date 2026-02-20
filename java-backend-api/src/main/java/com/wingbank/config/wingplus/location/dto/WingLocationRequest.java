package com.wingbank.config.wingplus.location.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class WingLocationRequest {
    @NotBlank(message = "Name is required")
    private String name;
    private String icon;
    private int sortOrder;
    private String status;
}
