package com.wingbank.config.wingplus.wingservice.controller;

import com.wingbank.config.common.dto.ApiResponse;
import com.wingbank.config.common.dto.PagedResponse;
import com.wingbank.config.wingplus.wingservice.dto.WingServiceRequest;
import com.wingbank.config.wingplus.wingservice.dto.WingServiceResponse;
import com.wingbank.config.wingplus.wingservice.service.WingServiceMgmtService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/wing/services")
@Tag(name = "Wing+ Partners (Services)")
@RequiredArgsConstructor
public class WingServiceController {

    private final WingServiceMgmtService service;

    @GetMapping
    @PreAuthorize("hasAuthority('WING_SERVICE_VIEW')")
    public ResponseEntity<ApiResponse<PagedResponse<WingServiceResponse>>> getAll(
            @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String status) {
        return ResponseEntity.ok(ApiResponse.success(service.getAll(status, page, size)));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('WING_SERVICE_VIEW')")
    public ResponseEntity<ApiResponse<WingServiceResponse>> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success(service.getById(id)));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('WING_SERVICE_CREATE')")
    public ResponseEntity<ApiResponse<WingServiceResponse>> create(@Valid @RequestBody WingServiceRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Partner created", service.create(req)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('WING_SERVICE_UPDATE')")
    public ResponseEntity<ApiResponse<WingServiceResponse>> update(@PathVariable UUID id, @Valid @RequestBody WingServiceRequest req) {
        return ResponseEntity.ok(ApiResponse.success("Partner updated", service.update(id, req)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('WING_SERVICE_DELETE')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable UUID id) {
        service.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Partner deleted", null));
    }
}
