package team.bham.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import team.bham.domain.enumeration.Geopoint;

/**
 * A PoliceStation.
 */
@Entity
@Table(name = "police_station")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class PoliceStation implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "station_name")
    private String stationName;

    @Enumerated(EnumType.STRING)
    @Column(name = "station_location")
    private Geopoint stationLocation;

    @ManyToOne
    @JsonIgnoreProperties(value = { "user", "hospitals", "policeStations", "sOSButtons" }, allowSetters = true)
    private LiveLocation liveLocation;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public PoliceStation id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getStationName() {
        return this.stationName;
    }

    public PoliceStation stationName(String stationName) {
        this.setStationName(stationName);
        return this;
    }

    public void setStationName(String stationName) {
        this.stationName = stationName;
    }

    public Geopoint getStationLocation() {
        return this.stationLocation;
    }

    public PoliceStation stationLocation(Geopoint stationLocation) {
        this.setStationLocation(stationLocation);
        return this;
    }

    public void setStationLocation(Geopoint stationLocation) {
        this.stationLocation = stationLocation;
    }

    public LiveLocation getLiveLocation() {
        return this.liveLocation;
    }

    public void setLiveLocation(LiveLocation liveLocation) {
        this.liveLocation = liveLocation;
    }

    public PoliceStation liveLocation(LiveLocation liveLocation) {
        this.setLiveLocation(liveLocation);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof PoliceStation)) {
            return false;
        }
        return id != null && id.equals(((PoliceStation) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "PoliceStation{" +
            "id=" + getId() +
            ", stationName='" + getStationName() + "'" +
            ", stationLocation='" + getStationLocation() + "'" +
            "}";
    }
}
