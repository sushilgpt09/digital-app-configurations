package com.wingbank.config.wingplus.banner.service;
import com.wingbank.config.common.dto.PagedResponse;
import com.wingbank.config.wingplus.banner.dto.WingBannerRequest;
import com.wingbank.config.wingplus.banner.dto.WingBannerResponse;
import java.util.UUID;
public interface WingBannerService {
    PagedResponse<WingBannerResponse> getAll(String status, int page, int size);
    WingBannerResponse getById(UUID id);
    WingBannerResponse create(WingBannerRequest request);
    WingBannerResponse update(UUID id, WingBannerRequest request);
    void delete(UUID id);
}
