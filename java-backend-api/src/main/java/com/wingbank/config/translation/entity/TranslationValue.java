package com.wingbank.config.translation.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Entity
@Table(name = "translation_values", uniqueConstraints = @UniqueConstraint(columnNames = {"translation_id", "language_code"}))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TranslationValue {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "translation_id", nullable = false)
    private Translation translation;

    @Column(name = "language_code", nullable = false, length = 10)
    private String languageCode;

    @Column(columnDefinition = "TEXT")
    private String value;
}
