package com.wingbank.config.wingplus.partner.service;
import com.wingbank.config.common.dto.PagedResponse;
import com.wingbank.config.wingplus.partner.dto.WingPartnerRequest;
import com.wingbank.config.wingplus.partner.dto.WingPartnerResponse;
import java.util.UUID;
public interface WingPartnerService {
    PagedResponse<WingPartnerResponse> getAll(String status, int page, int size);
    WingPartnerResponse getById(UUID id);
    WingPartnerResponse create(WingPartnerRequest request);
    WingPartnerResponse update(UUID id, WingPartnerRequest request);
    void delete(UUID id);
}
