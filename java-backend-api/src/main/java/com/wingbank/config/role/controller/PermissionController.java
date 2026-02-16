package com.wingbank.config.role.controller;

import com.wingbank.config.common.dto.ApiResponse;
import com.wingbank.config.common.dto.PagedResponse;
import com.wingbank.config.role.dto.PermissionRequest;
import com.wingbank.config.role.dto.PermissionResponse;
import com.wingbank.config.role.service.PermissionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/permissions")
@Tag(name = "Permissions")
@RequiredArgsConstructor
public class PermissionController {

    private final PermissionService permissionService;

    @GetMapping
    @PreAuthorize("hasAuthority('PERMISSION_VIEW')")
    @Operation(summary = "Get all permissions with pagination and filters")
    public ResponseEntity<ApiResponse<PagedResponse<PermissionResponse>>> getAllPermissions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String module) {
        PagedResponse<PermissionResponse> permissions = permissionService.getAllPermissions(search, module, page, size);
        return ResponseEntity.ok(ApiResponse.success(permissions));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('PERMISSION_VIEW')")
    @Operation(summary = "Get permission by ID")
    public ResponseEntity<ApiResponse<PermissionResponse>> getPermissionById(@PathVariable UUID id) {
        PermissionResponse permission = permissionService.getPermissionById(id);
        return ResponseEntity.ok(ApiResponse.success(permission));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('PERMISSION_CREATE')")
    @Operation(summary = "Create a new permission")
    public ResponseEntity<ApiResponse<PermissionResponse>> createPermission(@Valid @RequestBody PermissionRequest request) {
        PermissionResponse permission = permissionService.createPermission(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Permission created successfully", permission));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('PERMISSION_UPDATE')")
    @Operation(summary = "Update an existing permission")
    public ResponseEntity<ApiResponse<PermissionResponse>> updatePermission(
            @PathVariable UUID id,
            @Valid @RequestBody PermissionRequest request) {
        PermissionResponse permission = permissionService.updatePermission(id, request);
        return ResponseEntity.ok(ApiResponse.success("Permission updated successfully", permission));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('PERMISSION_DELETE')")
    @Operation(summary = "Soft delete a permission")
    public ResponseEntity<ApiResponse<Void>> deletePermission(@PathVariable UUID id) {
        permissionService.deletePermission(id);
        return ResponseEntity.ok(ApiResponse.success("Permission deleted successfully", null));
    }

    @GetMapping("/modules")
    @PreAuthorize("hasAuthority('PERMISSION_VIEW')")
    @Operation(summary = "Get distinct module names")
    public ResponseEntity<ApiResponse<List<String>>> getModules() {
        List<String> modules = permissionService.getModules();
        return ResponseEntity.ok(ApiResponse.success(modules));
    }
}
