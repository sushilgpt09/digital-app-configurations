package com.wingbank.config.user.dto;

import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

import java.util.Set;
import java.util.UUID;

@Data
public class UserRoleAssignRequest {

    @NotEmpty(message = "At least one role must be specified")
    private Set<UUID> roleIds;
}
