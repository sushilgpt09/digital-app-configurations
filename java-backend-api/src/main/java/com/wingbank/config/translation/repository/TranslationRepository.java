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

    @Query("SELECT t FROM Translation t WHERE " +
           "(:search IS NULL OR LOWER(t.key) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(t.enValue) LIKE LOWER(CONCAT('%', :search, '%'))) " +
           "AND (:module IS NULL OR t.module = :module) " +
           "AND (:platform IS NULL OR t.platform = :platform OR t.platform = 'ALL')")
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
