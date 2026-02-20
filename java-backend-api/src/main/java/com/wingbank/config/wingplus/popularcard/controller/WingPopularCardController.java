package com.wingbank.config.wingplus.popularcard.controller;

import com.wingbank.config.common.dto.ApiResponse;
import com.wingbank.config.common.dto.PagedResponse;
import com.wingbank.config.wingplus.popularcard.dto.WingPopularCardRequest;
import com.wingbank.config.wingplus.popularcard.dto.WingPopularCardResponse;
import com.wingbank.config.wingplus.popularcard.service.WingPopularCardService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/wing/popular-cards")
@Tag(name = "Wing+ Popular Cards")
@RequiredArgsConstructor
public class WingPopularCardController {

    private final WingPopularCardService service;

    @GetMapping
    @PreAuthorize("hasAuthority('WING_POPULAR_CARD_VIEW')")
    public ResponseEntity<ApiResponse<PagedResponse<WingPopularCardResponse>>> getAll(
            @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String status) {
        return ResponseEntity.ok(ApiResponse.success(service.getAll(status, page, size)));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('WING_POPULAR_CARD_VIEW')")
    public ResponseEntity<ApiResponse<WingPopularCardResponse>> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success(service.getById(id)));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('WING_POPULAR_CARD_CREATE')")
    public ResponseEntity<ApiResponse<WingPopularCardResponse>> create(@RequestBody WingPopularCardRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Popular card created", service.create(req)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('WING_POPULAR_CARD_UPDATE')")
    public ResponseEntity<ApiResponse<WingPopularCardResponse>> update(@PathVariable UUID id, @RequestBody WingPopularCardRequest req) {
        return ResponseEntity.ok(ApiResponse.success("Popular card updated", service.update(id, req)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('WING_POPULAR_CARD_DELETE')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable UUID id) {
        service.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Popular card deleted", null));
    }
}
