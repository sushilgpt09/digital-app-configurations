package com.wingbank.config.translation.repository;

import com.wingbank.config.translation.entity.Translation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface TranslationRepository extends JpaRepository<Translation, UUID> {

    @Query(value = "SELECT DISTINCT t.* FROM translations t " +
           "LEFT JOIN translation_values tv ON t.id = tv.translation_id " +
           "WHERE t.deleted = false " +
           "AND (:search IS NULL OR LOWER(t.key) LIKE LOWER('%' || CAST(:search AS TEXT) || '%') " +
           "OR LOWER(tv.value) LIKE LOWER('%' || CAST(:search AS TEXT) || '%')) " +
           "AND (:module IS NULL OR t.module = CAST(:module AS TEXT)) " +
           "AND (:platform IS NULL OR t.platform = CAST(:platform AS TEXT) OR t.platform = 'ALL')",
           countQuery = "SELECT COUNT(DISTINCT t.id) FROM translations t " +
           "LEFT JOIN translation_values tv ON t.id = tv.translation_id " +
           "WHERE t.deleted = false " +
           "AND (:search IS NULL OR LOWER(t.key) LIKE LOWER('%' || CAST(:search AS TEXT) || '%') " +
           "OR LOWER(tv.value) LIKE LOWER('%' || CAST(:search AS TEXT) || '%')) " +
           "AND (:module IS NULL OR t.module = CAST(:module AS TEXT)) " +
           "AND (:platform IS NULL OR t.platform = CAST(:platform AS TEXT) OR t.platform = 'ALL')",
           nativeQuery = true)
    Page<Translation> findAllWithFilters(@Param("search") String search,
                                          @Param("module") String module,
                                          @Param("platform") String platform,
                                          Pageable pageable);

    @Query("SELECT t FROM Translation t WHERE " +
           "(t.platform = :platform OR t.platform = 'ALL') " +
           "AND (:version IS NULL OR t.version <= :version)")
    List<Translation> findByPlatformAndVersion(@Param("platform") String platform,
                                                @Param("version") String version);

    @Query("SELECT t FROM Translation t WHERE " +
           "(t.platform = :platform OR t.platform = 'ALL') " +
           "AND t.version > :version")
    List<Translation> findDeltaTranslations(@Param("platform") String platform,
                                             @Param("version") String version);
}
