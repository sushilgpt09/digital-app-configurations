package com.wingbank.config.message.entity;

import com.wingbank.config.common.audit.AuditEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.SQLRestriction;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "api_messages")
@SQLRestriction("deleted = false")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ApiMessage extends AuditEntity {

    @Column(name = "error_code", nullable = false, unique = true)
    private String errorCode;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MessageType type = MessageType.ERROR;

    @Column(name = "http_status")
    private int httpStatus = 400;

    @OneToMany(mappedBy = "apiMessage", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<ApiMessageValue> values = new ArrayList<>();

    public enum MessageType {
        ERROR, SUCCESS, INFO, WARNING
    }
}
