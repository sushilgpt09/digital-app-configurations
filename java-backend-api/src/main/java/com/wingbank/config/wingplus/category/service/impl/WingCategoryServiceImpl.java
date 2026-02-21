package com.wingbank.config.wingplus.category.service.impl;

import com.wingbank.config.common.dto.PagedResponse;
import com.wingbank.config.common.exception.BadRequestException;
import com.wingbank.config.common.exception.ResourceNotFoundException;
import com.wingbank.config.wingplus.category.dto.WingCategoryRequest;
import com.wingbank.config.wingplus.category.dto.WingCategoryResponse;
import com.wingbank.config.wingplus.category.dto.WingCategoryTranslationData;
import com.wingbank.config.wingplus.category.entity.WingCategory;
import com.wingbank.config.wingplus.category.entity.WingCategoryTranslation;
import com.wingbank.config.wingplus.category.repository.WingCategoryRepository;
import com.wingbank.config.wingplus.category.service.WingCategoryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import java.util.Map;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service @RequiredArgsConstructor @Slf4j
public class WingCategoryServiceImpl implements WingCategoryService {

    private final WingCategoryRepository repository;

    @Override @Transactional(readOnly = true)
    public PagedResponse<WingCategoryResponse> getAll(String search, String status, int page, int size) {
        Page<WingCategory> pg = repository.findAllWithFilters(search, status, PageRequest.of(page, size));
        return PagedResponse.from(pg, pg.getContent().stream().map(this::toResponse).collect(Collectors.toList()));
    }

    @Override @Transactional(readOnly = true)
    public WingCategoryResponse getById(UUID id) { return toResponse(findOrThrow(id)); }

    @Override @Transactional
    public WingCategoryResponse create(WingCategoryRequest req) {
        if (repository.existsByKey(req.getKey()))
            throw new BadRequestException("Category key already exists: " + req.getKey());
        WingCategory e = new WingCategory();
        applyFields(e, req);
        return toResponse(repository.save(e));
    }

    @Override @Transactional
    public WingCategoryResponse update(UUID id, WingCategoryRequest req) {
        WingCategory e = findOrThrow(id);
        if (!e.getKey().equals(req.getKey()) && repository.existsByKey(req.getKey()))
            throw new BadRequestException("Category key already exists: " + req.getKey());
        applyFields(e, req);
        return toResponse(repository.save(e));
    }

    @Override @Transactional
    public void delete(UUID id) {
        WingCategory e = findOrThrow(id);
        e.setDeleted(true);
        repository.save(e);
    }

    @Override @Transactional(readOnly = true)
    public List<WingCategoryResponse> getActive() {
        return repository.findByStatusOrderBySortOrder(WingCategory.Status.ACTIVE)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    private void applyFields(WingCategory e, WingCategoryRequest req) {
        e.setKey(req.getKey()); e.setIcon(req.getIcon()); e.setSortOrder(req.getSortOrder());
        e.setStatus(req.getStatus() != null ? WingCategory.Status.valueOf(req.getStatus()) : WingCategory.Status.ACTIVE);
        if (req.getTranslations() != null) {
            Map<String, WingCategoryTranslation> existing = e.getTranslations().stream()
                    .collect(java.util.stream.Collectors.toMap(WingCategoryTranslation::getLanguageCode, t -> t));
            e.getTranslations().removeIf(t -> !req.getTranslations().containsKey(t.getLanguageCode()));
            req.getTranslations().forEach((lang, data) -> {
                WingCategoryTranslation t = existing.get(lang);
                if (t != null) {
                    t.setName(data.getName()); t.setDisplayName(data.getDisplayName());
                } else {
                    WingCategoryTranslation newT = new WingCategoryTranslation();
                    newT.setCategory(e); newT.setLanguageCode(lang);
                    newT.setName(data.getName()); newT.setDisplayName(data.getDisplayName());
                    e.getTranslations().add(newT);
                }
            });
        }
    }

    private WingCategory findOrThrow(UUID id) {
        return repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("WingCategory", "id", id));
    }

    private WingCategoryResponse toResponse(WingCategory e) {
        Map<String, WingCategoryTranslationData> translations = new LinkedHashMap<>();
        for (WingCategoryTranslation t : e.getTranslations()) {
            WingCategoryTranslationData d = new WingCategoryTranslationData();
            d.setName(t.getName()); d.setDisplayName(t.getDisplayName());
            translations.put(t.getLanguageCode(), d);
        }
        return WingCategoryResponse.builder()
                .id(e.getId()).key(e.getKey()).icon(e.getIcon())
                .sortOrder(e.getSortOrder()).status(e.getStatus().name())
                .translations(translations).createdAt(e.getCreatedAt()).updatedAt(e.getUpdatedAt()).build();
    }
}
