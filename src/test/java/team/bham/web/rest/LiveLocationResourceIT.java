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
import team.bham.domain.LiveLocation;
import team.bham.domain.enumeration.Geopoint;
import team.bham.repository.LiveLocationRepository;

/**
 * Integration tests for the {@link LiveLocationResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class LiveLocationResourceIT {

    private static final Geopoint DEFAULT_CURRENT_LOCATION = Geopoint.LATITUDE;
    private static final Geopoint UPDATED_CURRENT_LOCATION = Geopoint.LONGITUDE;

    private static final String DEFAULT_CURRENT_LOCATION_NAME = "AAAAAAAAAA";
    private static final String UPDATED_CURRENT_LOCATION_NAME = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/live-locations";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private LiveLocationRepository liveLocationRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restLiveLocationMockMvc;

    private LiveLocation liveLocation;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static LiveLocation createEntity(EntityManager em) {
        LiveLocation liveLocation = new LiveLocation()
            .currentLocation(DEFAULT_CURRENT_LOCATION)
            .currentLocationName(DEFAULT_CURRENT_LOCATION_NAME);
        return liveLocation;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static LiveLocation createUpdatedEntity(EntityManager em) {
        LiveLocation liveLocation = new LiveLocation()
            .currentLocation(UPDATED_CURRENT_LOCATION)
            .currentLocationName(UPDATED_CURRENT_LOCATION_NAME);
        return liveLocation;
    }

    @BeforeEach
    public void initTest() {
        liveLocation = createEntity(em);
    }

    @Test
    @Transactional
    void createLiveLocation() throws Exception {
        int databaseSizeBeforeCreate = liveLocationRepository.findAll().size();
        // Create the LiveLocation
        restLiveLocationMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(liveLocation)))
            .andExpect(status().isCreated());

        // Validate the LiveLocation in the database
        List<LiveLocation> liveLocationList = liveLocationRepository.findAll();
        assertThat(liveLocationList).hasSize(databaseSizeBeforeCreate + 1);
        LiveLocation testLiveLocation = liveLocationList.get(liveLocationList.size() - 1);
        assertThat(testLiveLocation.getCurrentLocation()).isEqualTo(DEFAULT_CURRENT_LOCATION);
        assertThat(testLiveLocation.getCurrentLocationName()).isEqualTo(DEFAULT_CURRENT_LOCATION_NAME);
    }

    @Test
    @Transactional
    void createLiveLocationWithExistingId() throws Exception {
        // Create the LiveLocation with an existing ID
        liveLocation.setId(1L);

        int databaseSizeBeforeCreate = liveLocationRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restLiveLocationMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(liveLocation)))
            .andExpect(status().isBadRequest());

        // Validate the LiveLocation in the database
        List<LiveLocation> liveLocationList = liveLocationRepository.findAll();
        assertThat(liveLocationList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllLiveLocations() throws Exception {
        // Initialize the database
        liveLocationRepository.saveAndFlush(liveLocation);

        // Get all the liveLocationList
        restLiveLocationMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(liveLocation.getId().intValue())))
            .andExpect(jsonPath("$.[*].currentLocation").value(hasItem(DEFAULT_CURRENT_LOCATION.toString())))
            .andExpect(jsonPath("$.[*].currentLocationName").value(hasItem(DEFAULT_CURRENT_LOCATION_NAME)));
    }

    @Test
    @Transactional
    void getLiveLocation() throws Exception {
        // Initialize the database
        liveLocationRepository.saveAndFlush(liveLocation);

        // Get the liveLocation
        restLiveLocationMockMvc
            .perform(get(ENTITY_API_URL_ID, liveLocation.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(liveLocation.getId().intValue()))
            .andExpect(jsonPath("$.currentLocation").value(DEFAULT_CURRENT_LOCATION.toString()))
            .andExpect(jsonPath("$.currentLocationName").value(DEFAULT_CURRENT_LOCATION_NAME));
    }

    @Test
    @Transactional
    void getNonExistingLiveLocation() throws Exception {
        // Get the liveLocation
        restLiveLocationMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingLiveLocation() throws Exception {
        // Initialize the database
        liveLocationRepository.saveAndFlush(liveLocation);

        int databaseSizeBeforeUpdate = liveLocationRepository.findAll().size();

        // Update the liveLocation
        LiveLocation updatedLiveLocation = liveLocationRepository.findById(liveLocation.getId()).get();
        // Disconnect from session so that the updates on updatedLiveLocation are not directly saved in db
        em.detach(updatedLiveLocation);
        updatedLiveLocation.currentLocation(UPDATED_CURRENT_LOCATION).currentLocationName(UPDATED_CURRENT_LOCATION_NAME);

        restLiveLocationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedLiveLocation.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedLiveLocation))
            )
            .andExpect(status().isOk());

        // Validate the LiveLocation in the database
        List<LiveLocation> liveLocationList = liveLocationRepository.findAll();
        assertThat(liveLocationList).hasSize(databaseSizeBeforeUpdate);
        LiveLocation testLiveLocation = liveLocationList.get(liveLocationList.size() - 1);
        assertThat(testLiveLocation.getCurrentLocation()).isEqualTo(UPDATED_CURRENT_LOCATION);
        assertThat(testLiveLocation.getCurrentLocationName()).isEqualTo(UPDATED_CURRENT_LOCATION_NAME);
    }

    @Test
    @Transactional
    void putNonExistingLiveLocation() throws Exception {
        int databaseSizeBeforeUpdate = liveLocationRepository.findAll().size();
        liveLocation.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restLiveLocationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, liveLocation.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(liveLocation))
            )
            .andExpect(status().isBadRequest());

        // Validate the LiveLocation in the database
        List<LiveLocation> liveLocationList = liveLocationRepository.findAll();
        assertThat(liveLocationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchLiveLocation() throws Exception {
        int databaseSizeBeforeUpdate = liveLocationRepository.findAll().size();
        liveLocation.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLiveLocationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(liveLocation))
            )
            .andExpect(status().isBadRequest());

        // Validate the LiveLocation in the database
        List<LiveLocation> liveLocationList = liveLocationRepository.findAll();
        assertThat(liveLocationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamLiveLocation() throws Exception {
        int databaseSizeBeforeUpdate = liveLocationRepository.findAll().size();
        liveLocation.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLiveLocationMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(liveLocation)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the LiveLocation in the database
        List<LiveLocation> liveLocationList = liveLocationRepository.findAll();
        assertThat(liveLocationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateLiveLocationWithPatch() throws Exception {
        // Initialize the database
        liveLocationRepository.saveAndFlush(liveLocation);

        int databaseSizeBeforeUpdate = liveLocationRepository.findAll().size();

        // Update the liveLocation using partial update
        LiveLocation partialUpdatedLiveLocation = new LiveLocation();
        partialUpdatedLiveLocation.setId(liveLocation.getId());

        restLiveLocationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedLiveLocation.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedLiveLocation))
            )
            .andExpect(status().isOk());

        // Validate the LiveLocation in the database
        List<LiveLocation> liveLocationList = liveLocationRepository.findAll();
        assertThat(liveLocationList).hasSize(databaseSizeBeforeUpdate);
        LiveLocation testLiveLocation = liveLocationList.get(liveLocationList.size() - 1);
        assertThat(testLiveLocation.getCurrentLocation()).isEqualTo(DEFAULT_CURRENT_LOCATION);
        assertThat(testLiveLocation.getCurrentLocationName()).isEqualTo(DEFAULT_CURRENT_LOCATION_NAME);
    }

    @Test
    @Transactional
    void fullUpdateLiveLocationWithPatch() throws Exception {
        // Initialize the database
        liveLocationRepository.saveAndFlush(liveLocation);

        int databaseSizeBeforeUpdate = liveLocationRepository.findAll().size();

        // Update the liveLocation using partial update
        LiveLocation partialUpdatedLiveLocation = new LiveLocation();
        partialUpdatedLiveLocation.setId(liveLocation.getId());

        partialUpdatedLiveLocation.currentLocation(UPDATED_CURRENT_LOCATION).currentLocationName(UPDATED_CURRENT_LOCATION_NAME);

        restLiveLocationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedLiveLocation.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedLiveLocation))
            )
            .andExpect(status().isOk());

        // Validate the LiveLocation in the database
        List<LiveLocation> liveLocationList = liveLocationRepository.findAll();
        assertThat(liveLocationList).hasSize(databaseSizeBeforeUpdate);
        LiveLocation testLiveLocation = liveLocationList.get(liveLocationList.size() - 1);
        assertThat(testLiveLocation.getCurrentLocation()).isEqualTo(UPDATED_CURRENT_LOCATION);
        assertThat(testLiveLocation.getCurrentLocationName()).isEqualTo(UPDATED_CURRENT_LOCATION_NAME);
    }

    @Test
    @Transactional
    void patchNonExistingLiveLocation() throws Exception {
        int databaseSizeBeforeUpdate = liveLocationRepository.findAll().size();
        liveLocation.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restLiveLocationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, liveLocation.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(liveLocation))
            )
            .andExpect(status().isBadRequest());

        // Validate the LiveLocation in the database
        List<LiveLocation> liveLocationList = liveLocationRepository.findAll();
        assertThat(liveLocationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchLiveLocation() throws Exception {
        int databaseSizeBeforeUpdate = liveLocationRepository.findAll().size();
        liveLocation.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLiveLocationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(liveLocation))
            )
            .andExpect(status().isBadRequest());

        // Validate the LiveLocation in the database
        List<LiveLocation> liveLocationList = liveLocationRepository.findAll();
        assertThat(liveLocationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamLiveLocation() throws Exception {
        int databaseSizeBeforeUpdate = liveLocationRepository.findAll().size();
        liveLocation.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLiveLocationMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(liveLocation))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the LiveLocation in the database
        List<LiveLocation> liveLocationList = liveLocationRepository.findAll();
        assertThat(liveLocationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteLiveLocation() throws Exception {
        // Initialize the database
        liveLocationRepository.saveAndFlush(liveLocation);

        int databaseSizeBeforeDelete = liveLocationRepository.findAll().size();

        // Delete the liveLocation
        restLiveLocationMockMvc
            .perform(delete(ENTITY_API_URL_ID, liveLocation.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<LiveLocation> liveLocationList = liveLocationRepository.findAll();
        assertThat(liveLocationList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
