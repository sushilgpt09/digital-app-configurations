package com.wingbank.config.message.entity;

import com.wingbank.config.common.audit.AuditEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.SQLRestriction;

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

    @Column(name = "en_message", nullable = false)
    private String enMessage;

    @Column(name = "km_message")
    private String kmMessage;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MessageType type = MessageType.ERROR;

    @Column(name = "http_status")
    private int httpStatus = 400;

    public enum MessageType {
        ERROR, SUCCESS, INFO, WARNING
    }
}
