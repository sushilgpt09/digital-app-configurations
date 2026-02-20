package com.wingbank.config.wingplus.category.controller;

import com.wingbank.config.common.dto.ApiResponse;
import com.wingbank.config.common.dto.PagedResponse;
import com.wingbank.config.wingplus.category.dto.WingCategoryRequest;
import com.wingbank.config.wingplus.category.dto.WingCategoryResponse;
import com.wingbank.config.wingplus.category.service.WingCategoryService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/wing/categories")
@Tag(name = "Wing+ Categories")
@RequiredArgsConstructor
public class WingCategoryController {

    private final WingCategoryService service;

    @GetMapping
    @PreAuthorize("hasAuthority('WING_CATEGORY_VIEW')")
    public ResponseEntity<ApiResponse<PagedResponse<WingCategoryResponse>>> getAll(
            @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search, @RequestParam(required = false) String status) {
        return ResponseEntity.ok(ApiResponse.success(service.getAll(search, status, page, size)));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('WING_CATEGORY_VIEW')")
    public ResponseEntity<ApiResponse<WingCategoryResponse>> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success(service.getById(id)));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('WING_CATEGORY_CREATE')")
    public ResponseEntity<ApiResponse<WingCategoryResponse>> create(@Valid @RequestBody WingCategoryRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Category created", service.create(req)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('WING_CATEGORY_UPDATE')")
    public ResponseEntity<ApiResponse<WingCategoryResponse>> update(@PathVariable UUID id, @Valid @RequestBody WingCategoryRequest req) {
        return ResponseEntity.ok(ApiResponse.success("Category updated", service.update(id, req)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('WING_CATEGORY_DELETE')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable UUID id) {
        service.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Category deleted", null));
    }
}
