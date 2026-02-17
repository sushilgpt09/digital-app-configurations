package com.wingbank.config.apprelease.controller;

import com.wingbank.config.apprelease.dto.AppReleaseRequest;
import com.wingbank.config.apprelease.dto.AppReleaseResponse;
import com.wingbank.config.apprelease.service.AppReleaseService;
import com.wingbank.config.common.dto.ApiResponse;
import com.wingbank.config.common.dto.PagedResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/app-releases")
@Tag(name = "App Releases")
@RequiredArgsConstructor
public class AppReleaseController {

    private final AppReleaseService appReleaseService;

    @GetMapping
    @PreAuthorize("hasAuthority('APP_RELEASE_VIEW')")
    @Operation(summary = "Get all app releases with pagination and filters")
    public ResponseEntity<ApiResponse<PagedResponse<AppReleaseResponse>>> getAllReleases(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String platform,
            @RequestParam(required = false) String status) {
        PagedResponse<AppReleaseResponse> releases = appReleaseService.getAllReleases(search, platform, status, page, size);
        return ResponseEntity.ok(ApiResponse.success(releases));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('APP_RELEASE_VIEW')")
    @Operation(summary = "Get app release by ID")
    public ResponseEntity<ApiResponse<AppReleaseResponse>> getReleaseById(@PathVariable UUID id) {
        AppReleaseResponse release = appReleaseService.getReleaseById(id);
        return ResponseEntity.ok(ApiResponse.success(release));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('APP_RELEASE_CREATE')")
    @Operation(summary = "Create a new app release")
    public ResponseEntity<ApiResponse<AppReleaseResponse>> createRelease(@Valid @RequestBody AppReleaseRequest request) {
        AppReleaseResponse release = appReleaseService.createRelease(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("App release created successfully", release));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('APP_RELEASE_UPDATE')")
    @Operation(summary = "Update an existing app release")
    public ResponseEntity<ApiResponse<AppReleaseResponse>> updateRelease(
            @PathVariable UUID id,
            @Valid @RequestBody AppReleaseRequest request) {
        AppReleaseResponse release = appReleaseService.updateRelease(id, request);
        return ResponseEntity.ok(ApiResponse.success("App release updated successfully", release));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('APP_RELEASE_DELETE')")
    @Operation(summary = "Soft delete an app release")
    public ResponseEntity<ApiResponse<Void>> deleteRelease(@PathVariable UUID id) {
        appReleaseService.deleteRelease(id);
        return ResponseEntity.ok(ApiResponse.success("App release deleted successfully", null));
    }
}
