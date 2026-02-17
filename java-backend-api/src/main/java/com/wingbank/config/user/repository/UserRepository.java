package com.wingbank.config.user.repository;

import com.wingbank.config.user.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    @Query(value = "SELECT * FROM users WHERE deleted = false " +
           "AND (:search IS NULL OR LOWER(full_name) LIKE LOWER('%' || CAST(:search AS TEXT) || '%') " +
           "OR LOWER(email) LIKE LOWER('%' || CAST(:search AS TEXT) || '%')) " +
           "AND (:status IS NULL OR status = CAST(:status AS TEXT))",
           countQuery = "SELECT COUNT(*) FROM users WHERE deleted = false " +
           "AND (:search IS NULL OR LOWER(full_name) LIKE LOWER('%' || CAST(:search AS TEXT) || '%') " +
           "OR LOWER(email) LIKE LOWER('%' || CAST(:search AS TEXT) || '%')) " +
           "AND (:status IS NULL OR status = CAST(:status AS TEXT))",
           nativeQuery = true)
    Page<User> findAllWithFilters(@Param("search") String search,
                                  @Param("status") String status,
                                  Pageable pageable);
}
