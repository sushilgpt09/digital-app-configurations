package com.wingbank.config.wingplus.partner.repository;

import com.wingbank.config.wingplus.partner.entity.WingPartner;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface WingPartnerRepository extends JpaRepository<WingPartner, UUID> {

    List<WingPartner> findByStatusOrderBySortOrder(WingPartner.Status status);

    @Query(value = "SELECT * FROM wing_partners WHERE deleted = false " +
           "AND (:status IS NULL OR status = CAST(:status AS TEXT)) ORDER BY sort_order",
           countQuery = "SELECT COUNT(*) FROM wing_partners WHERE deleted = false " +
           "AND (:status IS NULL OR status = CAST(:status AS TEXT))",
           nativeQuery = true)
    Page<WingPartner> findAllWithFilters(@Param("status") String status, Pageable pageable);
}
