package com.wingbank.config.wingplus.partner.controller;

import com.wingbank.config.common.dto.ApiResponse;
import com.wingbank.config.common.dto.PagedResponse;
import com.wingbank.config.wingplus.partner.dto.WingPartnerRequest;
import com.wingbank.config.wingplus.partner.dto.WingPartnerResponse;
import com.wingbank.config.wingplus.partner.service.WingPartnerService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/wing/partners")
@Tag(name = "Wing+ Partners")
@RequiredArgsConstructor
public class WingPartnerController {

    private final WingPartnerService service;

    @GetMapping
    @PreAuthorize("hasAuthority('WING_PARTNER_VIEW')")
    public ResponseEntity<ApiResponse<PagedResponse<WingPartnerResponse>>> getAll(
            @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String status) {
        return ResponseEntity.ok(ApiResponse.success(service.getAll(status, page, size)));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('WING_PARTNER_VIEW')")
    public ResponseEntity<ApiResponse<WingPartnerResponse>> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success(service.getById(id)));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('WING_PARTNER_CREATE')")
    public ResponseEntity<ApiResponse<WingPartnerResponse>> create(@RequestBody WingPartnerRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Partner created", service.create(req)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('WING_PARTNER_UPDATE')")
    public ResponseEntity<ApiResponse<WingPartnerResponse>> update(@PathVariable UUID id, @RequestBody WingPartnerRequest req) {
        return ResponseEntity.ok(ApiResponse.success("Partner updated", service.update(id, req)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('WING_PARTNER_DELETE')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable UUID id) {
        service.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Partner deleted", null));
    }
}
