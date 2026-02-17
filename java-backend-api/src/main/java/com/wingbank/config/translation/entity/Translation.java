package com.wingbank.config.translation.entity;

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
@Table(name = "translations", uniqueConstraints = @UniqueConstraint(columnNames = {"key", "platform"}))
@SQLRestriction("deleted = false")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Translation extends AuditEntity {

    @Column(nullable = false)
    private String key;

    private String module;

    @Column(columnDefinition = "VARCHAR(20) DEFAULT '1.0'")
    private String version = "1.0";

    @Column(columnDefinition = "VARCHAR(20) DEFAULT 'ALL'")
    private String platform = "ALL";

    @OneToMany(mappedBy = "translation", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<TranslationValue> values = new ArrayList<>();
}
