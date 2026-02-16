package com.wingbank.config.user.service;

import com.wingbank.config.common.dto.PagedResponse;
import com.wingbank.config.user.dto.UserRequest;
import com.wingbank.config.user.dto.UserResponse;

import java.util.Set;
import java.util.UUID;

public interface UserService {

    PagedResponse<UserResponse> getAllUsers(String search, String status, int page, int size);

    UserResponse getUserById(UUID id);

    UserResponse createUser(UserRequest request);

    UserResponse updateUser(UUID id, UserRequest request);

    void deleteUser(UUID id);

    UserResponse assignRoles(UUID userId, Set<UUID> roleIds);
}
