package com.wingbank.config.globalconfig.entity;

import com.wingbank.config.common.audit.AuditEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.SQLRestriction;

@Entity
@Table(name = "global_configs", uniqueConstraints = @UniqueConstraint(columnNames = {"config_key", "platform"}))
@SQLRestriction("deleted = false")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class GlobalConfig extends AuditEntity {

    @Column(name = "config_key", nullable = false)
    private String configKey;

    @Column(name = "config_value")
    private String configValue;

    @Column(columnDefinition = "VARCHAR(20) DEFAULT 'ALL'")
    private String platform = "ALL";

    @Column(columnDefinition = "VARCHAR(20) DEFAULT '1.0'")
    private String version = "1.0";

    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status = Status.ACTIVE;

    public enum Status {
        ACTIVE, INACTIVE
    }
}
