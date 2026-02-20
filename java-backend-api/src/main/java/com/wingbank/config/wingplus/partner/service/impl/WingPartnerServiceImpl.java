package com.wingbank.config.wingplus.partner.service.impl;

import com.wingbank.config.common.dto.PagedResponse;
import com.wingbank.config.common.exception.ResourceNotFoundException;
import com.wingbank.config.wingplus.partner.dto.WingPartnerRequest;
import com.wingbank.config.wingplus.partner.dto.WingPartnerResponse;
import com.wingbank.config.wingplus.partner.dto.WingPartnerTranslationData;
import com.wingbank.config.wingplus.partner.entity.WingPartner;
import com.wingbank.config.wingplus.partner.entity.WingPartnerTranslation;
import com.wingbank.config.wingplus.partner.repository.WingPartnerRepository;
import com.wingbank.config.wingplus.partner.service.WingPartnerService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service @RequiredArgsConstructor @Slf4j
public class WingPartnerServiceImpl implements WingPartnerService {

    private final WingPartnerRepository repository;

    @Override @Transactional(readOnly = true)
    public PagedResponse<WingPartnerResponse> getAll(String status, int page, int size) {
        Page<WingPartner> pg = repository.findAllWithFilters(status, PageRequest.of(page, size));
        return PagedResponse.from(pg, pg.getContent().stream().map(this::toResponse).collect(Collectors.toList()));
    }

    @Override @Transactional(readOnly = true)
    public WingPartnerResponse getById(UUID id) { return toResponse(findOrThrow(id)); }

    @Override @Transactional
    public WingPartnerResponse create(WingPartnerRequest req) {
        WingPartner e = new WingPartner();
        applyFields(e, req);
        return toResponse(repository.save(e));
    }

    @Override @Transactional
    public WingPartnerResponse update(UUID id, WingPartnerRequest req) {
        WingPartner e = findOrThrow(id);
        applyFields(e, req);
        return toResponse(repository.save(e));
    }

    @Override @Transactional
    public void delete(UUID id) {
        WingPartner e = findOrThrow(id);
        e.setDeleted(true);
        repository.save(e);
    }

    private void applyFields(WingPartner e, WingPartnerRequest req) {
        e.setIcon(req.getIcon()); e.setBgColor(req.getBgColor()); e.setBorderColor(req.getBorderColor());
        e.setBadge(req.getBadge()); e.setSortOrder(req.getSortOrder());
        e.setStatus(req.getStatus() != null ? WingPartner.Status.valueOf(req.getStatus()) : WingPartner.Status.ACTIVE);
        e.getTranslations().clear();
        if (req.getTranslations() != null) {
            req.getTranslations().forEach((lang, data) -> {
                WingPartnerTranslation t = new WingPartnerTranslation();
                t.setPartner(e); t.setLanguageCode(lang);
                t.setName(data.getName()); t.setDescription(data.getDescription());
                e.getTranslations().add(t);
            });
        }
    }

    private WingPartner findOrThrow(UUID id) {
        return repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("WingPartner", "id", id));
    }

    private WingPartnerResponse toResponse(WingPartner e) {
        Map<String, WingPartnerTranslationData> translations = new LinkedHashMap<>();
        for (WingPartnerTranslation t : e.getTranslations()) {
            WingPartnerTranslationData d = new WingPartnerTranslationData();
            d.setName(t.getName()); d.setDescription(t.getDescription());
            translations.put(t.getLanguageCode(), d);
        }
        return WingPartnerResponse.builder()
                .id(e.getId()).icon(e.getIcon()).bgColor(e.getBgColor()).borderColor(e.getBorderColor())
                .badge(e.getBadge()).sortOrder(e.getSortOrder()).status(e.getStatus().name())
                .translations(translations).createdAt(e.getCreatedAt()).updatedAt(e.getUpdatedAt()).build();
    }
}
