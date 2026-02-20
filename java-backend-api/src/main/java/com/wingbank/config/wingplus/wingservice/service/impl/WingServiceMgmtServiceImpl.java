package com.wingbank.config.wingplus.wingservice.service.impl;

import com.wingbank.config.common.dto.PagedResponse;
import com.wingbank.config.common.exception.ResourceNotFoundException;
import com.wingbank.config.wingplus.wingservice.dto.WingServiceRequest;
import com.wingbank.config.wingplus.wingservice.dto.WingServiceResponse;
import com.wingbank.config.wingplus.wingservice.dto.WingServiceTranslationData;
import com.wingbank.config.wingplus.wingservice.entity.WingService;
import com.wingbank.config.wingplus.wingservice.entity.WingServiceTranslation;
import com.wingbank.config.wingplus.wingservice.repository.WingServiceRepository;
import com.wingbank.config.wingplus.wingservice.service.WingServiceMgmtService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service @RequiredArgsConstructor @Slf4j
public class WingServiceMgmtServiceImpl implements WingServiceMgmtService {

    private final WingServiceRepository repository;

    @Override @Transactional(readOnly = true)
    public PagedResponse<WingServiceResponse> getAll(String status, int page, int size) {
        Page<WingService> pg = repository.findAllWithFilters(status, PageRequest.of(page, size));
        return PagedResponse.from(pg, pg.getContent().stream().map(this::toResponse).collect(Collectors.toList()));
    }

    @Override @Transactional(readOnly = true)
    public WingServiceResponse getById(UUID id) { return toResponse(findOrThrow(id)); }

    @Override @Transactional
    public WingServiceResponse create(WingServiceRequest req) {
        WingService e = new WingService();
        applyFields(e, req);
        return toResponse(repository.save(e));
    }

    @Override @Transactional
    public WingServiceResponse update(UUID id, WingServiceRequest req) {
        WingService e = findOrThrow(id);
        applyFields(e, req);
        return toResponse(repository.save(e));
    }

    @Override @Transactional
    public void delete(UUID id) {
        WingService e = findOrThrow(id);
        e.setDeleted(true);
        repository.save(e);
    }

    @Override @Transactional(readOnly = true)
    public List<WingServiceResponse> getPopularPartners() {
        return repository.findByIsPopularAndStatusOrderBySortOrder(true, WingService.Status.ACTIVE)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Override @Transactional(readOnly = true)
    public List<WingServiceResponse> getNewPartners() {
        return repository.findByIsNewAndStatusOrderBySortOrder(true, WingService.Status.ACTIVE)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    private void applyFields(WingService e, WingServiceRequest req) {
        e.setIcon(req.getIcon()); e.setImageUrl(req.getImageUrl());
        e.setPopular(req.isPopular()); e.setNew(req.isNew());
        e.setSortOrder(req.getSortOrder());
        e.setStatus(req.getStatus() != null ? WingService.Status.valueOf(req.getStatus()) : WingService.Status.ACTIVE);
        e.getTranslations().clear();
        if (req.getTranslations() != null) {
            req.getTranslations().forEach((lang, data) -> {
                WingServiceTranslation t = new WingServiceTranslation();
                t.setService(e); t.setLanguageCode(lang);
                t.setTitle(data.getTitle()); t.setDescription(data.getDescription());
                e.getTranslations().add(t);
            });
        }
    }

    private WingService findOrThrow(UUID id) {
        return repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("WingService", "id", id));
    }

    private WingServiceResponse toResponse(WingService e) {
        Map<String, WingServiceTranslationData> translations = new LinkedHashMap<>();
        for (WingServiceTranslation t : e.getTranslations()) {
            WingServiceTranslationData d = new WingServiceTranslationData();
            d.setTitle(t.getTitle()); d.setDescription(t.getDescription());
            translations.put(t.getLanguageCode(), d);
        }
        return WingServiceResponse.builder()
                .id(e.getId()).icon(e.getIcon()).imageUrl(e.getImageUrl())
                .isPopular(e.isPopular()).isNew(e.isNew())
                .sortOrder(e.getSortOrder()).status(e.getStatus().name())
                .translations(translations).createdAt(e.getCreatedAt()).updatedAt(e.getUpdatedAt()).build();
    }
}
