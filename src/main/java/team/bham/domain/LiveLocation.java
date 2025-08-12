package team.bham.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import team.bham.domain.enumeration.Geopoint;

/**
 * A LiveLocation.
 */
@Entity
@Table(name = "live_location")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class LiveLocation implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "current_location")
    private Geopoint currentLocation;

    @Column(name = "current_location_name")
    private String currentLocationName;

    @OneToOne
    @JoinColumn(unique = true)
    private User user;

    @OneToMany(mappedBy = "liveLocation")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "liveLocation" }, allowSetters = true)
    private Set<Hospital> hospitals = new HashSet<>();

    @OneToMany(mappedBy = "liveLocation")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "liveLocation" }, allowSetters = true)
    private Set<PoliceStation> policeStations = new HashSet<>();

    @JsonIgnoreProperties(value = { "user", "liveLocation", "contacts" }, allowSetters = true)
    @OneToOne(mappedBy = "liveLocation")
    private SOSButton sOSButtons;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public LiveLocation id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Geopoint getCurrentLocation() {
        return this.currentLocation;
    }

    public LiveLocation currentLocation(Geopoint currentLocation) {
        this.setCurrentLocation(currentLocation);
        return this;
    }

    public void setCurrentLocation(Geopoint currentLocation) {
        this.currentLocation = currentLocation;
    }

    public String getCurrentLocationName() {
        return this.currentLocationName;
    }

    public LiveLocation currentLocationName(String currentLocationName) {
        this.setCurrentLocationName(currentLocationName);
        return this;
    }

    public void setCurrentLocationName(String currentLocationName) {
        this.currentLocationName = currentLocationName;
    }

    public User getUser() {
        return this.user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public LiveLocation user(User user) {
        this.setUser(user);
        return this;
    }

    public Set<Hospital> getHospitals() {
        return this.hospitals;
    }

    public void setHospitals(Set<Hospital> hospitals) {
        if (this.hospitals != null) {
            this.hospitals.forEach(i -> i.setLiveLocation(null));
        }
        if (hospitals != null) {
            hospitals.forEach(i -> i.setLiveLocation(this));
        }
        this.hospitals = hospitals;
    }

    public LiveLocation hospitals(Set<Hospital> hospitals) {
        this.setHospitals(hospitals);
        return this;
    }

    public LiveLocation addHospitals(Hospital hospital) {
        this.hospitals.add(hospital);
        hospital.setLiveLocation(this);
        return this;
    }

    public LiveLocation removeHospitals(Hospital hospital) {
        this.hospitals.remove(hospital);
        hospital.setLiveLocation(null);
        return this;
    }

    public Set<PoliceStation> getPoliceStations() {
        return this.policeStations;
    }

    public void setPoliceStations(Set<PoliceStation> policeStations) {
        if (this.policeStations != null) {
            this.policeStations.forEach(i -> i.setLiveLocation(null));
        }
        if (policeStations != null) {
            policeStations.forEach(i -> i.setLiveLocation(this));
        }
        this.policeStations = policeStations;
    }

    public LiveLocation policeStations(Set<PoliceStation> policeStations) {
        this.setPoliceStations(policeStations);
        return this;
    }

    public LiveLocation addPoliceStations(PoliceStation policeStation) {
        this.policeStations.add(policeStation);
        policeStation.setLiveLocation(this);
        return this;
    }

    public LiveLocation removePoliceStations(PoliceStation policeStation) {
        this.policeStations.remove(policeStation);
        policeStation.setLiveLocation(null);
        return this;
    }

    public SOSButton getSOSButtons() {
        return this.sOSButtons;
    }

    public void setSOSButtons(SOSButton sOSButton) {
        if (this.sOSButtons != null) {
            this.sOSButtons.setLiveLocation(null);
        }
        if (sOSButton != null) {
            sOSButton.setLiveLocation(this);
        }
        this.sOSButtons = sOSButton;
    }

    public LiveLocation sOSButtons(SOSButton sOSButton) {
        this.setSOSButtons(sOSButton);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof LiveLocation)) {
            return false;
        }
        return id != null && id.equals(((LiveLocation) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "LiveLocation{" +
            "id=" + getId() +
            ", currentLocation='" + getCurrentLocation() + "'" +
            ", currentLocationName='" + getCurrentLocationName() + "'" +
            "}";
    }
}
