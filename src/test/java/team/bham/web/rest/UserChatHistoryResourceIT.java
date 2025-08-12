package team.bham.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import team.bham.IntegrationTest;
import team.bham.domain.UserChatHistory;
import team.bham.repository.UserChatHistoryRepository;

/**
 * Integration tests for the {@link UserChatHistoryResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class UserChatHistoryResourceIT {

    private static final Long DEFAULT_SENDER_USER_ID = 1L;
    private static final Long UPDATED_SENDER_USER_ID = 2L;

    private static final Long DEFAULT_RECEIVER_USER_ID = 1L;
    private static final Long UPDATED_RECEIVER_USER_ID = 2L;

    private static final String DEFAULT_MESSAGE_CONTENT = "AAAAAAAAAA";
    private static final String UPDATED_MESSAGE_CONTENT = "BBBBBBBBBB";

    private static final Instant DEFAULT_MESSAGE_DATE_TIME = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_MESSAGE_DATE_TIME = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String ENTITY_API_URL = "/api/user-chat-histories";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private UserChatHistoryRepository userChatHistoryRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restUserChatHistoryMockMvc;

    private UserChatHistory userChatHistory;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static UserChatHistory createEntity(EntityManager em) {
        UserChatHistory userChatHistory = new UserChatHistory()
            .senderUserID(DEFAULT_SENDER_USER_ID)
            .receiverUserID(DEFAULT_RECEIVER_USER_ID)
            .messageContent(DEFAULT_MESSAGE_CONTENT)
            .messageDateTime(DEFAULT_MESSAGE_DATE_TIME);
        return userChatHistory;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static UserChatHistory createUpdatedEntity(EntityManager em) {
        UserChatHistory userChatHistory = new UserChatHistory()
            .senderUserID(UPDATED_SENDER_USER_ID)
            .receiverUserID(UPDATED_RECEIVER_USER_ID)
            .messageContent(UPDATED_MESSAGE_CONTENT)
            .messageDateTime(UPDATED_MESSAGE_DATE_TIME);
        return userChatHistory;
    }

    @BeforeEach
    public void initTest() {
        userChatHistory = createEntity(em);
    }

    @Test
    @Transactional
    void createUserChatHistory() throws Exception {
        int databaseSizeBeforeCreate = userChatHistoryRepository.findAll().size();
        // Create the UserChatHistory
        restUserChatHistoryMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(userChatHistory))
            )
            .andExpect(status().isCreated());

        // Validate the UserChatHistory in the database
        List<UserChatHistory> userChatHistoryList = userChatHistoryRepository.findAll();
        assertThat(userChatHistoryList).hasSize(databaseSizeBeforeCreate + 1);
        UserChatHistory testUserChatHistory = userChatHistoryList.get(userChatHistoryList.size() - 1);
        assertThat(testUserChatHistory.getSenderUserID()).isEqualTo(DEFAULT_SENDER_USER_ID);
        assertThat(testUserChatHistory.getReceiverUserID()).isEqualTo(DEFAULT_RECEIVER_USER_ID);
        assertThat(testUserChatHistory.getMessageContent()).isEqualTo(DEFAULT_MESSAGE_CONTENT);
        assertThat(testUserChatHistory.getMessageDateTime()).isEqualTo(DEFAULT_MESSAGE_DATE_TIME);
    }

    @Test
    @Transactional
    void createUserChatHistoryWithExistingId() throws Exception {
        // Create the UserChatHistory with an existing ID
        userChatHistory.setId(1L);

        int databaseSizeBeforeCreate = userChatHistoryRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restUserChatHistoryMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(userChatHistory))
            )
            .andExpect(status().isBadRequest());

        // Validate the UserChatHistory in the database
        List<UserChatHistory> userChatHistoryList = userChatHistoryRepository.findAll();
        assertThat(userChatHistoryList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllUserChatHistories() throws Exception {
        // Initialize the database
        userChatHistoryRepository.saveAndFlush(userChatHistory);

        // Get all the userChatHistoryList
        restUserChatHistoryMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(userChatHistory.getId().intValue())))
            .andExpect(jsonPath("$.[*].senderUserID").value(hasItem(DEFAULT_SENDER_USER_ID.intValue())))
            .andExpect(jsonPath("$.[*].receiverUserID").value(hasItem(DEFAULT_RECEIVER_USER_ID.intValue())))
            .andExpect(jsonPath("$.[*].messageContent").value(hasItem(DEFAULT_MESSAGE_CONTENT)))
            .andExpect(jsonPath("$.[*].messageDateTime").value(hasItem(DEFAULT_MESSAGE_DATE_TIME.toString())));
    }

    @Test
    @Transactional
    void getUserChatHistory() throws Exception {
        // Initialize the database
        userChatHistoryRepository.saveAndFlush(userChatHistory);

        // Get the userChatHistory
        restUserChatHistoryMockMvc
            .perform(get(ENTITY_API_URL_ID, userChatHistory.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(userChatHistory.getId().intValue()))
            .andExpect(jsonPath("$.senderUserID").value(DEFAULT_SENDER_USER_ID.intValue()))
            .andExpect(jsonPath("$.receiverUserID").value(DEFAULT_RECEIVER_USER_ID.intValue()))
            .andExpect(jsonPath("$.messageContent").value(DEFAULT_MESSAGE_CONTENT))
            .andExpect(jsonPath("$.messageDateTime").value(DEFAULT_MESSAGE_DATE_TIME.toString()));
    }

    @Test
    @Transactional
    void getNonExistingUserChatHistory() throws Exception {
        // Get the userChatHistory
        restUserChatHistoryMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingUserChatHistory() throws Exception {
        // Initialize the database
        userChatHistoryRepository.saveAndFlush(userChatHistory);

        int databaseSizeBeforeUpdate = userChatHistoryRepository.findAll().size();

        // Update the userChatHistory
        UserChatHistory updatedUserChatHistory = userChatHistoryRepository.findById(userChatHistory.getId()).get();
        // Disconnect from session so that the updates on updatedUserChatHistory are not directly saved in db
        em.detach(updatedUserChatHistory);
        updatedUserChatHistory
            .senderUserID(UPDATED_SENDER_USER_ID)
            .receiverUserID(UPDATED_RECEIVER_USER_ID)
            .messageContent(UPDATED_MESSAGE_CONTENT)
            .messageDateTime(UPDATED_MESSAGE_DATE_TIME);

        restUserChatHistoryMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedUserChatHistory.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedUserChatHistory))
            )
            .andExpect(status().isOk());

        // Validate the UserChatHistory in the database
        List<UserChatHistory> userChatHistoryList = userChatHistoryRepository.findAll();
        assertThat(userChatHistoryList).hasSize(databaseSizeBeforeUpdate);
        UserChatHistory testUserChatHistory = userChatHistoryList.get(userChatHistoryList.size() - 1);
        assertThat(testUserChatHistory.getSenderUserID()).isEqualTo(UPDATED_SENDER_USER_ID);
        assertThat(testUserChatHistory.getReceiverUserID()).isEqualTo(UPDATED_RECEIVER_USER_ID);
        assertThat(testUserChatHistory.getMessageContent()).isEqualTo(UPDATED_MESSAGE_CONTENT);
        assertThat(testUserChatHistory.getMessageDateTime()).isEqualTo(UPDATED_MESSAGE_DATE_TIME);
    }

    @Test
    @Transactional
    void putNonExistingUserChatHistory() throws Exception {
        int databaseSizeBeforeUpdate = userChatHistoryRepository.findAll().size();
        userChatHistory.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restUserChatHistoryMockMvc
            .perform(
                put(ENTITY_API_URL_ID, userChatHistory.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(userChatHistory))
            )
            .andExpect(status().isBadRequest());

        // Validate the UserChatHistory in the database
        List<UserChatHistory> userChatHistoryList = userChatHistoryRepository.findAll();
        assertThat(userChatHistoryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchUserChatHistory() throws Exception {
        int databaseSizeBeforeUpdate = userChatHistoryRepository.findAll().size();
        userChatHistory.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUserChatHistoryMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(userChatHistory))
            )
            .andExpect(status().isBadRequest());

        // Validate the UserChatHistory in the database
        List<UserChatHistory> userChatHistoryList = userChatHistoryRepository.findAll();
        assertThat(userChatHistoryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamUserChatHistory() throws Exception {
        int databaseSizeBeforeUpdate = userChatHistoryRepository.findAll().size();
        userChatHistory.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUserChatHistoryMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(userChatHistory))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the UserChatHistory in the database
        List<UserChatHistory> userChatHistoryList = userChatHistoryRepository.findAll();
        assertThat(userChatHistoryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateUserChatHistoryWithPatch() throws Exception {
        // Initialize the database
        userChatHistoryRepository.saveAndFlush(userChatHistory);

        int databaseSizeBeforeUpdate = userChatHistoryRepository.findAll().size();

        // Update the userChatHistory using partial update
        UserChatHistory partialUpdatedUserChatHistory = new UserChatHistory();
        partialUpdatedUserChatHistory.setId(userChatHistory.getId());

        partialUpdatedUserChatHistory
            .receiverUserID(UPDATED_RECEIVER_USER_ID)
            .messageContent(UPDATED_MESSAGE_CONTENT)
            .messageDateTime(UPDATED_MESSAGE_DATE_TIME);

        restUserChatHistoryMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedUserChatHistory.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedUserChatHistory))
            )
            .andExpect(status().isOk());

        // Validate the UserChatHistory in the database
        List<UserChatHistory> userChatHistoryList = userChatHistoryRepository.findAll();
        assertThat(userChatHistoryList).hasSize(databaseSizeBeforeUpdate);
        UserChatHistory testUserChatHistory = userChatHistoryList.get(userChatHistoryList.size() - 1);
        assertThat(testUserChatHistory.getSenderUserID()).isEqualTo(DEFAULT_SENDER_USER_ID);
        assertThat(testUserChatHistory.getReceiverUserID()).isEqualTo(UPDATED_RECEIVER_USER_ID);
        assertThat(testUserChatHistory.getMessageContent()).isEqualTo(UPDATED_MESSAGE_CONTENT);
        assertThat(testUserChatHistory.getMessageDateTime()).isEqualTo(UPDATED_MESSAGE_DATE_TIME);
    }

    @Test
    @Transactional
    void fullUpdateUserChatHistoryWithPatch() throws Exception {
        // Initialize the database
        userChatHistoryRepository.saveAndFlush(userChatHistory);

        int databaseSizeBeforeUpdate = userChatHistoryRepository.findAll().size();

        // Update the userChatHistory using partial update
        UserChatHistory partialUpdatedUserChatHistory = new UserChatHistory();
        partialUpdatedUserChatHistory.setId(userChatHistory.getId());

        partialUpdatedUserChatHistory
            .senderUserID(UPDATED_SENDER_USER_ID)
            .receiverUserID(UPDATED_RECEIVER_USER_ID)
            .messageContent(UPDATED_MESSAGE_CONTENT)
            .messageDateTime(UPDATED_MESSAGE_DATE_TIME);

        restUserChatHistoryMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedUserChatHistory.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedUserChatHistory))
            )
            .andExpect(status().isOk());

        // Validate the UserChatHistory in the database
        List<UserChatHistory> userChatHistoryList = userChatHistoryRepository.findAll();
        assertThat(userChatHistoryList).hasSize(databaseSizeBeforeUpdate);
        UserChatHistory testUserChatHistory = userChatHistoryList.get(userChatHistoryList.size() - 1);
        assertThat(testUserChatHistory.getSenderUserID()).isEqualTo(UPDATED_SENDER_USER_ID);
        assertThat(testUserChatHistory.getReceiverUserID()).isEqualTo(UPDATED_RECEIVER_USER_ID);
        assertThat(testUserChatHistory.getMessageContent()).isEqualTo(UPDATED_MESSAGE_CONTENT);
        assertThat(testUserChatHistory.getMessageDateTime()).isEqualTo(UPDATED_MESSAGE_DATE_TIME);
    }

    @Test
    @Transactional
    void patchNonExistingUserChatHistory() throws Exception {
        int databaseSizeBeforeUpdate = userChatHistoryRepository.findAll().size();
        userChatHistory.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restUserChatHistoryMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, userChatHistory.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(userChatHistory))
            )
            .andExpect(status().isBadRequest());

        // Validate the UserChatHistory in the database
        List<UserChatHistory> userChatHistoryList = userChatHistoryRepository.findAll();
        assertThat(userChatHistoryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchUserChatHistory() throws Exception {
        int databaseSizeBeforeUpdate = userChatHistoryRepository.findAll().size();
        userChatHistory.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUserChatHistoryMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(userChatHistory))
            )
            .andExpect(status().isBadRequest());

        // Validate the UserChatHistory in the database
        List<UserChatHistory> userChatHistoryList = userChatHistoryRepository.findAll();
        assertThat(userChatHistoryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamUserChatHistory() throws Exception {
        int databaseSizeBeforeUpdate = userChatHistoryRepository.findAll().size();
        userChatHistory.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUserChatHistoryMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(userChatHistory))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the UserChatHistory in the database
        List<UserChatHistory> userChatHistoryList = userChatHistoryRepository.findAll();
        assertThat(userChatHistoryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteUserChatHistory() throws Exception {
        // Initialize the database
        userChatHistoryRepository.saveAndFlush(userChatHistory);

        int databaseSizeBeforeDelete = userChatHistoryRepository.findAll().size();

        // Delete the userChatHistory
        restUserChatHistoryMockMvc
            .perform(delete(ENTITY_API_URL_ID, userChatHistory.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<UserChatHistory> userChatHistoryList = userChatHistoryRepository.findAll();
        assertThat(userChatHistoryList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
