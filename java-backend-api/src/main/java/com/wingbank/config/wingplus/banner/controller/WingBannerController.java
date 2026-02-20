package com.wingbank.config.wingplus.banner.controller;

import com.wingbank.config.common.dto.ApiResponse;
import com.wingbank.config.common.dto.PagedResponse;
import com.wingbank.config.wingplus.banner.dto.WingBannerRequest;
import com.wingbank.config.wingplus.banner.dto.WingBannerResponse;
import com.wingbank.config.wingplus.banner.service.WingBannerService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/wing/banners")
@Tag(name = "Wing+ Banners")
@RequiredArgsConstructor
public class WingBannerController {

    private final WingBannerService service;

    @GetMapping
    @PreAuthorize("hasAuthority('WING_BANNER_VIEW')")
    public ResponseEntity<ApiResponse<PagedResponse<WingBannerResponse>>> getAll(
            @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String status) {
        return ResponseEntity.ok(ApiResponse.success(service.getAll(status, page, size)));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('WING_BANNER_VIEW')")
    public ResponseEntity<ApiResponse<WingBannerResponse>> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success(service.getById(id)));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('WING_BANNER_CREATE')")
    public ResponseEntity<ApiResponse<WingBannerResponse>> create(@RequestBody WingBannerRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Banner created", service.create(req)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('WING_BANNER_UPDATE')")
    public ResponseEntity<ApiResponse<WingBannerResponse>> update(@PathVariable UUID id, @RequestBody WingBannerRequest req) {
        return ResponseEntity.ok(ApiResponse.success("Banner updated", service.update(id, req)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('WING_BANNER_DELETE')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable UUID id) {
        service.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Banner deleted", null));
    }
}
