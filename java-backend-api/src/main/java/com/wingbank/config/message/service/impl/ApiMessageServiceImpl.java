package com.wingbank.config.message.service.impl;

import com.wingbank.config.common.dto.PagedResponse;
import com.wingbank.config.common.exception.BadRequestException;
import com.wingbank.config.common.exception.ResourceNotFoundException;
import com.wingbank.config.message.dto.ApiMessageRequest;
import com.wingbank.config.message.dto.ApiMessageResponse;
import com.wingbank.config.message.entity.ApiMessage;
import com.wingbank.config.message.repository.ApiMessageRepository;
import com.wingbank.config.message.service.ApiMessageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ApiMessageServiceImpl implements ApiMessageService {

    private final ApiMessageRepository apiMessageRepository;

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<ApiMessageResponse> getAllMessages(String search, String type, int page, int size) {
        Page<ApiMessage> messagePage = apiMessageRepository.findAllWithFilters(search, type, PageRequest.of(page, size));
        var content = messagePage.getContent().stream().map(this::toResponse).collect(Collectors.toList());
        return PagedResponse.from(messagePage, content);
    }

    @Override
    @Transactional(readOnly = true)
    public ApiMessageResponse getMessageById(UUID id) {
        ApiMessage message = apiMessageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ApiMessage", "id", id));
        return toResponse(message);
    }

    @Override
    @Transactional
    public ApiMessageResponse createMessage(ApiMessageRequest request) {
        if (apiMessageRepository.existsByErrorCode(request.getErrorCode())) {
            throw new BadRequestException("Error code already exists: " + request.getErrorCode());
        }

        ApiMessage message = new ApiMessage();
        message.setErrorCode(request.getErrorCode());
        message.setEnMessage(request.getEnMessage());
        message.setKmMessage(request.getKmMessage());
        message.setType(request.getType() != null ? ApiMessage.MessageType.valueOf(request.getType()) : ApiMessage.MessageType.ERROR);
        message.setHttpStatus(request.getHttpStatus() != null ? request.getHttpStatus() : 400);

        ApiMessage saved = apiMessageRepository.save(message);
        log.info("ApiMessage created: {}", saved.getErrorCode());
        return toResponse(saved);
    }

    @Override
    @Transactional
    public ApiMessageResponse updateMessage(UUID id, ApiMessageRequest request) {
        ApiMessage message = apiMessageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ApiMessage", "id", id));

        if (!message.getErrorCode().equals(request.getErrorCode()) && apiMessageRepository.existsByErrorCode(request.getErrorCode())) {
            throw new BadRequestException("Error code already exists: " + request.getErrorCode());
        }

        message.setErrorCode(request.getErrorCode());
        message.setEnMessage(request.getEnMessage());
        message.setKmMessage(request.getKmMessage());
        if (request.getType() != null) {
            message.setType(ApiMessage.MessageType.valueOf(request.getType()));
        }
        if (request.getHttpStatus() != null) {
            message.setHttpStatus(request.getHttpStatus());
        }

        ApiMessage saved = apiMessageRepository.save(message);
        log.info("ApiMessage updated: {}", saved.getErrorCode());
        return toResponse(saved);
    }

    @Override
    @Transactional
    public void deleteMessage(UUID id) {
        ApiMessage message = apiMessageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ApiMessage", "id", id));
        message.setDeleted(true);
        apiMessageRepository.save(message);
        log.info("ApiMessage soft deleted: {}", message.getErrorCode());
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, String> getMessageMap(String lang) {
        List<ApiMessage> messages = apiMessageRepository.findAll();
        Map<String, String> result = new LinkedHashMap<>();
        for (ApiMessage m : messages) {
            String value;
            if ("km".equalsIgnoreCase(lang)) {
                value = m.getKmMessage() != null ? m.getKmMessage() : m.getEnMessage();
            } else {
                value = m.getEnMessage() != null ? m.getEnMessage() : m.getKmMessage();
            }
            if (value != null) {
                result.put(m.getErrorCode(), value);
            }
        }
        return result;
    }

    private ApiMessageResponse toResponse(ApiMessage message) {
        return ApiMessageResponse.builder()
                .id(message.getId())
                .errorCode(message.getErrorCode())
                .enMessage(message.getEnMessage())
                .kmMessage(message.getKmMessage())
                .type(message.getType().name())
                .httpStatus(message.getHttpStatus())
                .createdAt(message.getCreatedAt())
                .updatedAt(message.getUpdatedAt())
                .build();
    }
}
