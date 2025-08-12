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
import team.bham.domain.VoiceRecording;
import team.bham.repository.VoiceRecordingRepository;

/**
 * Integration tests for the {@link VoiceRecordingResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class VoiceRecordingResourceIT {

    private static final String DEFAULT_TITLE = "AAAAAAAAAA";
    private static final String UPDATED_TITLE = "BBBBBBBBBB";

    private static final Long DEFAULT_DURATION = 1L;
    private static final Long UPDATED_DURATION = 2L;

    private static final Instant DEFAULT_RECORDING_DATE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_RECORDING_DATE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String DEFAULT_FILE_PATH = "AAAAAAAAAA";
    private static final String UPDATED_FILE_PATH = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/voice-recordings";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private VoiceRecordingRepository voiceRecordingRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restVoiceRecordingMockMvc;

    private VoiceRecording voiceRecording;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static VoiceRecording createEntity(EntityManager em) {
        VoiceRecording voiceRecording = new VoiceRecording()
            .title(DEFAULT_TITLE)
            .duration(DEFAULT_DURATION)
            .recordingDate(DEFAULT_RECORDING_DATE)
            .filePath(DEFAULT_FILE_PATH);
        return voiceRecording;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static VoiceRecording createUpdatedEntity(EntityManager em) {
        VoiceRecording voiceRecording = new VoiceRecording()
            .title(UPDATED_TITLE)
            .duration(UPDATED_DURATION)
            .recordingDate(UPDATED_RECORDING_DATE)
            .filePath(UPDATED_FILE_PATH);
        return voiceRecording;
    }

    @BeforeEach
    public void initTest() {
        voiceRecording = createEntity(em);
    }

    @Test
    @Transactional
    void createVoiceRecording() throws Exception {
        int databaseSizeBeforeCreate = voiceRecordingRepository.findAll().size();
        // Create the VoiceRecording
        restVoiceRecordingMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(voiceRecording))
            )
            .andExpect(status().isCreated());

        // Validate the VoiceRecording in the database
        List<VoiceRecording> voiceRecordingList = voiceRecordingRepository.findAll();
        assertThat(voiceRecordingList).hasSize(databaseSizeBeforeCreate + 1);
        VoiceRecording testVoiceRecording = voiceRecordingList.get(voiceRecordingList.size() - 1);
        assertThat(testVoiceRecording.getTitle()).isEqualTo(DEFAULT_TITLE);
        assertThat(testVoiceRecording.getDuration()).isEqualTo(DEFAULT_DURATION);
        assertThat(testVoiceRecording.getRecordingDate()).isEqualTo(DEFAULT_RECORDING_DATE);
        assertThat(testVoiceRecording.getFilePath()).isEqualTo(DEFAULT_FILE_PATH);
    }

    @Test
    @Transactional
    void createVoiceRecordingWithExistingId() throws Exception {
        // Create the VoiceRecording with an existing ID
        voiceRecording.setId(1L);

        int databaseSizeBeforeCreate = voiceRecordingRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restVoiceRecordingMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(voiceRecording))
            )
            .andExpect(status().isBadRequest());

        // Validate the VoiceRecording in the database
        List<VoiceRecording> voiceRecordingList = voiceRecordingRepository.findAll();
        assertThat(voiceRecordingList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllVoiceRecordings() throws Exception {
        // Initialize the database
        voiceRecordingRepository.saveAndFlush(voiceRecording);

        // Get all the voiceRecordingList
        restVoiceRecordingMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(voiceRecording.getId().intValue())))
            .andExpect(jsonPath("$.[*].title").value(hasItem(DEFAULT_TITLE)))
            .andExpect(jsonPath("$.[*].duration").value(hasItem(DEFAULT_DURATION.intValue())))
            .andExpect(jsonPath("$.[*].recordingDate").value(hasItem(DEFAULT_RECORDING_DATE.toString())))
            .andExpect(jsonPath("$.[*].filePath").value(hasItem(DEFAULT_FILE_PATH)));
    }

    @Test
    @Transactional
    void getVoiceRecording() throws Exception {
        // Initialize the database
        voiceRecordingRepository.saveAndFlush(voiceRecording);

        // Get the voiceRecording
        restVoiceRecordingMockMvc
            .perform(get(ENTITY_API_URL_ID, voiceRecording.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(voiceRecording.getId().intValue()))
            .andExpect(jsonPath("$.title").value(DEFAULT_TITLE))
            .andExpect(jsonPath("$.duration").value(DEFAULT_DURATION.intValue()))
            .andExpect(jsonPath("$.recordingDate").value(DEFAULT_RECORDING_DATE.toString()))
            .andExpect(jsonPath("$.filePath").value(DEFAULT_FILE_PATH));
    }

    @Test
    @Transactional
    void getNonExistingVoiceRecording() throws Exception {
        // Get the voiceRecording
        restVoiceRecordingMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingVoiceRecording() throws Exception {
        // Initialize the database
        voiceRecordingRepository.saveAndFlush(voiceRecording);

        int databaseSizeBeforeUpdate = voiceRecordingRepository.findAll().size();

        // Update the voiceRecording
        VoiceRecording updatedVoiceRecording = voiceRecordingRepository.findById(voiceRecording.getId()).get();
        // Disconnect from session so that the updates on updatedVoiceRecording are not directly saved in db
        em.detach(updatedVoiceRecording);
        updatedVoiceRecording
            .title(UPDATED_TITLE)
            .duration(UPDATED_DURATION)
            .recordingDate(UPDATED_RECORDING_DATE)
            .filePath(UPDATED_FILE_PATH);

        restVoiceRecordingMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedVoiceRecording.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedVoiceRecording))
            )
            .andExpect(status().isOk());

        // Validate the VoiceRecording in the database
        List<VoiceRecording> voiceRecordingList = voiceRecordingRepository.findAll();
        assertThat(voiceRecordingList).hasSize(databaseSizeBeforeUpdate);
        VoiceRecording testVoiceRecording = voiceRecordingList.get(voiceRecordingList.size() - 1);
        assertThat(testVoiceRecording.getTitle()).isEqualTo(UPDATED_TITLE);
        assertThat(testVoiceRecording.getDuration()).isEqualTo(UPDATED_DURATION);
        assertThat(testVoiceRecording.getRecordingDate()).isEqualTo(UPDATED_RECORDING_DATE);
        assertThat(testVoiceRecording.getFilePath()).isEqualTo(UPDATED_FILE_PATH);
    }

    @Test
    @Transactional
    void putNonExistingVoiceRecording() throws Exception {
        int databaseSizeBeforeUpdate = voiceRecordingRepository.findAll().size();
        voiceRecording.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restVoiceRecordingMockMvc
            .perform(
                put(ENTITY_API_URL_ID, voiceRecording.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(voiceRecording))
            )
            .andExpect(status().isBadRequest());

        // Validate the VoiceRecording in the database
        List<VoiceRecording> voiceRecordingList = voiceRecordingRepository.findAll();
        assertThat(voiceRecordingList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchVoiceRecording() throws Exception {
        int databaseSizeBeforeUpdate = voiceRecordingRepository.findAll().size();
        voiceRecording.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restVoiceRecordingMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(voiceRecording))
            )
            .andExpect(status().isBadRequest());

        // Validate the VoiceRecording in the database
        List<VoiceRecording> voiceRecordingList = voiceRecordingRepository.findAll();
        assertThat(voiceRecordingList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamVoiceRecording() throws Exception {
        int databaseSizeBeforeUpdate = voiceRecordingRepository.findAll().size();
        voiceRecording.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restVoiceRecordingMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(voiceRecording)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the VoiceRecording in the database
        List<VoiceRecording> voiceRecordingList = voiceRecordingRepository.findAll();
        assertThat(voiceRecordingList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateVoiceRecordingWithPatch() throws Exception {
        // Initialize the database
        voiceRecordingRepository.saveAndFlush(voiceRecording);

        int databaseSizeBeforeUpdate = voiceRecordingRepository.findAll().size();

        // Update the voiceRecording using partial update
        VoiceRecording partialUpdatedVoiceRecording = new VoiceRecording();
        partialUpdatedVoiceRecording.setId(voiceRecording.getId());

        partialUpdatedVoiceRecording.recordingDate(UPDATED_RECORDING_DATE).filePath(UPDATED_FILE_PATH);

        restVoiceRecordingMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedVoiceRecording.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedVoiceRecording))
            )
            .andExpect(status().isOk());

        // Validate the VoiceRecording in the database
        List<VoiceRecording> voiceRecordingList = voiceRecordingRepository.findAll();
        assertThat(voiceRecordingList).hasSize(databaseSizeBeforeUpdate);
        VoiceRecording testVoiceRecording = voiceRecordingList.get(voiceRecordingList.size() - 1);
        assertThat(testVoiceRecording.getTitle()).isEqualTo(DEFAULT_TITLE);
        assertThat(testVoiceRecording.getDuration()).isEqualTo(DEFAULT_DURATION);
        assertThat(testVoiceRecording.getRecordingDate()).isEqualTo(UPDATED_RECORDING_DATE);
        assertThat(testVoiceRecording.getFilePath()).isEqualTo(UPDATED_FILE_PATH);
    }

    @Test
    @Transactional
    void fullUpdateVoiceRecordingWithPatch() throws Exception {
        // Initialize the database
        voiceRecordingRepository.saveAndFlush(voiceRecording);

        int databaseSizeBeforeUpdate = voiceRecordingRepository.findAll().size();

        // Update the voiceRecording using partial update
        VoiceRecording partialUpdatedVoiceRecording = new VoiceRecording();
        partialUpdatedVoiceRecording.setId(voiceRecording.getId());

        partialUpdatedVoiceRecording
            .title(UPDATED_TITLE)
            .duration(UPDATED_DURATION)
            .recordingDate(UPDATED_RECORDING_DATE)
            .filePath(UPDATED_FILE_PATH);

        restVoiceRecordingMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedVoiceRecording.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedVoiceRecording))
            )
            .andExpect(status().isOk());

        // Validate the VoiceRecording in the database
        List<VoiceRecording> voiceRecordingList = voiceRecordingRepository.findAll();
        assertThat(voiceRecordingList).hasSize(databaseSizeBeforeUpdate);
        VoiceRecording testVoiceRecording = voiceRecordingList.get(voiceRecordingList.size() - 1);
        assertThat(testVoiceRecording.getTitle()).isEqualTo(UPDATED_TITLE);
        assertThat(testVoiceRecording.getDuration()).isEqualTo(UPDATED_DURATION);
        assertThat(testVoiceRecording.getRecordingDate()).isEqualTo(UPDATED_RECORDING_DATE);
        assertThat(testVoiceRecording.getFilePath()).isEqualTo(UPDATED_FILE_PATH);
    }

    @Test
    @Transactional
    void patchNonExistingVoiceRecording() throws Exception {
        int databaseSizeBeforeUpdate = voiceRecordingRepository.findAll().size();
        voiceRecording.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restVoiceRecordingMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, voiceRecording.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(voiceRecording))
            )
            .andExpect(status().isBadRequest());

        // Validate the VoiceRecording in the database
        List<VoiceRecording> voiceRecordingList = voiceRecordingRepository.findAll();
        assertThat(voiceRecordingList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchVoiceRecording() throws Exception {
        int databaseSizeBeforeUpdate = voiceRecordingRepository.findAll().size();
        voiceRecording.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restVoiceRecordingMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(voiceRecording))
            )
            .andExpect(status().isBadRequest());

        // Validate the VoiceRecording in the database
        List<VoiceRecording> voiceRecordingList = voiceRecordingRepository.findAll();
        assertThat(voiceRecordingList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamVoiceRecording() throws Exception {
        int databaseSizeBeforeUpdate = voiceRecordingRepository.findAll().size();
        voiceRecording.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restVoiceRecordingMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(voiceRecording))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the VoiceRecording in the database
        List<VoiceRecording> voiceRecordingList = voiceRecordingRepository.findAll();
        assertThat(voiceRecordingList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteVoiceRecording() throws Exception {
        // Initialize the database
        voiceRecordingRepository.saveAndFlush(voiceRecording);

        int databaseSizeBeforeDelete = voiceRecordingRepository.findAll().size();

        // Delete the voiceRecording
        restVoiceRecordingMockMvc
            .perform(delete(ENTITY_API_URL_ID, voiceRecording.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<VoiceRecording> voiceRecordingList = voiceRecordingRepository.findAll();
        assertThat(voiceRecordingList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
