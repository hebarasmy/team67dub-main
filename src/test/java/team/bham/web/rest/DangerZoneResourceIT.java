package team.bham.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

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
import team.bham.domain.DangerZone;
import team.bham.domain.enumeration.Geopoint;
import team.bham.repository.DangerZoneRepository;

/**
 * Integration tests for the {@link DangerZoneResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class DangerZoneResourceIT {

    private static final String DEFAULT_ZONE_NAME = "AAAAAAAAAA";
    private static final String UPDATED_ZONE_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_ZONE_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_ZONE_DESCRIPTION = "BBBBBBBBBB";

    private static final Geopoint DEFAULT_ZONE_LOCATION = Geopoint.LATITUDE;
    private static final Geopoint UPDATED_ZONE_LOCATION = Geopoint.LONGITUDE;

    private static final String ENTITY_API_URL = "/api/danger-zones";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private DangerZoneRepository dangerZoneRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restDangerZoneMockMvc;

    private DangerZone dangerZone;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static DangerZone createEntity(EntityManager em) {
        DangerZone dangerZone = new DangerZone()
            .zoneName(DEFAULT_ZONE_NAME)
            .zoneDescription(DEFAULT_ZONE_DESCRIPTION)
            .zoneLocation(DEFAULT_ZONE_LOCATION);
        return dangerZone;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static DangerZone createUpdatedEntity(EntityManager em) {
        DangerZone dangerZone = new DangerZone()
            .zoneName(UPDATED_ZONE_NAME)
            .zoneDescription(UPDATED_ZONE_DESCRIPTION)
            .zoneLocation(UPDATED_ZONE_LOCATION);
        return dangerZone;
    }

    @BeforeEach
    public void initTest() {
        dangerZone = createEntity(em);
    }

    @Test
    @Transactional
    void createDangerZone() throws Exception {
        int databaseSizeBeforeCreate = dangerZoneRepository.findAll().size();
        // Create the DangerZone
        restDangerZoneMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(dangerZone)))
            .andExpect(status().isCreated());

        // Validate the DangerZone in the database
        List<DangerZone> dangerZoneList = dangerZoneRepository.findAll();
        assertThat(dangerZoneList).hasSize(databaseSizeBeforeCreate + 1);
        DangerZone testDangerZone = dangerZoneList.get(dangerZoneList.size() - 1);
        assertThat(testDangerZone.getZoneName()).isEqualTo(DEFAULT_ZONE_NAME);
        assertThat(testDangerZone.getZoneDescription()).isEqualTo(DEFAULT_ZONE_DESCRIPTION);
        assertThat(testDangerZone.getZoneLocation()).isEqualTo(DEFAULT_ZONE_LOCATION);
    }

    @Test
    @Transactional
    void createDangerZoneWithExistingId() throws Exception {
        // Create the DangerZone with an existing ID
        dangerZone.setId(1L);

        int databaseSizeBeforeCreate = dangerZoneRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restDangerZoneMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(dangerZone)))
            .andExpect(status().isBadRequest());

        // Validate the DangerZone in the database
        List<DangerZone> dangerZoneList = dangerZoneRepository.findAll();
        assertThat(dangerZoneList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllDangerZones() throws Exception {
        // Initialize the database
        dangerZoneRepository.saveAndFlush(dangerZone);

        // Get all the dangerZoneList
        restDangerZoneMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(dangerZone.getId().intValue())))
            .andExpect(jsonPath("$.[*].zoneName").value(hasItem(DEFAULT_ZONE_NAME)))
            .andExpect(jsonPath("$.[*].zoneDescription").value(hasItem(DEFAULT_ZONE_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].zoneLocation").value(hasItem(DEFAULT_ZONE_LOCATION.toString())));
    }

    @Test
    @Transactional
    void getDangerZone() throws Exception {
        // Initialize the database
        dangerZoneRepository.saveAndFlush(dangerZone);

        // Get the dangerZone
        restDangerZoneMockMvc
            .perform(get(ENTITY_API_URL_ID, dangerZone.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(dangerZone.getId().intValue()))
            .andExpect(jsonPath("$.zoneName").value(DEFAULT_ZONE_NAME))
            .andExpect(jsonPath("$.zoneDescription").value(DEFAULT_ZONE_DESCRIPTION))
            .andExpect(jsonPath("$.zoneLocation").value(DEFAULT_ZONE_LOCATION.toString()));
    }

    @Test
    @Transactional
    void getNonExistingDangerZone() throws Exception {
        // Get the dangerZone
        restDangerZoneMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingDangerZone() throws Exception {
        // Initialize the database
        dangerZoneRepository.saveAndFlush(dangerZone);

        int databaseSizeBeforeUpdate = dangerZoneRepository.findAll().size();

        // Update the dangerZone
        DangerZone updatedDangerZone = dangerZoneRepository.findById(dangerZone.getId()).get();
        // Disconnect from session so that the updates on updatedDangerZone are not directly saved in db
        em.detach(updatedDangerZone);
        updatedDangerZone.zoneName(UPDATED_ZONE_NAME).zoneDescription(UPDATED_ZONE_DESCRIPTION).zoneLocation(UPDATED_ZONE_LOCATION);

        restDangerZoneMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedDangerZone.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedDangerZone))
            )
            .andExpect(status().isOk());

        // Validate the DangerZone in the database
        List<DangerZone> dangerZoneList = dangerZoneRepository.findAll();
        assertThat(dangerZoneList).hasSize(databaseSizeBeforeUpdate);
        DangerZone testDangerZone = dangerZoneList.get(dangerZoneList.size() - 1);
        assertThat(testDangerZone.getZoneName()).isEqualTo(UPDATED_ZONE_NAME);
        assertThat(testDangerZone.getZoneDescription()).isEqualTo(UPDATED_ZONE_DESCRIPTION);
        assertThat(testDangerZone.getZoneLocation()).isEqualTo(UPDATED_ZONE_LOCATION);
    }

    @Test
    @Transactional
    void putNonExistingDangerZone() throws Exception {
        int databaseSizeBeforeUpdate = dangerZoneRepository.findAll().size();
        dangerZone.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDangerZoneMockMvc
            .perform(
                put(ENTITY_API_URL_ID, dangerZone.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(dangerZone))
            )
            .andExpect(status().isBadRequest());

        // Validate the DangerZone in the database
        List<DangerZone> dangerZoneList = dangerZoneRepository.findAll();
        assertThat(dangerZoneList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchDangerZone() throws Exception {
        int databaseSizeBeforeUpdate = dangerZoneRepository.findAll().size();
        dangerZone.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDangerZoneMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(dangerZone))
            )
            .andExpect(status().isBadRequest());

        // Validate the DangerZone in the database
        List<DangerZone> dangerZoneList = dangerZoneRepository.findAll();
        assertThat(dangerZoneList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamDangerZone() throws Exception {
        int databaseSizeBeforeUpdate = dangerZoneRepository.findAll().size();
        dangerZone.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDangerZoneMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(dangerZone)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the DangerZone in the database
        List<DangerZone> dangerZoneList = dangerZoneRepository.findAll();
        assertThat(dangerZoneList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateDangerZoneWithPatch() throws Exception {
        // Initialize the database
        dangerZoneRepository.saveAndFlush(dangerZone);

        int databaseSizeBeforeUpdate = dangerZoneRepository.findAll().size();

        // Update the dangerZone using partial update
        DangerZone partialUpdatedDangerZone = new DangerZone();
        partialUpdatedDangerZone.setId(dangerZone.getId());

        partialUpdatedDangerZone.zoneName(UPDATED_ZONE_NAME).zoneDescription(UPDATED_ZONE_DESCRIPTION);

        restDangerZoneMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedDangerZone.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedDangerZone))
            )
            .andExpect(status().isOk());

        // Validate the DangerZone in the database
        List<DangerZone> dangerZoneList = dangerZoneRepository.findAll();
        assertThat(dangerZoneList).hasSize(databaseSizeBeforeUpdate);
        DangerZone testDangerZone = dangerZoneList.get(dangerZoneList.size() - 1);
        assertThat(testDangerZone.getZoneName()).isEqualTo(UPDATED_ZONE_NAME);
        assertThat(testDangerZone.getZoneDescription()).isEqualTo(UPDATED_ZONE_DESCRIPTION);
        assertThat(testDangerZone.getZoneLocation()).isEqualTo(DEFAULT_ZONE_LOCATION);
    }

    @Test
    @Transactional
    void fullUpdateDangerZoneWithPatch() throws Exception {
        // Initialize the database
        dangerZoneRepository.saveAndFlush(dangerZone);

        int databaseSizeBeforeUpdate = dangerZoneRepository.findAll().size();

        // Update the dangerZone using partial update
        DangerZone partialUpdatedDangerZone = new DangerZone();
        partialUpdatedDangerZone.setId(dangerZone.getId());

        partialUpdatedDangerZone.zoneName(UPDATED_ZONE_NAME).zoneDescription(UPDATED_ZONE_DESCRIPTION).zoneLocation(UPDATED_ZONE_LOCATION);

        restDangerZoneMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedDangerZone.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedDangerZone))
            )
            .andExpect(status().isOk());

        // Validate the DangerZone in the database
        List<DangerZone> dangerZoneList = dangerZoneRepository.findAll();
        assertThat(dangerZoneList).hasSize(databaseSizeBeforeUpdate);
        DangerZone testDangerZone = dangerZoneList.get(dangerZoneList.size() - 1);
        assertThat(testDangerZone.getZoneName()).isEqualTo(UPDATED_ZONE_NAME);
        assertThat(testDangerZone.getZoneDescription()).isEqualTo(UPDATED_ZONE_DESCRIPTION);
        assertThat(testDangerZone.getZoneLocation()).isEqualTo(UPDATED_ZONE_LOCATION);
    }

    @Test
    @Transactional
    void patchNonExistingDangerZone() throws Exception {
        int databaseSizeBeforeUpdate = dangerZoneRepository.findAll().size();
        dangerZone.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDangerZoneMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, dangerZone.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(dangerZone))
            )
            .andExpect(status().isBadRequest());

        // Validate the DangerZone in the database
        List<DangerZone> dangerZoneList = dangerZoneRepository.findAll();
        assertThat(dangerZoneList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchDangerZone() throws Exception {
        int databaseSizeBeforeUpdate = dangerZoneRepository.findAll().size();
        dangerZone.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDangerZoneMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(dangerZone))
            )
            .andExpect(status().isBadRequest());

        // Validate the DangerZone in the database
        List<DangerZone> dangerZoneList = dangerZoneRepository.findAll();
        assertThat(dangerZoneList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamDangerZone() throws Exception {
        int databaseSizeBeforeUpdate = dangerZoneRepository.findAll().size();
        dangerZone.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDangerZoneMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(dangerZone))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the DangerZone in the database
        List<DangerZone> dangerZoneList = dangerZoneRepository.findAll();
        assertThat(dangerZoneList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteDangerZone() throws Exception {
        // Initialize the database
        dangerZoneRepository.saveAndFlush(dangerZone);

        int databaseSizeBeforeDelete = dangerZoneRepository.findAll().size();

        // Delete the dangerZone
        restDangerZoneMockMvc
            .perform(delete(ENTITY_API_URL_ID, dangerZone.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<DangerZone> dangerZoneList = dangerZoneRepository.findAll();
        assertThat(dangerZoneList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
