package team.bham.domain;

import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import team.bham.domain.enumeration.Geopoint;

/**
 * A DangerZone.
 */
@Entity
@Table(name = "danger_zone")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class DangerZone implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "zone_name")
    private String zoneName;

    @Column(name = "zone_description")
    private String zoneDescription;

    @Enumerated(EnumType.STRING)
    @Column(name = "zone_location")
    private Geopoint zoneLocation;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public DangerZone id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getZoneName() {
        return this.zoneName;
    }

    public DangerZone zoneName(String zoneName) {
        this.setZoneName(zoneName);
        return this;
    }

    public void setZoneName(String zoneName) {
        this.zoneName = zoneName;
    }

    public String getZoneDescription() {
        return this.zoneDescription;
    }

    public DangerZone zoneDescription(String zoneDescription) {
        this.setZoneDescription(zoneDescription);
        return this;
    }

    public void setZoneDescription(String zoneDescription) {
        this.zoneDescription = zoneDescription;
    }

    public Geopoint getZoneLocation() {
        return this.zoneLocation;
    }

    public DangerZone zoneLocation(Geopoint zoneLocation) {
        this.setZoneLocation(zoneLocation);
        return this;
    }

    public void setZoneLocation(Geopoint zoneLocation) {
        this.zoneLocation = zoneLocation;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof DangerZone)) {
            return false;
        }
        return id != null && id.equals(((DangerZone) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "DangerZone{" +
            "id=" + getId() +
            ", zoneName='" + getZoneName() + "'" +
            ", zoneDescription='" + getZoneDescription() + "'" +
            ", zoneLocation='" + getZoneLocation() + "'" +
            "}";
    }
}
