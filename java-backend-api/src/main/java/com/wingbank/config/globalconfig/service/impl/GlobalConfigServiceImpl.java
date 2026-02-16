package com.wingbank.config.globalconfig.service.impl;

import com.wingbank.config.common.dto.PagedResponse;
import com.wingbank.config.common.exception.ResourceNotFoundException;
import com.wingbank.config.globalconfig.dto.GlobalConfigRequest;
import com.wingbank.config.globalconfig.dto.GlobalConfigResponse;
import com.wingbank.config.globalconfig.entity.GlobalConfig;
import com.wingbank.config.globalconfig.repository.GlobalConfigRepository;
import com.wingbank.config.globalconfig.service.GlobalConfigService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class GlobalConfigServiceImpl implements GlobalConfigService {

    private final GlobalConfigRepository globalConfigRepository;

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<GlobalConfigResponse> getAllConfigs(String search, String platform, String status, int page, int size) {
        GlobalConfig.Status statusEnum = status != null ? GlobalConfig.Status.valueOf(status) : null;
        Page<GlobalConfig> configPage = globalConfigRepository.findAllWithFilters(search, platform, statusEnum, PageRequest.of(page, size));
        var content = configPage.getContent().stream().map(this::toResponse).collect(Collectors.toList());
        return PagedResponse.from(configPage, content);
    }

    @Override
    @Transactional(readOnly = true)
    public GlobalConfigResponse getConfigById(UUID id) {
        GlobalConfig config = globalConfigRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("GlobalConfig", "id", id));
        return toResponse(config);
    }

    @Override
    @Transactional
    public GlobalConfigResponse createConfig(GlobalConfigRequest request) {
        GlobalConfig config = new GlobalConfig();
        config.setConfigKey(request.getConfigKey());
        config.setConfigValue(request.getConfigValue());
        config.setPlatform(request.getPlatform() != null ? request.getPlatform() : "ALL");
        config.setVersion(request.getVersion() != null ? request.getVersion() : "1.0");
        config.setDescription(request.getDescription());
        config.setStatus(request.getStatus() != null ? GlobalConfig.Status.valueOf(request.getStatus()) : GlobalConfig.Status.ACTIVE);

        GlobalConfig saved = globalConfigRepository.save(config);
        log.info("GlobalConfig created: {}", saved.getConfigKey());
        return toResponse(saved);
    }

    @Override
    @Transactional
    public GlobalConfigResponse updateConfig(UUID id, GlobalConfigRequest request) {
        GlobalConfig config = globalConfigRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("GlobalConfig", "id", id));

        config.setConfigKey(request.getConfigKey());
        config.setConfigValue(request.getConfigValue());
        if (request.getPlatform() != null) {
            config.setPlatform(request.getPlatform());
        }
        if (request.getVersion() != null) {
            config.setVersion(request.getVersion());
        }
        config.setDescription(request.getDescription());
        if (request.getStatus() != null) {
            config.setStatus(GlobalConfig.Status.valueOf(request.getStatus()));
        }

        GlobalConfig saved = globalConfigRepository.save(config);
        log.info("GlobalConfig updated: {}", saved.getConfigKey());
        return toResponse(saved);
    }

    @Override
    @Transactional
    public void deleteConfig(UUID id) {
        GlobalConfig config = globalConfigRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("GlobalConfig", "id", id));
        config.setDeleted(true);
        globalConfigRepository.save(config);
        log.info("GlobalConfig soft deleted: {}", config.getConfigKey());
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, String> getActiveConfigMap(String platform) {
        String resolvedPlatform = platform != null ? platform : "ALL";
        List<GlobalConfig> configs = globalConfigRepository.findByPlatformActive(resolvedPlatform);
        Map<String, String> result = new LinkedHashMap<>();
        for (GlobalConfig c : configs) {
            result.put(c.getConfigKey(), c.getConfigValue());
        }
        return result;
    }

    private GlobalConfigResponse toResponse(GlobalConfig config) {
        return GlobalConfigResponse.builder()
                .id(config.getId())
                .configKey(config.getConfigKey())
                .configValue(config.getConfigValue())
                .platform(config.getPlatform())
                .version(config.getVersion())
                .description(config.getDescription())
                .status(config.getStatus().name())
                .createdAt(config.getCreatedAt())
                .updatedAt(config.getUpdatedAt())
                .build();
    }
}
