package com.wingbank.config.notification.service.impl;

import com.wingbank.config.common.dto.PagedResponse;
import com.wingbank.config.common.exception.BadRequestException;
import com.wingbank.config.common.exception.ResourceNotFoundException;
import com.wingbank.config.notification.dto.NotificationTemplateRequest;
import com.wingbank.config.notification.dto.NotificationTemplateResponse;
import com.wingbank.config.notification.entity.NotificationTemplate;
import com.wingbank.config.notification.repository.NotificationTemplateRepository;
import com.wingbank.config.notification.service.NotificationTemplateService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationTemplateServiceImpl implements NotificationTemplateService {

    private final NotificationTemplateRepository notificationTemplateRepository;

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<NotificationTemplateResponse> getAllTemplates(String search, String type, String status, int page, int size) {
        NotificationTemplate.NotificationType typeEnum = type != null ? NotificationTemplate.NotificationType.valueOf(type) : null;
        NotificationTemplate.Status statusEnum = status != null ? NotificationTemplate.Status.valueOf(status) : null;
        Page<NotificationTemplate> templatePage = notificationTemplateRepository.findAllWithFilters(search, typeEnum, statusEnum, PageRequest.of(page, size));
        var content = templatePage.getContent().stream().map(this::toResponse).collect(Collectors.toList());
        return PagedResponse.from(templatePage, content);
    }

    @Override
    @Transactional(readOnly = true)
    public NotificationTemplateResponse getTemplateById(UUID id) {
        NotificationTemplate template = notificationTemplateRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("NotificationTemplate", "id", id));
        return toResponse(template);
    }

    @Override
    @Transactional
    public NotificationTemplateResponse createTemplate(NotificationTemplateRequest request) {
        if (notificationTemplateRepository.existsByCode(request.getCode())) {
            throw new BadRequestException("Template code already exists: " + request.getCode());
        }

        NotificationTemplate template = new NotificationTemplate();
        template.setCode(request.getCode());
        template.setTitleEn(request.getTitleEn());
        template.setTitleKm(request.getTitleKm());
        template.setBodyEn(request.getBodyEn());
        template.setBodyKm(request.getBodyKm());
        template.setType(NotificationTemplate.NotificationType.valueOf(request.getType()));
        template.setStatus(request.getStatus() != null ? NotificationTemplate.Status.valueOf(request.getStatus()) : NotificationTemplate.Status.ACTIVE);

        NotificationTemplate saved = notificationTemplateRepository.save(template);
        log.info("NotificationTemplate created: {}", saved.getCode());
        return toResponse(saved);
    }

    @Override
    @Transactional
    public NotificationTemplateResponse updateTemplate(UUID id, NotificationTemplateRequest request) {
        NotificationTemplate template = notificationTemplateRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("NotificationTemplate", "id", id));

        if (!template.getCode().equals(request.getCode()) && notificationTemplateRepository.existsByCode(request.getCode())) {
            throw new BadRequestException("Template code already exists: " + request.getCode());
        }

        template.setCode(request.getCode());
        template.setTitleEn(request.getTitleEn());
        template.setTitleKm(request.getTitleKm());
        template.setBodyEn(request.getBodyEn());
        template.setBodyKm(request.getBodyKm());
        if (request.getType() != null) {
            template.setType(NotificationTemplate.NotificationType.valueOf(request.getType()));
        }
        if (request.getStatus() != null) {
            template.setStatus(NotificationTemplate.Status.valueOf(request.getStatus()));
        }

        NotificationTemplate saved = notificationTemplateRepository.save(template);
        log.info("NotificationTemplate updated: {}", saved.getCode());
        return toResponse(saved);
    }

    @Override
    @Transactional
    public void deleteTemplate(UUID id) {
        NotificationTemplate template = notificationTemplateRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("NotificationTemplate", "id", id));
        template.setDeleted(true);
        notificationTemplateRepository.save(template);
        log.info("NotificationTemplate soft deleted: {}", template.getCode());
    }

    private NotificationTemplateResponse toResponse(NotificationTemplate template) {
        return NotificationTemplateResponse.builder()
                .id(template.getId())
                .code(template.getCode())
                .titleEn(template.getTitleEn())
                .titleKm(template.getTitleKm())
                .bodyEn(template.getBodyEn())
                .bodyKm(template.getBodyKm())
                .type(template.getType().name())
                .status(template.getStatus().name())
                .createdAt(template.getCreatedAt())
                .updatedAt(template.getUpdatedAt())
                .build();
    }
}
