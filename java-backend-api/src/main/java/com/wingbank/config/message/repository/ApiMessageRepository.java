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

    @Query(value = "SELECT * FROM api_messages WHERE deleted = false " +
           "AND (:search IS NULL OR LOWER(error_code) LIKE LOWER('%' || CAST(:search AS TEXT) || '%') " +
           "OR LOWER(en_message) LIKE LOWER('%' || CAST(:search AS TEXT) || '%')) " +
           "AND (:type IS NULL OR type = CAST(:type AS TEXT))",
           countQuery = "SELECT COUNT(*) FROM api_messages WHERE deleted = false " +
           "AND (:search IS NULL OR LOWER(error_code) LIKE LOWER('%' || CAST(:search AS TEXT) || '%') " +
           "OR LOWER(en_message) LIKE LOWER('%' || CAST(:search AS TEXT) || '%')) " +
           "AND (:type IS NULL OR type = CAST(:type AS TEXT))",
           nativeQuery = true)
    Page<ApiMessage> findAllWithFilters(@Param("search") String search,
                                         @Param("type") String type,
                                         Pageable pageable);
}
