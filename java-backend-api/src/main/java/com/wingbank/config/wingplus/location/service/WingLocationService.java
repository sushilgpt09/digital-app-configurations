package com.wingbank.config.wingplus.location.service;

import com.wingbank.config.common.dto.PagedResponse;
import com.wingbank.config.wingplus.location.dto.WingLocationRequest;
import com.wingbank.config.wingplus.location.dto.WingLocationResponse;

import java.util.List;
import java.util.UUID;

public interface WingLocationService {
    PagedResponse<WingLocationResponse> getAll(String search, String status, int page, int size);
    WingLocationResponse getById(UUID id);
    WingLocationResponse create(WingLocationRequest request);
    WingLocationResponse update(UUID id, WingLocationRequest request);
    void delete(UUID id);
    List<WingLocationResponse> getActive();
}
