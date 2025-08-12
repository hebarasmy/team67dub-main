package team.bham.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.Instant;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A VoiceRecording.
 */
@Entity
@Table(name = "voice_recording")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class VoiceRecording implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "title")
    private String title;

    @Column(name = "duration")
    private Long duration;

    @Column(name = "recording_date")
    private Instant recordingDate;

    @Column(name = "file_path")
    private String filePath;

    @ManyToOne
    @JsonIgnoreProperties(
        value = { "sender", "receiver", "liveLocation", "voiceRecording", "contacts", "voiceRecordings" },
        allowSetters = true
    )
    private ChatMessage chatMessage;

    @ManyToOne
    private User user;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public VoiceRecording id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return this.title;
    }

    public VoiceRecording title(String title) {
        this.setTitle(title);
        return this;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Long getDuration() {
        return this.duration;
    }

    public VoiceRecording duration(Long duration) {
        this.setDuration(duration);
        return this;
    }

    public void setDuration(Long duration) {
        this.duration = duration;
    }

    public Instant getRecordingDate() {
        return this.recordingDate;
    }

    public VoiceRecording recordingDate(Instant recordingDate) {
        this.setRecordingDate(recordingDate);
        return this;
    }

    public void setRecordingDate(Instant recordingDate) {
        this.recordingDate = recordingDate;
    }

    public String getFilePath() {
        return this.filePath;
    }

    public VoiceRecording filePath(String filePath) {
        this.setFilePath(filePath);
        return this;
    }

    public void setFilePath(String filePath) {
        this.filePath = filePath;
    }

    public ChatMessage getChatMessage() {
        return this.chatMessage;
    }

    public void setChatMessage(ChatMessage chatMessage) {
        this.chatMessage = chatMessage;
    }

    public VoiceRecording chatMessage(ChatMessage chatMessage) {
        this.setChatMessage(chatMessage);
        return this;
    }

    public User getUser() {
        return this.user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public VoiceRecording user(User user) {
        this.setUser(user);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof VoiceRecording)) {
            return false;
        }
        return id != null && id.equals(((VoiceRecording) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "VoiceRecording{" +
            "id=" + getId() +
            ", title='" + getTitle() + "'" +
            ", duration=" + getDuration() +
            ", recordingDate='" + getRecordingDate() + "'" +
            ", filePath='" + getFilePath() + "'" +
            "}";
    }

    public enum RecordingStatus {
        RECORDING,
        SAVED,
        SENT,
    }
}
