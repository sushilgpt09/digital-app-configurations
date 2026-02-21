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
    public PagedResponse<WingServiceResponse> getAll(String status, Boolean isPopular, Boolean isNew, int page, int size) {
        Page<WingService> pg;
        if (Boolean.TRUE.equals(isPopular)) {
            pg = repository.findAllPopularWithFilters(status, PageRequest.of(page, size));
        } else if (Boolean.TRUE.equals(isNew)) {
            pg = repository.findAllNewWithFilters(status, PageRequest.of(page, size));
        } else {
            pg = repository.findAllWithFilters(status, PageRequest.of(page, size));
        }
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
        return repository.findByIsPopularAndStatusOrderByPopularSortOrder(true, WingService.Status.ACTIVE)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Override @Transactional(readOnly = true)
    public List<WingServiceResponse> getNewPartners() {
        return repository.findByIsNewAndStatusOrderByNewSortOrder(true, WingService.Status.ACTIVE)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    private void applyFields(WingService e, WingServiceRequest req) {
        e.setIcon(req.getIcon()); e.setImageUrl(req.getImageUrl());
        e.setPopular(req.isPopular()); e.setNew(req.isNew());
        e.setSortOrder(req.getSortOrder());
        e.setStatus(req.getStatus() != null ? WingService.Status.valueOf(req.getStatus()) : WingService.Status.ACTIVE);
        // Popular display config
        e.setPopularSortOrder(req.getPopularSortOrder());
        e.setPopularEmoji(req.getPopularEmoji());
        e.setPopularBgColor(req.getPopularBgColor());
        e.setPopularBorderColor(req.getPopularBorderColor());
        // New display config
        e.setNewSortOrder(req.getNewSortOrder());
        e.setNewBgColor(req.getNewBgColor());
        e.setNewBorderColor(req.getNewBorderColor());
        e.setNewBadge(req.getNewBadge());
        if (req.getTranslations() != null) {
            Map<String, WingServiceTranslation> existing = e.getTranslations().stream()
                    .collect(Collectors.toMap(WingServiceTranslation::getLanguageCode, t -> t));
            e.getTranslations().removeIf(t -> !req.getTranslations().containsKey(t.getLanguageCode()));
            req.getTranslations().forEach((lang, data) -> {
                WingServiceTranslation t = existing.get(lang);
                if (t != null) {
                    t.setTitle(data.getTitle()); t.setDescription(data.getDescription());
                } else {
                    WingServiceTranslation newT = new WingServiceTranslation();
                    newT.setService(e); newT.setLanguageCode(lang);
                    newT.setTitle(data.getTitle()); newT.setDescription(data.getDescription());
                    e.getTranslations().add(newT);
                }
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
                .popularSortOrder(e.getPopularSortOrder()).popularEmoji(e.getPopularEmoji())
                .popularBgColor(e.getPopularBgColor()).popularBorderColor(e.getPopularBorderColor())
                .newSortOrder(e.getNewSortOrder()).newBgColor(e.getNewBgColor())
                .newBorderColor(e.getNewBorderColor()).newBadge(e.getNewBadge())
                .translations(translations).createdAt(e.getCreatedAt()).updatedAt(e.getUpdatedAt()).build();
    }
}
