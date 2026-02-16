package com.wingbank.config.audit.service;

import com.wingbank.config.audit.entity.AuditLog;
import com.wingbank.config.audit.repository.AuditLogRepository;
import com.wingbank.config.common.dto.PagedResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;

    @Async
    public void log(AuditLog auditLog) {
        try {
            auditLogRepository.save(auditLog);
        } catch (Exception e) {
            log.error("Failed to save audit log: {}", e.getMessage());
        }
    }

    public PagedResponse<AuditLog> getAuditLogs(String search, String entityType, String action,
                                                  LocalDateTime from, LocalDateTime to,
                                                  int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<AuditLog> auditPage = auditLogRepository.findAllWithFilters(search, entityType, action, from, to, pageable);
        return PagedResponse.from(auditPage, auditPage.getContent());
    }
}
