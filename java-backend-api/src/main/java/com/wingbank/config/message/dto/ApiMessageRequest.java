package com.wingbank.config.message.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ApiMessageRequest {

    @NotBlank(message = "Error code is required")
    private String errorCode;

    @NotBlank(message = "English message is required")
    private String enMessage;

    private String kmMessage;
    private String type;
    private Integer httpStatus;
}
