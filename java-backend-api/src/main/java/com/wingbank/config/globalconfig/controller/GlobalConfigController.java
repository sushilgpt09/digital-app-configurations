package com.wingbank.config.globalconfig.controller;

import com.wingbank.config.common.dto.ApiResponse;
import com.wingbank.config.common.dto.PagedResponse;
import com.wingbank.config.globalconfig.dto.GlobalConfigRequest;
import com.wingbank.config.globalconfig.dto.GlobalConfigResponse;
import com.wingbank.config.globalconfig.service.GlobalConfigService;
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
@RequestMapping("/api/global-configs")
@Tag(name = "Global Configs")
@RequiredArgsConstructor
public class GlobalConfigController {

    private final GlobalConfigService globalConfigService;

    @GetMapping
    @PreAuthorize("hasAuthority('CONFIG_VIEW')")
    @Operation(summary = "Get all global configs with pagination and filters")
    public ResponseEntity<ApiResponse<PagedResponse<GlobalConfigResponse>>> getAllConfigs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String platform,
            @RequestParam(required = false) String status) {
        PagedResponse<GlobalConfigResponse> configs = globalConfigService.getAllConfigs(search, platform, status, page, size);
        return ResponseEntity.ok(ApiResponse.success(configs));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('CONFIG_VIEW')")
    @Operation(summary = "Get global config by ID")
    public ResponseEntity<ApiResponse<GlobalConfigResponse>> getConfigById(@PathVariable UUID id) {
        GlobalConfigResponse config = globalConfigService.getConfigById(id);
        return ResponseEntity.ok(ApiResponse.success(config));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('CONFIG_CREATE')")
    @Operation(summary = "Create a new global config")
    public ResponseEntity<ApiResponse<GlobalConfigResponse>> createConfig(@Valid @RequestBody GlobalConfigRequest request) {
        GlobalConfigResponse config = globalConfigService.createConfig(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Global config created successfully", config));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('CONFIG_UPDATE')")
    @Operation(summary = "Update an existing global config")
    public ResponseEntity<ApiResponse<GlobalConfigResponse>> updateConfig(
            @PathVariable UUID id,
            @Valid @RequestBody GlobalConfigRequest request) {
        GlobalConfigResponse config = globalConfigService.updateConfig(id, request);
        return ResponseEntity.ok(ApiResponse.success("Global config updated successfully", config));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('CONFIG_DELETE')")
    @Operation(summary = "Soft delete a global config")
    public ResponseEntity<ApiResponse<Void>> deleteConfig(@PathVariable UUID id) {
        globalConfigService.deleteConfig(id);
        return ResponseEntity.ok(ApiResponse.success("Global config deleted successfully", null));
    }
}
