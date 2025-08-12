package team.bham.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import team.bham.domain.enumeration.Geopoint;

/**
 * A Hospital.
 */
@Entity
@Table(name = "hospital")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Hospital implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "hospital_name")
    private String hospitalName;

    @Enumerated(EnumType.STRING)
    @Column(name = "hospital_location")
    private Geopoint hospitalLocation;

    @ManyToOne
    @JsonIgnoreProperties(value = { "user", "hospitals", "policeStations", "sOSButtons" }, allowSetters = true)
    private LiveLocation liveLocation;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Hospital id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getHospitalName() {
        return this.hospitalName;
    }

    public Hospital hospitalName(String hospitalName) {
        this.setHospitalName(hospitalName);
        return this;
    }

    public void setHospitalName(String hospitalName) {
        this.hospitalName = hospitalName;
    }

    public Geopoint getHospitalLocation() {
        return this.hospitalLocation;
    }

    public Hospital hospitalLocation(Geopoint hospitalLocation) {
        this.setHospitalLocation(hospitalLocation);
        return this;
    }

    public void setHospitalLocation(Geopoint hospitalLocation) {
        this.hospitalLocation = hospitalLocation;
    }

    public LiveLocation getLiveLocation() {
        return this.liveLocation;
    }

    public void setLiveLocation(LiveLocation liveLocation) {
        this.liveLocation = liveLocation;
    }

    public Hospital liveLocation(LiveLocation liveLocation) {
        this.setLiveLocation(liveLocation);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Hospital)) {
            return false;
        }
        return id != null && id.equals(((Hospital) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Hospital{" +
            "id=" + getId() +
            ", hospitalName='" + getHospitalName() + "'" +
            ", hospitalLocation='" + getHospitalLocation() + "'" +
            "}";
    }
}
