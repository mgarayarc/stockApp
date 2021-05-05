package com.mycompany.myapp.domain;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDate;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Quote.
 */
@Entity
@Table(name = "quote")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Quote implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @NotNull
    @Column(name = "date", nullable = false)
    private LocalDate date;

    @Column(name = "open", precision = 21, scale = 2)
    private BigDecimal open;

    @Column(name = "high", precision = 21, scale = 2)
    private BigDecimal high;

    @Column(name = "low", precision = 21, scale = 2)
    private BigDecimal low;

    @NotNull
    @Column(name = "close", precision = 21, scale = 2, nullable = false)
    private BigDecimal close;

    @NotNull
    @Column(name = "adjclose", precision = 21, scale = 2, nullable = false)
    private BigDecimal adjclose;

    @Column(name = "volume")
    private Long volume;

    @ManyToOne
    private Stock stock;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Quote id(Long id) {
        this.id = id;
        return this;
    }

    public LocalDate getDate() {
        return this.date;
    }

    public Quote date(LocalDate date) {
        this.date = date;
        return this;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public BigDecimal getOpen() {
        return this.open;
    }

    public Quote open(BigDecimal open) {
        this.open = open;
        return this;
    }

    public void setOpen(BigDecimal open) {
        this.open = open;
    }

    public BigDecimal getHigh() {
        return this.high;
    }

    public Quote high(BigDecimal high) {
        this.high = high;
        return this;
    }

    public void setHigh(BigDecimal high) {
        this.high = high;
    }

    public BigDecimal getLow() {
        return this.low;
    }

    public Quote low(BigDecimal low) {
        this.low = low;
        return this;
    }

    public void setLow(BigDecimal low) {
        this.low = low;
    }

    public BigDecimal getClose() {
        return this.close;
    }

    public Quote close(BigDecimal close) {
        this.close = close;
        return this;
    }

    public void setClose(BigDecimal close) {
        this.close = close;
    }

    public BigDecimal getAdjclose() {
        return this.adjclose;
    }

    public Quote adjclose(BigDecimal adjclose) {
        this.adjclose = adjclose;
        return this;
    }

    public void setAdjclose(BigDecimal adjclose) {
        this.adjclose = adjclose;
    }

    public Long getVolume() {
        return this.volume;
    }

    public Quote volume(Long volume) {
        this.volume = volume;
        return this;
    }

    public void setVolume(Long volume) {
        this.volume = volume;
    }

    public Stock getStock() {
        return this.stock;
    }

    public Quote stock(Stock stock) {
        this.setStock(stock);
        return this;
    }

    public void setStock(Stock stock) {
        this.stock = stock;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Quote)) {
            return false;
        }
        return id != null && id.equals(((Quote) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Quote{" +
            "id=" + getId() +
            ", date='" + getDate() + "'" +
            ", open=" + getOpen() +
            ", high=" + getHigh() +
            ", low=" + getLow() +
            ", close=" + getClose() +
            ", adjclose=" + getAdjclose() +
            ", volume=" + getVolume() +
            "}";
    }
}
