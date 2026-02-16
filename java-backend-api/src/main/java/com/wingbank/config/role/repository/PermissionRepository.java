package com.wingbank.config.role.repository;

import com.wingbank.config.role.entity.Permission;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Set;
import java.util.UUID;

@Repository
public interface PermissionRepository extends JpaRepository<Permission, UUID> {

    boolean existsByName(String name);

    Set<Permission> findByIdIn(Set<UUID> ids);

    List<Permission> findByModule(String module);

    @Query("SELECT p FROM Permission p WHERE " +
           "(:search IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(p.module) LIKE LOWER(CONCAT('%', :search, '%'))) " +
           "AND (:module IS NULL OR p.module = :module)")
    Page<Permission> findAllWithFilters(@Param("search") String search,
                                        @Param("module") String module,
                                        Pageable pageable);

    @Query("SELECT DISTINCT p.module FROM Permission p ORDER BY p.module")
    List<String> findDistinctModules();
}
