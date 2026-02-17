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

    @Query(value = "SELECT * FROM translations WHERE deleted = false " +
           "AND (:search IS NULL OR LOWER(key) LIKE LOWER('%' || CAST(:search AS TEXT) || '%') " +
           "OR LOWER(en_value) LIKE LOWER('%' || CAST(:search AS TEXT) || '%')) " +
           "AND (:module IS NULL OR module = CAST(:module AS TEXT)) " +
           "AND (:platform IS NULL OR platform = CAST(:platform AS TEXT) OR platform = 'ALL')",
           countQuery = "SELECT COUNT(*) FROM translations WHERE deleted = false " +
           "AND (:search IS NULL OR LOWER(key) LIKE LOWER('%' || CAST(:search AS TEXT) || '%') " +
           "OR LOWER(en_value) LIKE LOWER('%' || CAST(:search AS TEXT) || '%')) " +
           "AND (:module IS NULL OR module = CAST(:module AS TEXT)) " +
           "AND (:platform IS NULL OR platform = CAST(:platform AS TEXT) OR platform = 'ALL')",
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
