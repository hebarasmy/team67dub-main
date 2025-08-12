package team.bham.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A ChatMessage.
 */
@Entity
@Table(name = "chat_message")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class ChatMessage implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "sender_user_id")
    private Long senderUserId;

    @Column(name = "receiver_user_id")
    private Long receiverUserId;

    @Column(name = "message_content")
    private String messageContent;

    @Column(name = "message_date_time")
    private Instant messageDateTime;

    @ManyToOne
    private User sender;

    @ManyToOne
    private User receiver;

    @ManyToOne
    @JsonIgnoreProperties(value = { "user", "hospitals", "policeStations", "sOSButtons" }, allowSetters = true)
    private LiveLocation liveLocation;

    @ManyToOne
    @JsonIgnoreProperties(value = { "chatMessage", "user" }, allowSetters = true)
    private VoiceRecording voiceRecording;

    @ManyToOne
    @JsonIgnoreProperties(value = { "chatMessages", "users", "sOSButton" }, allowSetters = true)
    private Contacts contacts;

    @OneToMany(mappedBy = "chatMessage")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "chatMessage", "user" }, allowSetters = true)
    private Set<VoiceRecording> voiceRecordings = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public ChatMessage id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getSenderUserId() {
        return this.senderUserId;
    }

    public ChatMessage senderUserId(Long senderUserId) {
        this.setSenderUserId(senderUserId);
        return this;
    }

    public void setSenderUserId(Long senderUserId) {
        this.senderUserId = senderUserId;
    }

    public Long getReceiverUserId() {
        return this.receiverUserId;
    }

    public ChatMessage receiverUserId(Long receiverUserId) {
        this.setReceiverUserId(receiverUserId);
        return this;
    }

    public void setReceiverUserId(Long receiverUserId) {
        this.receiverUserId = receiverUserId;
    }

    public String getMessageContent() {
        return this.messageContent;
    }

    public ChatMessage messageContent(String messageContent) {
        this.setMessageContent(messageContent);
        return this;
    }

    public void setMessageContent(String messageContent) {
        this.messageContent = messageContent;
    }

    public Instant getMessageDateTime() {
        return this.messageDateTime;
    }

    public ChatMessage messageDateTime(Instant messageDateTime) {
        this.setMessageDateTime(messageDateTime);
        return this;
    }

    public void setMessageDateTime(Instant messageDateTime) {
        this.messageDateTime = messageDateTime;
    }

    public User getSender() {
        return this.sender;
    }

    public void setSender(User user) {
        this.sender = user;
    }

    public ChatMessage sender(User user) {
        this.setSender(user);
        return this;
    }

    public User getReceiver() {
        return this.receiver;
    }

    public void setReceiver(User user) {
        this.receiver = user;
    }

    public ChatMessage receiver(User user) {
        this.setReceiver(user);
        return this;
    }

    public LiveLocation getLiveLocation() {
        return this.liveLocation;
    }

    public void setLiveLocation(LiveLocation liveLocation) {
        this.liveLocation = liveLocation;
    }

    public ChatMessage liveLocation(LiveLocation liveLocation) {
        this.setLiveLocation(liveLocation);
        return this;
    }

    public VoiceRecording getVoiceRecording() {
        return this.voiceRecording;
    }

    public void setVoiceRecording(VoiceRecording voiceRecording) {
        this.voiceRecording = voiceRecording;
    }

    public ChatMessage voiceRecording(VoiceRecording voiceRecording) {
        this.setVoiceRecording(voiceRecording);
        return this;
    }

    public Contacts getContacts() {
        return this.contacts;
    }

    public void setContacts(Contacts contacts) {
        this.contacts = contacts;
    }

    public ChatMessage contacts(Contacts contacts) {
        this.setContacts(contacts);
        return this;
    }

    public Set<VoiceRecording> getVoiceRecordings() {
        return this.voiceRecordings;
    }

    public void setVoiceRecordings(Set<VoiceRecording> voiceRecordings) {
        if (this.voiceRecordings != null) {
            this.voiceRecordings.forEach(i -> i.setChatMessage(null));
        }
        if (voiceRecordings != null) {
            voiceRecordings.forEach(i -> i.setChatMessage(this));
        }
        this.voiceRecordings = voiceRecordings;
    }

    public ChatMessage voiceRecordings(Set<VoiceRecording> voiceRecordings) {
        this.setVoiceRecordings(voiceRecordings);
        return this;
    }

    public ChatMessage addVoiceRecordings(VoiceRecording voiceRecording) {
        this.voiceRecordings.add(voiceRecording);
        voiceRecording.setChatMessage(this);
        return this;
    }

    public ChatMessage removeVoiceRecordings(VoiceRecording voiceRecording) {
        this.voiceRecordings.remove(voiceRecording);
        voiceRecording.setChatMessage(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ChatMessage)) {
            return false;
        }
        return id != null && id.equals(((ChatMessage) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ChatMessage{" +
            "id=" + getId() +
            ", senderUserId=" + getSenderUserId() +
            ", receiverUserId=" + getReceiverUserId() +
            ", messageContent='" + getMessageContent() + "'" +
            ", messageDateTime='" + getMessageDateTime() + "'" +
            "}";
    }
}
