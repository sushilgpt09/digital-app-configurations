package com.wingbank.config.notification.controller;

import com.wingbank.config.common.dto.ApiResponse;
import com.wingbank.config.common.dto.PagedResponse;
import com.wingbank.config.notification.dto.NotificationTemplateRequest;
import com.wingbank.config.notification.dto.NotificationTemplateResponse;
import com.wingbank.config.notification.service.NotificationTemplateService;
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
@RequestMapping("/api/notification-templates")
@Tag(name = "Notification Templates")
@RequiredArgsConstructor
public class NotificationTemplateController {

    private final NotificationTemplateService notificationTemplateService;

    @GetMapping
    @PreAuthorize("hasAuthority('NOTIFICATION_VIEW')")
    @Operation(summary = "Get all notification templates with pagination and filters")
    public ResponseEntity<ApiResponse<PagedResponse<NotificationTemplateResponse>>> getAllTemplates(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String status) {
        PagedResponse<NotificationTemplateResponse> templates = notificationTemplateService.getAllTemplates(search, type, status, page, size);
        return ResponseEntity.ok(ApiResponse.success(templates));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('NOTIFICATION_VIEW')")
    @Operation(summary = "Get notification template by ID")
    public ResponseEntity<ApiResponse<NotificationTemplateResponse>> getTemplateById(@PathVariable UUID id) {
        NotificationTemplateResponse template = notificationTemplateService.getTemplateById(id);
        return ResponseEntity.ok(ApiResponse.success(template));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('NOTIFICATION_CREATE')")
    @Operation(summary = "Create a new notification template")
    public ResponseEntity<ApiResponse<NotificationTemplateResponse>> createTemplate(@Valid @RequestBody NotificationTemplateRequest request) {
        NotificationTemplateResponse template = notificationTemplateService.createTemplate(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Notification template created successfully", template));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('NOTIFICATION_UPDATE')")
    @Operation(summary = "Update an existing notification template")
    public ResponseEntity<ApiResponse<NotificationTemplateResponse>> updateTemplate(
            @PathVariable UUID id,
            @Valid @RequestBody NotificationTemplateRequest request) {
        NotificationTemplateResponse template = notificationTemplateService.updateTemplate(id, request);
        return ResponseEntity.ok(ApiResponse.success("Notification template updated successfully", template));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('NOTIFICATION_DELETE')")
    @Operation(summary = "Soft delete a notification template")
    public ResponseEntity<ApiResponse<Void>> deleteTemplate(@PathVariable UUID id) {
        notificationTemplateService.deleteTemplate(id);
        return ResponseEntity.ok(ApiResponse.success("Notification template deleted successfully", null));
    }
}
