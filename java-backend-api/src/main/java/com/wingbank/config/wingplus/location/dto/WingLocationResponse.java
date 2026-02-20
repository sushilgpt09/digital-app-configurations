package com.wingbank.config.wingplus.location.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data @Builder
public class WingLocationResponse {
    private UUID id;
    private String name;
    private String icon;
    private int sortOrder;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
