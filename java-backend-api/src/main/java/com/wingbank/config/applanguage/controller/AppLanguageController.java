package com.wingbank.config.applanguage.controller;

import com.wingbank.config.common.dto.ApiResponse;
import com.wingbank.config.common.dto.PagedResponse;
import com.wingbank.config.applanguage.dto.AppLanguageRequest;
import com.wingbank.config.applanguage.dto.AppLanguageResponse;
import com.wingbank.config.applanguage.service.AppLanguageService;
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
@RequestMapping("/api/app-languages")
@Tag(name = "App Languages")
@RequiredArgsConstructor
public class AppLanguageController {

    private final AppLanguageService appLanguageService;

    @GetMapping
    @PreAuthorize("hasAuthority('APP_LANGUAGE_VIEW')")
    @Operation(summary = "Get all app languages with pagination and filters")
    public ResponseEntity<ApiResponse<PagedResponse<AppLanguageResponse>>> getAllLanguages(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status) {
        PagedResponse<AppLanguageResponse> languages = appLanguageService.getAllLanguages(search, status, page, size);
        return ResponseEntity.ok(ApiResponse.success(languages));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('APP_LANGUAGE_VIEW')")
    @Operation(summary = "Get app language by ID")
    public ResponseEntity<ApiResponse<AppLanguageResponse>> getLanguageById(@PathVariable UUID id) {
        AppLanguageResponse language = appLanguageService.getLanguageById(id);
        return ResponseEntity.ok(ApiResponse.success(language));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('APP_LANGUAGE_CREATE')")
    @Operation(summary = "Create a new app language")
    public ResponseEntity<ApiResponse<AppLanguageResponse>> createLanguage(@Valid @RequestBody AppLanguageRequest request) {
        AppLanguageResponse language = appLanguageService.createLanguage(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("App language created successfully", language));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('APP_LANGUAGE_UPDATE')")
    @Operation(summary = "Update an existing app language")
    public ResponseEntity<ApiResponse<AppLanguageResponse>> updateLanguage(
            @PathVariable UUID id,
            @Valid @RequestBody AppLanguageRequest request) {
        AppLanguageResponse language = appLanguageService.updateLanguage(id, request);
        return ResponseEntity.ok(ApiResponse.success("App language updated successfully", language));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('APP_LANGUAGE_DELETE')")
    @Operation(summary = "Soft delete an app language")
    public ResponseEntity<ApiResponse<Void>> deleteLanguage(@PathVariable UUID id) {
        appLanguageService.deleteLanguage(id);
        return ResponseEntity.ok(ApiResponse.success("App language deleted successfully", null));
    }
}
