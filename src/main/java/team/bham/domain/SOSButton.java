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
 * A SOSButton.
 */
@Entity
@Table(name = "sos_button")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class SOSButton implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "label")
    private String label;

    @Column(name = "is_activated")
    private Boolean isActivated;

    @Enumerated(EnumType.STRING)
    @Column(name = "location")
    private Geopoint location;

    @OneToOne
    @JoinColumn(unique = true)
    private User user;

    @JsonIgnoreProperties(value = { "user", "hospitals", "policeStations", "sOSButtons" }, allowSetters = true)
    @OneToOne
    @JoinColumn(unique = true)
    private LiveLocation liveLocation;

    @OneToMany(mappedBy = "sOSButton")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "chatMessages", "users", "sOSButton" }, allowSetters = true)
    private Set<Contacts> contacts = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public SOSButton id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getLabel() {
        return this.label;
    }

    public SOSButton label(String label) {
        this.setLabel(label);
        return this;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public Boolean getIsActivated() {
        return this.isActivated;
    }

    public SOSButton isActivated(Boolean isActivated) {
        this.setIsActivated(isActivated);
        return this;
    }

    public void setIsActivated(Boolean isActivated) {
        this.isActivated = isActivated;
    }

    public Geopoint getLocation() {
        return this.location;
    }

    public SOSButton location(Geopoint location) {
        this.setLocation(location);
        return this;
    }

    public void setLocation(Geopoint location) {
        this.location = location;
    }

    public User getUser() {
        return this.user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public SOSButton user(User user) {
        this.setUser(user);
        return this;
    }

    public LiveLocation getLiveLocation() {
        return this.liveLocation;
    }

    public void setLiveLocation(LiveLocation liveLocation) {
        this.liveLocation = liveLocation;
    }

    public SOSButton liveLocation(LiveLocation liveLocation) {
        this.setLiveLocation(liveLocation);
        return this;
    }

    public Set<Contacts> getContacts() {
        return this.contacts;
    }

    public void setContacts(Set<Contacts> contacts) {
        if (this.contacts != null) {
            this.contacts.forEach(i -> i.setSOSButton(null));
        }
        if (contacts != null) {
            contacts.forEach(i -> i.setSOSButton(this));
        }
        this.contacts = contacts;
    }

    public SOSButton contacts(Set<Contacts> contacts) {
        this.setContacts(contacts);
        return this;
    }

    public SOSButton addContacts(Contacts contacts) {
        this.contacts.add(contacts);
        contacts.setSOSButton(this);
        return this;
    }

    public SOSButton removeContacts(Contacts contacts) {
        this.contacts.remove(contacts);
        contacts.setSOSButton(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof SOSButton)) {
            return false;
        }
        return id != null && id.equals(((SOSButton) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "SOSButton{" +
            "id=" + getId() +
            ", label='" + getLabel() + "'" +
            ", isActivated='" + getIsActivated() + "'" +
            ", location='" + getLocation() + "'" +
            "}";
    }
}
