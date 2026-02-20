package com.wingbank.config.wingplus.location.controller;

import com.wingbank.config.common.dto.ApiResponse;
import com.wingbank.config.common.dto.PagedResponse;
import com.wingbank.config.wingplus.location.dto.WingLocationRequest;
import com.wingbank.config.wingplus.location.dto.WingLocationResponse;
import com.wingbank.config.wingplus.location.service.WingLocationService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/wing/locations")
@Tag(name = "Wing+ Locations")
@RequiredArgsConstructor
public class WingLocationController {

    private final WingLocationService service;

    @GetMapping
    @PreAuthorize("hasAuthority('WING_LOCATION_VIEW')")
    public ResponseEntity<ApiResponse<PagedResponse<WingLocationResponse>>> getAll(
            @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search, @RequestParam(required = false) String status) {
        return ResponseEntity.ok(ApiResponse.success(service.getAll(search, status, page, size)));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('WING_LOCATION_VIEW')")
    public ResponseEntity<ApiResponse<WingLocationResponse>> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success(service.getById(id)));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('WING_LOCATION_CREATE')")
    public ResponseEntity<ApiResponse<WingLocationResponse>> create(@Valid @RequestBody WingLocationRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Location created", service.create(req)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('WING_LOCATION_UPDATE')")
    public ResponseEntity<ApiResponse<WingLocationResponse>> update(@PathVariable UUID id, @Valid @RequestBody WingLocationRequest req) {
        return ResponseEntity.ok(ApiResponse.success("Location updated", service.update(id, req)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('WING_LOCATION_DELETE')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable UUID id) {
        service.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Location deleted", null));
    }
}
