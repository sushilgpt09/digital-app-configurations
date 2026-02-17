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

    @Query(value = "SELECT * FROM roles WHERE deleted = false " +
           "AND (:search IS NULL OR LOWER(name) LIKE LOWER('%' || CAST(:search AS TEXT) || '%') " +
           "OR LOWER(description) LIKE LOWER('%' || CAST(:search AS TEXT) || '%')) " +
           "AND (:status IS NULL OR status = CAST(:status AS TEXT))",
           countQuery = "SELECT COUNT(*) FROM roles WHERE deleted = false " +
           "AND (:search IS NULL OR LOWER(name) LIKE LOWER('%' || CAST(:search AS TEXT) || '%') " +
           "OR LOWER(description) LIKE LOWER('%' || CAST(:search AS TEXT) || '%')) " +
           "AND (:status IS NULL OR status = CAST(:status AS TEXT))",
           nativeQuery = true)
    Page<Role> findAllWithFilters(@Param("search") String search,
                                  @Param("status") String status,
                                  Pageable pageable);
}
