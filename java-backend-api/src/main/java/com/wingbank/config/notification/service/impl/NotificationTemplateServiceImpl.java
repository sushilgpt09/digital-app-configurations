package com.wingbank.config.notification.service.impl;

import com.wingbank.config.common.dto.PagedResponse;
import com.wingbank.config.common.exception.BadRequestException;
import com.wingbank.config.common.exception.ResourceNotFoundException;
import com.wingbank.config.notification.dto.NotificationTemplateRequest;
import com.wingbank.config.notification.dto.NotificationTemplateResponse;
import com.wingbank.config.notification.entity.NotificationTemplate;
import com.wingbank.config.notification.entity.NotificationTemplateValue;
import com.wingbank.config.notification.repository.NotificationTemplateRepository;
import com.wingbank.config.notification.service.NotificationTemplateService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationTemplateServiceImpl implements NotificationTemplateService {

    private final NotificationTemplateRepository notificationTemplateRepository;

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<NotificationTemplateResponse> getAllTemplates(String search, String type, String status, int page, int size) {
        Page<NotificationTemplate> templatePage = notificationTemplateRepository.findAllWithFilters(search, type, status, PageRequest.of(page, size));
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
        template.setType(NotificationTemplate.NotificationType.valueOf(request.getType()));
        template.setStatus(request.getStatus() != null ? NotificationTemplate.Status.valueOf(request.getStatus()) : NotificationTemplate.Status.ACTIVE);
        applyLanguageValues(template, request.getLanguageValues());

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
        if (request.getType() != null) {
            template.setType(NotificationTemplate.NotificationType.valueOf(request.getType()));
        }
        if (request.getStatus() != null) {
            template.setStatus(NotificationTemplate.Status.valueOf(request.getStatus()));
        }
        applyLanguageValues(template, request.getLanguageValues());

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

    /**
     * Apply language values from request to entity.
     * Request map keys are like "titleEn", "bodyKm" → extract prefix (title/body) and lang code.
     */
    private void applyLanguageValues(NotificationTemplate template, Map<String, String> langValues) {
        if (langValues == null || langValues.isEmpty()) return;

        // Collect title/body per language code
        Map<String, String> titles = new HashMap<>();
        Map<String, String> bodies = new HashMap<>();

        for (Map.Entry<String, String> entry : langValues.entrySet()) {
            String fieldName = entry.getKey();
            if (fieldName.startsWith("title") && fieldName.length() > 5) {
                // "titleEn" → lang code "en" (lowercase first char)
                String langCode = fieldName.substring(5, 6).toLowerCase() + fieldName.substring(6);
                titles.put(langCode, entry.getValue());
            } else if (fieldName.startsWith("body") && fieldName.length() > 4) {
                // "bodyEn" → lang code "en"
                String langCode = fieldName.substring(4, 5).toLowerCase() + fieldName.substring(5);
                bodies.put(langCode, entry.getValue());
            }
        }

        // Merge all language codes
        Set<String> allLangs = new HashSet<>();
        allLangs.addAll(titles.keySet());
        allLangs.addAll(bodies.keySet());

        Map<String, NotificationTemplateValue> existing = new HashMap<>();
        for (NotificationTemplateValue v : template.getValues()) {
            existing.put(v.getLanguageCode(), v);
        }

        for (String langCode : allLangs) {
            NotificationTemplateValue tv = existing.get(langCode);
            if (tv != null) {
                if (titles.containsKey(langCode)) tv.setTitle(titles.get(langCode));
                if (bodies.containsKey(langCode)) tv.setBody(bodies.get(langCode));
            } else {
                NotificationTemplateValue newTv = new NotificationTemplateValue();
                newTv.setNotificationTemplate(template);
                newTv.setLanguageCode(langCode);
                newTv.setTitle(titles.get(langCode));
                newTv.setBody(bodies.get(langCode));
                template.getValues().add(newTv);
            }
        }
    }

    private NotificationTemplateResponse toResponse(NotificationTemplate template) {
        Map<String, String> langMap = new HashMap<>();
        if (template.getValues() != null) {
            for (NotificationTemplateValue v : template.getValues()) {
                // "en" → "titleEn", "bodyEn"
                String cap = v.getLanguageCode().substring(0, 1).toUpperCase() + v.getLanguageCode().substring(1);
                if (v.getTitle() != null) {
                    langMap.put("title" + cap, v.getTitle());
                }
                if (v.getBody() != null) {
                    langMap.put("body" + cap, v.getBody());
                }
            }
        }

        return NotificationTemplateResponse.builder()
                .id(template.getId())
                .code(template.getCode())
                .type(template.getType().name())
                .status(template.getStatus().name())
                .createdAt(template.getCreatedAt())
                .updatedAt(template.getUpdatedAt())
                .languageValues(langMap)
                .build();
    }
}
