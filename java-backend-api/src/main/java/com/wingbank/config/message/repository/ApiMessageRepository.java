package com.wingbank.config.message.repository;

import com.wingbank.config.message.entity.ApiMessage;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ApiMessageRepository extends JpaRepository<ApiMessage, UUID> {

    Optional<ApiMessage> findByErrorCode(String errorCode);

    boolean existsByErrorCode(String errorCode);

    List<ApiMessage> findByType(ApiMessage.MessageType type);

    @Query("SELECT m FROM ApiMessage m WHERE " +
           "(:search IS NULL OR LOWER(m.errorCode) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(m.enMessage) LIKE LOWER(CONCAT('%', :search, '%'))) " +
           "AND (:type IS NULL OR m.type = :type)")
    Page<ApiMessage> findAllWithFilters(@Param("search") String search,
                                         @Param("type") ApiMessage.MessageType type,
                                         Pageable pageable);
}
