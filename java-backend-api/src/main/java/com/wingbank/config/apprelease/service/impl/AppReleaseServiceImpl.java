package com.wingbank.config.apprelease.service.impl;

import com.wingbank.config.apprelease.dto.AppReleaseRequest;
import com.wingbank.config.apprelease.dto.AppReleaseResponse;
import com.wingbank.config.apprelease.entity.AppRelease;
import com.wingbank.config.apprelease.repository.AppReleaseRepository;
import com.wingbank.config.apprelease.service.AppReleaseService;
import com.wingbank.config.common.dto.PagedResponse;
import com.wingbank.config.common.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AppReleaseServiceImpl implements AppReleaseService {

    private final AppReleaseRepository appReleaseRepository;

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<AppReleaseResponse> getAllReleases(String search, String platform, String status, int page, int size) {
        Page<AppRelease> releasePage = appReleaseRepository.findAllWithFilters(search, platform, status, PageRequest.of(page, size));
        var content = releasePage.getContent().stream().map(this::toResponse).collect(Collectors.toList());
        return PagedResponse.from(releasePage, content);
    }

    @Override
    @Transactional(readOnly = true)
    public AppReleaseResponse getReleaseById(UUID id) {
        AppRelease release = appReleaseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("AppRelease", "id", id));
        return toResponse(release);
    }

    @Override
    @Transactional
    public AppReleaseResponse createRelease(AppReleaseRequest request) {
        AppRelease release = new AppRelease();
        mapRequestToEntity(request, release);
        AppRelease saved = appReleaseRepository.save(release);
        log.info("App release created: {} v{}", saved.getPlatform(), saved.getVersion());
        return toResponse(saved);
    }

    @Override
    @Transactional
    public AppReleaseResponse updateRelease(UUID id, AppReleaseRequest request) {
        AppRelease release = appReleaseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("AppRelease", "id", id));
        mapRequestToEntity(request, release);
        AppRelease saved = appReleaseRepository.save(release);
        log.info("App release updated: {} v{}", saved.getPlatform(), saved.getVersion());
        return toResponse(saved);
    }

    @Override
    @Transactional
    public void deleteRelease(UUID id) {
        AppRelease release = appReleaseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("AppRelease", "id", id));
        release.setDeleted(true);
        appReleaseRepository.save(release);
        log.info("App release soft deleted: {} v{}", release.getPlatform(), release.getVersion());
    }

    private void mapRequestToEntity(AppReleaseRequest request, AppRelease release) {
        release.setVersion(request.getVersion());
        release.setPlatform(AppRelease.Platform.valueOf(request.getPlatform()));
        release.setReleaseNotes(request.getReleaseNotes());
        release.setBuildNumber(request.getBuildNumber());
        release.setMinOsVersion(request.getMinOsVersion());
        release.setDownloadUrl(request.getDownloadUrl());
        if (request.getForceUpdate() != null) {
            release.setForceUpdate(request.getForceUpdate());
        }
        if (request.getStatus() != null) {
            release.setStatus(AppRelease.Status.valueOf(request.getStatus()));
        }
        if (request.getReleasedAt() != null && !request.getReleasedAt().isEmpty()) {
            release.setReleasedAt(LocalDate.parse(request.getReleasedAt()));
        }
    }

    private AppReleaseResponse toResponse(AppRelease release) {
        return AppReleaseResponse.builder()
                .id(release.getId())
                .version(release.getVersion())
                .platform(release.getPlatform().name())
                .releaseNotes(release.getReleaseNotes())
                .buildNumber(release.getBuildNumber())
                .status(release.getStatus().name())
                .forceUpdate(release.isForceUpdate())
                .minOsVersion(release.getMinOsVersion())
                .downloadUrl(release.getDownloadUrl())
                .releasedAt(release.getReleasedAt())
                .createdAt(release.getCreatedAt())
                .updatedAt(release.getUpdatedAt())
                .build();
    }
}
