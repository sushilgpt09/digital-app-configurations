package com.wingbank.config.apprelease.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AppReleaseRequest {

    @NotBlank(message = "Version is required")
    private String version;

    @NotBlank(message = "Platform is required")
    private String platform;

    private String releaseNotes;
    private String buildNumber;
    private String status;
    private Boolean forceUpdate;
    private String minOsVersion;
    private String downloadUrl;
    private String releasedAt;
}
