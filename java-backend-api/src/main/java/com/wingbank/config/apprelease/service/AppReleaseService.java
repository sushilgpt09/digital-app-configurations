package com.wingbank.config.apprelease.service;

import com.wingbank.config.apprelease.dto.AppReleaseRequest;
import com.wingbank.config.apprelease.dto.AppReleaseResponse;
import com.wingbank.config.common.dto.PagedResponse;

import java.util.UUID;

public interface AppReleaseService {

    PagedResponse<AppReleaseResponse> getAllReleases(String search, String platform, String status, int page, int size);

    AppReleaseResponse getReleaseById(UUID id);

    AppReleaseResponse createRelease(AppReleaseRequest request);

    AppReleaseResponse updateRelease(UUID id, AppReleaseRequest request);

    void deleteRelease(UUID id);
}
