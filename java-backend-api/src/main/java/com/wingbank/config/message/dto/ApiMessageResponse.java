package com.wingbank.config.message.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApiMessageResponse {

    private UUID id;
    private String errorCode;
    private String enMessage;
    private String kmMessage;
    private String type;
    private int httpStatus;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
