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

    @Query(value = "SELECT * FROM permissions WHERE deleted = false " +
           "AND (:search IS NULL OR LOWER(name) LIKE LOWER('%' || CAST(:search AS TEXT) || '%') " +
           "OR LOWER(module) LIKE LOWER('%' || CAST(:search AS TEXT) || '%')) " +
           "AND (:module IS NULL OR module = CAST(:module AS TEXT))",
           countQuery = "SELECT COUNT(*) FROM permissions WHERE deleted = false " +
           "AND (:search IS NULL OR LOWER(name) LIKE LOWER('%' || CAST(:search AS TEXT) || '%') " +
           "OR LOWER(module) LIKE LOWER('%' || CAST(:search AS TEXT) || '%')) " +
           "AND (:module IS NULL OR module = CAST(:module AS TEXT))",
           nativeQuery = true)
    Page<Permission> findAllWithFilters(@Param("search") String search,
                                        @Param("module") String module,
                                        Pageable pageable);

    @Query("SELECT DISTINCT p.module FROM Permission p ORDER BY p.module")
    List<String> findDistinctModules();
}
