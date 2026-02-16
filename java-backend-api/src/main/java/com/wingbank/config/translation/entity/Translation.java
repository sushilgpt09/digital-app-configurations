package com.wingbank.config.translation.entity;

import com.wingbank.config.common.audit.AuditEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.SQLRestriction;

@Entity
@Table(name = "translations", uniqueConstraints = @UniqueConstraint(columnNames = {"key", "platform"}))
@SQLRestriction("deleted = false")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Translation extends AuditEntity {

    @Column(nullable = false)
    private String key;

    @Column(name = "en_value")
    private String enValue;

    @Column(name = "km_value")
    private String kmValue;

    private String module;

    @Column(columnDefinition = "VARCHAR(20) DEFAULT '1.0'")
    private String version = "1.0";

    @Column(columnDefinition = "VARCHAR(20) DEFAULT 'ALL'")
    private String platform = "ALL";
}
