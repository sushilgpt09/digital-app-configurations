package com.wingbank.config.applanguage.repository;

import com.wingbank.config.applanguage.entity.AppLanguage;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface AppLanguageRepository extends JpaRepository<AppLanguage, UUID> {

    boolean existsByCode(String code);

    List<AppLanguage> findByStatus(AppLanguage.Status status);

    @Query(value = "SELECT * FROM app_languages WHERE deleted = false " +
           "AND (:search IS NULL OR LOWER(name) LIKE LOWER('%' || CAST(:search AS TEXT) || '%') " +
           "OR LOWER(code) LIKE LOWER('%' || CAST(:search AS TEXT) || '%') " +
           "OR LOWER(native_name) LIKE LOWER('%' || CAST(:search AS TEXT) || '%')) " +
           "AND (:status IS NULL OR status = CAST(:status AS TEXT))",
           countQuery = "SELECT COUNT(*) FROM app_languages WHERE deleted = false " +
           "AND (:search IS NULL OR LOWER(name) LIKE LOWER('%' || CAST(:search AS TEXT) || '%') " +
           "OR LOWER(code) LIKE LOWER('%' || CAST(:search AS TEXT) || '%') " +
           "OR LOWER(native_name) LIKE LOWER('%' || CAST(:search AS TEXT) || '%')) " +
           "AND (:status IS NULL OR status = CAST(:status AS TEXT))",
           nativeQuery = true)
    Page<AppLanguage> findAllWithFilters(@Param("search") String search,
                                         @Param("status") String status,
                                         Pageable pageable);
}
