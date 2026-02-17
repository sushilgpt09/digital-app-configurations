package com.wingbank.config.country.repository;

import com.wingbank.config.country.entity.Country;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CountryRepository extends JpaRepository<Country, UUID> {

    boolean existsByCode(String code);

    List<Country> findByStatus(Country.Status status);

    @Query(value = "SELECT * FROM countries WHERE deleted = false " +
           "AND (:search IS NULL OR LOWER(name) LIKE LOWER('%' || CAST(:search AS TEXT) || '%') " +
           "OR LOWER(code) LIKE LOWER('%' || CAST(:search AS TEXT) || '%')) " +
           "AND (:status IS NULL OR status = CAST(:status AS TEXT))",
           countQuery = "SELECT COUNT(*) FROM countries WHERE deleted = false " +
           "AND (:search IS NULL OR LOWER(name) LIKE LOWER('%' || CAST(:search AS TEXT) || '%') " +
           "OR LOWER(code) LIKE LOWER('%' || CAST(:search AS TEXT) || '%')) " +
           "AND (:status IS NULL OR status = CAST(:status AS TEXT))",
           nativeQuery = true)
    Page<Country> findAllWithFilters(@Param("search") String search,
                                     @Param("status") String status,
                                     Pageable pageable);
}
