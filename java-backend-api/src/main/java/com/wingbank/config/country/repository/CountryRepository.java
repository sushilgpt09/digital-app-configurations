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

    @Query("SELECT c FROM Country c WHERE " +
           "(:search IS NULL OR LOWER(c.name) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(c.code) LIKE LOWER(CONCAT('%', :search, '%'))) " +
           "AND (:status IS NULL OR c.status = :status)")
    Page<Country> findAllWithFilters(@Param("search") String search,
                                     @Param("status") Country.Status status,
                                     Pageable pageable);
}
