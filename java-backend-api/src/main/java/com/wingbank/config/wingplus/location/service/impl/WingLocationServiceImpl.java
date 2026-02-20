package com.wingbank.config.wingplus.location.service.impl;

import com.wingbank.config.common.dto.PagedResponse;
import com.wingbank.config.common.exception.ResourceNotFoundException;
import com.wingbank.config.wingplus.location.dto.WingLocationRequest;
import com.wingbank.config.wingplus.location.dto.WingLocationResponse;
import com.wingbank.config.wingplus.location.entity.WingLocation;
import com.wingbank.config.wingplus.location.repository.WingLocationRepository;
import com.wingbank.config.wingplus.location.service.WingLocationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service @RequiredArgsConstructor @Slf4j
public class WingLocationServiceImpl implements WingLocationService {

    private final WingLocationRepository repository;

    @Override @Transactional(readOnly = true)
    public PagedResponse<WingLocationResponse> getAll(String search, String status, int page, int size) {
        Page<WingLocation> pg = repository.findAllWithFilters(search, status, PageRequest.of(page, size));
        return PagedResponse.from(pg, pg.getContent().stream().map(this::toResponse).collect(Collectors.toList()));
    }

    @Override @Transactional(readOnly = true)
    public WingLocationResponse getById(UUID id) { return toResponse(findOrThrow(id)); }

    @Override @Transactional
    public WingLocationResponse create(WingLocationRequest req) {
        WingLocation e = new WingLocation();
        e.setName(req.getName()); e.setIcon(req.getIcon()); e.setSortOrder(req.getSortOrder());
        e.setStatus(req.getStatus() != null ? WingLocation.Status.valueOf(req.getStatus()) : WingLocation.Status.ACTIVE);
        return toResponse(repository.save(e));
    }

    @Override @Transactional
    public WingLocationResponse update(UUID id, WingLocationRequest req) {
        WingLocation e = findOrThrow(id);
        e.setName(req.getName()); e.setIcon(req.getIcon()); e.setSortOrder(req.getSortOrder());
        if (req.getStatus() != null) e.setStatus(WingLocation.Status.valueOf(req.getStatus()));
        return toResponse(repository.save(e));
    }

    @Override @Transactional
    public void delete(UUID id) {
        WingLocation e = findOrThrow(id);
        e.setDeleted(true);
        repository.save(e);
    }

    @Override @Transactional(readOnly = true)
    public List<WingLocationResponse> getActive() {
        return repository.findByStatusOrderBySortOrder(WingLocation.Status.ACTIVE)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    private WingLocation findOrThrow(UUID id) {
        return repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("WingLocation", "id", id));
    }

    private WingLocationResponse toResponse(WingLocation e) {
        return WingLocationResponse.builder()
                .id(e.getId()).name(e.getName()).icon(e.getIcon())
                .sortOrder(e.getSortOrder()).status(e.getStatus().name())
                .createdAt(e.getCreatedAt()).updatedAt(e.getUpdatedAt()).build();
    }
}
