package com.wingbank.config.apprelease.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AppReleaseResponse {

    private UUID id;
    private String version;
    private String platform;
    private String releaseNotes;
    private String buildNumber;
    private String status;
    private boolean forceUpdate;
    private String minOsVersion;
    private String downloadUrl;
    private LocalDate releasedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
