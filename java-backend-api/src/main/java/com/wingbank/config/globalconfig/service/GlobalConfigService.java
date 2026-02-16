package com.wingbank.config.globalconfig.service;

import com.wingbank.config.common.dto.PagedResponse;
import com.wingbank.config.globalconfig.dto.GlobalConfigRequest;
import com.wingbank.config.globalconfig.dto.GlobalConfigResponse;

import java.util.Map;
import java.util.UUID;

public interface GlobalConfigService {

    PagedResponse<GlobalConfigResponse> getAllConfigs(String search, String platform, String status, int page, int size);

    GlobalConfigResponse getConfigById(UUID id);

    GlobalConfigResponse createConfig(GlobalConfigRequest request);

    GlobalConfigResponse updateConfig(UUID id, GlobalConfigRequest request);

    void deleteConfig(UUID id);

    Map<String, String> getActiveConfigMap(String platform);
}
