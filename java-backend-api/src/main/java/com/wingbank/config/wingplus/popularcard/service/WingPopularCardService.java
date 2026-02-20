package com.wingbank.config.wingplus.popularcard.service;
import com.wingbank.config.common.dto.PagedResponse;
import com.wingbank.config.wingplus.popularcard.dto.WingPopularCardRequest;
import com.wingbank.config.wingplus.popularcard.dto.WingPopularCardResponse;
import java.util.UUID;
public interface WingPopularCardService {
    PagedResponse<WingPopularCardResponse> getAll(String status, int page, int size);
    WingPopularCardResponse getById(UUID id);
    WingPopularCardResponse create(WingPopularCardRequest request);
    WingPopularCardResponse update(UUID id, WingPopularCardRequest request);
    void delete(UUID id);
}
