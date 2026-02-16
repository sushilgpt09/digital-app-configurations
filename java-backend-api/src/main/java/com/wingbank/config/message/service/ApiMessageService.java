package com.wingbank.config.message.service;

import com.wingbank.config.common.dto.PagedResponse;
import com.wingbank.config.message.dto.ApiMessageRequest;
import com.wingbank.config.message.dto.ApiMessageResponse;

import java.util.List;
import java.util.Map;
import java.util.UUID;

public interface ApiMessageService {

    PagedResponse<ApiMessageResponse> getAllMessages(String search, String type, int page, int size);

    ApiMessageResponse getMessageById(UUID id);

    ApiMessageResponse createMessage(ApiMessageRequest request);

    ApiMessageResponse updateMessage(UUID id, ApiMessageRequest request);

    void deleteMessage(UUID id);

    Map<String, String> getMessageMap(String lang);
}
