package com.wingbank.config.role.repository;

import com.wingbank.config.role.entity.Role;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.Set;
import java.util.UUID;

@Repository
public interface RoleRepository extends JpaRepository<Role, UUID> {

    Optional<Role> findByName(String name);

    boolean existsByName(String name);

    Set<Role> findByIdIn(Set<UUID> ids);

    @Query("SELECT r FROM Role r WHERE " +
           "(:search IS NULL OR LOWER(r.name) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(r.description) LIKE LOWER(CONCAT('%', :search, '%'))) " +
           "AND (:status IS NULL OR r.status = :status)")
    Page<Role> findAllWithFilters(@Param("search") String search,
                                  @Param("status") Role.Status status,
                                  Pageable pageable);
}
