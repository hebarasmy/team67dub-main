package team.bham.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import team.bham.domain.enumeration.RelationshipType;

/**
 * A Contacts.
 */
@Entity
@Table(name = "contacts")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Contacts implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Lob
    @Column(name = "image")
    private byte[] image;

    @Column(name = "image_content_type")
    private String imageContentType;

    @Column(name = "contact_name")
    private String contactName;

    @Column(name = "contact_phone")
    private String contactPhone;

    @Enumerated(EnumType.STRING)
    @Column(name = "contact_relation")
    private RelationshipType contactRelation;

    @OneToMany(mappedBy = "contacts")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(
        value = { "sender", "receiver", "liveLocation", "voiceRecording", "contacts", "voiceRecordings" },
        allowSetters = true
    )
    private Set<ChatMessage> chatMessages = new HashSet<>();

    @ManyToMany
    @JoinTable(
        name = "rel_contacts__user",
        joinColumns = @JoinColumn(name = "contacts_id"),
        inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    private Set<User> users = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = { "user", "liveLocation", "contacts" }, allowSetters = true)
    private SOSButton sOSButton;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Contacts id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public byte[] getImage() {
        return this.image;
    }

    public Contacts image(byte[] image) {
        this.setImage(image);
        return this;
    }

    public void setImage(byte[] image) {
        this.image = image;
    }

    public String getImageContentType() {
        return this.imageContentType;
    }

    public Contacts imageContentType(String imageContentType) {
        this.imageContentType = imageContentType;
        return this;
    }

    public void setImageContentType(String imageContentType) {
        this.imageContentType = imageContentType;
    }

    public String getContactName() {
        return this.contactName;
    }

    public Contacts contactName(String contactName) {
        this.setContactName(contactName);
        return this;
    }

    public void setContactName(String contactName) {
        this.contactName = contactName;
    }

    public String getContactPhone() {
        return this.contactPhone;
    }

    public Contacts contactPhone(String contactPhone) {
        this.setContactPhone(contactPhone);
        return this;
    }

    public void setContactPhone(String contactPhone) {
        this.contactPhone = contactPhone;
    }

    public RelationshipType getContactRelation() {
        return this.contactRelation;
    }

    public Contacts contactRelation(RelationshipType contactRelation) {
        this.setContactRelation(contactRelation);
        return this;
    }

    public void setContactRelation(RelationshipType contactRelation) {
        this.contactRelation = contactRelation;
    }

    public Set<ChatMessage> getChatMessages() {
        return this.chatMessages;
    }

    public void setChatMessages(Set<ChatMessage> chatMessages) {
        if (this.chatMessages != null) {
            this.chatMessages.forEach(i -> i.setContacts(null));
        }
        if (chatMessages != null) {
            chatMessages.forEach(i -> i.setContacts(this));
        }
        this.chatMessages = chatMessages;
    }

    public Contacts chatMessages(Set<ChatMessage> chatMessages) {
        this.setChatMessages(chatMessages);
        return this;
    }

    public Contacts addChatMessages(ChatMessage chatMessage) {
        this.chatMessages.add(chatMessage);
        chatMessage.setContacts(this);
        return this;
    }

    public Contacts removeChatMessages(ChatMessage chatMessage) {
        this.chatMessages.remove(chatMessage);
        chatMessage.setContacts(null);
        return this;
    }

    public Set<User> getUsers() {
        return this.users;
    }

    public void setUsers(Set<User> users) {
        this.users = users;
    }

    public Contacts users(Set<User> users) {
        this.setUsers(users);
        return this;
    }

    public Contacts addUser(User user) {
        this.users.add(user);
        return this;
    }

    public Contacts removeUser(User user) {
        this.users.remove(user);
        return this;
    }

    public SOSButton getSOSButton() {
        return this.sOSButton;
    }

    public void setSOSButton(SOSButton sOSButton) {
        this.sOSButton = sOSButton;
    }

    public Contacts sOSButton(SOSButton sOSButton) {
        this.setSOSButton(sOSButton);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Contacts)) {
            return false;
        }
        return id != null && id.equals(((Contacts) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Contacts{" +
            "id=" + getId() +
            ", image='" + getImage() + "'" +
            ", imageContentType='" + getImageContentType() + "'" +
            ", contactName='" + getContactName() + "'" +
            ", contactPhone='" + getContactPhone() + "'" +
            ", contactRelation='" + getContactRelation() + "'" +
            "}";
    }
}
