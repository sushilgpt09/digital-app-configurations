package com.wingbank.config.wingplus.category.service;

import com.wingbank.config.common.dto.PagedResponse;
import com.wingbank.config.wingplus.category.dto.WingCategoryRequest;
import com.wingbank.config.wingplus.category.dto.WingCategoryResponse;

import java.util.List;
import java.util.UUID;

public interface WingCategoryService {
    PagedResponse<WingCategoryResponse> getAll(String search, String status, int page, int size);
    WingCategoryResponse getById(UUID id);
    WingCategoryResponse create(WingCategoryRequest request);
    WingCategoryResponse update(UUID id, WingCategoryRequest request);
    void delete(UUID id);
    List<WingCategoryResponse> getActive();
}
