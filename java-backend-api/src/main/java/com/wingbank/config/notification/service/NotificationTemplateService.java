package com.wingbank.config.notification.service;

import com.wingbank.config.common.dto.PagedResponse;
import com.wingbank.config.notification.dto.NotificationTemplateRequest;
import com.wingbank.config.notification.dto.NotificationTemplateResponse;

import java.util.UUID;

public interface NotificationTemplateService {

    PagedResponse<NotificationTemplateResponse> getAllTemplates(String search, String type, String status, int page, int size);

    NotificationTemplateResponse getTemplateById(UUID id);

    NotificationTemplateResponse createTemplate(NotificationTemplateRequest request);

    NotificationTemplateResponse updateTemplate(UUID id, NotificationTemplateRequest request);

    void deleteTemplate(UUID id);
}
