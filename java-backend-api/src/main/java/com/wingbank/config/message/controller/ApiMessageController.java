package com.wingbank.config.message.controller;

import com.wingbank.config.common.dto.ApiResponse;
import com.wingbank.config.common.dto.PagedResponse;
import com.wingbank.config.message.dto.ApiMessageRequest;
import com.wingbank.config.message.dto.ApiMessageResponse;
import com.wingbank.config.message.service.ApiMessageService;
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
@RequestMapping("/api/messages")
@Tag(name = "API Messages")
@RequiredArgsConstructor
public class ApiMessageController {

    private final ApiMessageService apiMessageService;

    @GetMapping
    @PreAuthorize("hasAuthority('MESSAGE_VIEW')")
    @Operation(summary = "Get all API messages with pagination and filters")
    public ResponseEntity<ApiResponse<PagedResponse<ApiMessageResponse>>> getAllMessages(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String type) {
        PagedResponse<ApiMessageResponse> messages = apiMessageService.getAllMessages(search, type, page, size);
        return ResponseEntity.ok(ApiResponse.success(messages));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('MESSAGE_VIEW')")
    @Operation(summary = "Get API message by ID")
    public ResponseEntity<ApiResponse<ApiMessageResponse>> getMessageById(@PathVariable UUID id) {
        ApiMessageResponse message = apiMessageService.getMessageById(id);
        return ResponseEntity.ok(ApiResponse.success(message));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('MESSAGE_CREATE')")
    @Operation(summary = "Create a new API message")
    public ResponseEntity<ApiResponse<ApiMessageResponse>> createMessage(@Valid @RequestBody ApiMessageRequest request) {
        ApiMessageResponse message = apiMessageService.createMessage(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("API message created successfully", message));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('MESSAGE_UPDATE')")
    @Operation(summary = "Update an existing API message")
    public ResponseEntity<ApiResponse<ApiMessageResponse>> updateMessage(
            @PathVariable UUID id,
            @Valid @RequestBody ApiMessageRequest request) {
        ApiMessageResponse message = apiMessageService.updateMessage(id, request);
        return ResponseEntity.ok(ApiResponse.success("API message updated successfully", message));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('MESSAGE_DELETE')")
    @Operation(summary = "Soft delete an API message")
    public ResponseEntity<ApiResponse<Void>> deleteMessage(@PathVariable UUID id) {
        apiMessageService.deleteMessage(id);
        return ResponseEntity.ok(ApiResponse.success("API message deleted successfully", null));
    }
}
