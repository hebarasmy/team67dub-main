package team.bham.domain;

import java.io.Serializable;
import java.time.Instant;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A UserChatHistory.
 */
@Entity
@Table(name = "user_chat_history")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class UserChatHistory implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id", nullable = true)
    private Long id;

    @Column(name = "sender_user_id")
    private Long senderUserID;

    @Column(name = "receiver_user_id")
    private Long receiverUserID;

    @Column(name = "message_content")
    private String messageContent;

    @Column(name = "message_date_time")
    private Instant messageDateTime;

    @ManyToOne
    private User user;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public UserChatHistory id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getSenderUserID() {
        return this.senderUserID;
    }

    public UserChatHistory senderUserID(Long senderUserID) {
        this.setSenderUserID(senderUserID);
        return this;
    }

    public void setSenderUserID(Long senderUserID) {
        this.senderUserID = senderUserID;
    }

    public Long getReceiverUserID() {
        return this.receiverUserID;
    }

    public UserChatHistory receiverUserID(Long receiverUserID) {
        this.setReceiverUserID(receiverUserID);
        return this;
    }

    public void setReceiverUserID(Long receiverUserID) {
        this.receiverUserID = receiverUserID;
    }

    public String getMessageContent() {
        return this.messageContent;
    }

    public UserChatHistory messageContent(String messageContent) {
        this.setMessageContent(messageContent);
        return this;
    }

    public void setMessageContent(String messageContent) {
        this.messageContent = messageContent;
    }

    public Instant getMessageDateTime() {
        return this.messageDateTime;
    }

    public UserChatHistory messageDateTime(Instant messageDateTime) {
        this.setMessageDateTime(messageDateTime);
        return this;
    }

    public void setMessageDateTime(Instant messageDateTime) {
        this.messageDateTime = messageDateTime;
    }

    public User getUser() {
        return this.user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public UserChatHistory user(User user) {
        this.setUser(user);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof UserChatHistory)) {
            return false;
        }
        return id != null && id.equals(((UserChatHistory) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "UserChatHistory{" +
            "id=" + getId() +
            ", senderUserID=" + getSenderUserID() +
            ", receiverUserID=" + getReceiverUserID() +
            ", messageContent='" + getMessageContent() + "'" +
            ", messageDateTime='" + getMessageDateTime() + "'" +
            "}";
    }
}
