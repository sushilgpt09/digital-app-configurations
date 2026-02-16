package com.wingbank.config.translation.controller;

import com.wingbank.config.common.dto.ApiResponse;
import com.wingbank.config.common.dto.PagedResponse;
import com.wingbank.config.translation.dto.TranslationRequest;
import com.wingbank.config.translation.dto.TranslationResponse;
import com.wingbank.config.translation.service.TranslationService;
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
@RequestMapping("/api/translations")
@Tag(name = "Translations")
@RequiredArgsConstructor
public class TranslationController {

    private final TranslationService translationService;

    @GetMapping
    @PreAuthorize("hasAuthority('TRANSLATION_VIEW')")
    @Operation(summary = "Get all translations with pagination and filters")
    public ResponseEntity<ApiResponse<PagedResponse<TranslationResponse>>> getAllTranslations(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String module,
            @RequestParam(required = false) String platform) {
        PagedResponse<TranslationResponse> translations = translationService.getAllTranslations(search, module, platform, page, size);
        return ResponseEntity.ok(ApiResponse.success(translations));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('TRANSLATION_VIEW')")
    @Operation(summary = "Get translation by ID")
    public ResponseEntity<ApiResponse<TranslationResponse>> getTranslationById(@PathVariable UUID id) {
        TranslationResponse translation = translationService.getTranslationById(id);
        return ResponseEntity.ok(ApiResponse.success(translation));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('TRANSLATION_CREATE')")
    @Operation(summary = "Create a new translation")
    public ResponseEntity<ApiResponse<TranslationResponse>> createTranslation(@Valid @RequestBody TranslationRequest request) {
        TranslationResponse translation = translationService.createTranslation(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Translation created successfully", translation));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('TRANSLATION_UPDATE')")
    @Operation(summary = "Update an existing translation")
    public ResponseEntity<ApiResponse<TranslationResponse>> updateTranslation(
            @PathVariable UUID id,
            @Valid @RequestBody TranslationRequest request) {
        TranslationResponse translation = translationService.updateTranslation(id, request);
        return ResponseEntity.ok(ApiResponse.success("Translation updated successfully", translation));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('TRANSLATION_DELETE')")
    @Operation(summary = "Soft delete a translation")
    public ResponseEntity<ApiResponse<Void>> deleteTranslation(@PathVariable UUID id) {
        translationService.deleteTranslation(id);
        return ResponseEntity.ok(ApiResponse.success("Translation deleted successfully", null));
    }
}
