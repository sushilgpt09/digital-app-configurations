package com.wingbank.config.wingplus.wingservice.service;
import com.wingbank.config.common.dto.PagedResponse;
import com.wingbank.config.wingplus.wingservice.dto.WingServiceRequest;
import com.wingbank.config.wingplus.wingservice.dto.WingServiceResponse;
import java.util.List;
import java.util.UUID;
public interface WingServiceMgmtService {
    PagedResponse<WingServiceResponse> getAll(String status, int page, int size);
    WingServiceResponse getById(UUID id);
    WingServiceResponse create(WingServiceRequest request);
    WingServiceResponse update(UUID id, WingServiceRequest request);
    void delete(UUID id);
    List<WingServiceResponse> getPopularPartners();
    List<WingServiceResponse> getNewPartners();
}
