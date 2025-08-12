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
import team.bham.domain.PoliceStation;
import team.bham.domain.enumeration.Geopoint;
import team.bham.repository.PoliceStationRepository;

/**
 * Integration tests for the {@link PoliceStationResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class PoliceStationResourceIT {

    private static final String DEFAULT_STATION_NAME = "AAAAAAAAAA";
    private static final String UPDATED_STATION_NAME = "BBBBBBBBBB";

    private static final Geopoint DEFAULT_STATION_LOCATION = Geopoint.LATITUDE;
    private static final Geopoint UPDATED_STATION_LOCATION = Geopoint.LONGITUDE;

    private static final String ENTITY_API_URL = "/api/police-stations";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private PoliceStationRepository policeStationRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restPoliceStationMockMvc;

    private PoliceStation policeStation;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static PoliceStation createEntity(EntityManager em) {
        PoliceStation policeStation = new PoliceStation().stationName(DEFAULT_STATION_NAME).stationLocation(DEFAULT_STATION_LOCATION);
        return policeStation;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static PoliceStation createUpdatedEntity(EntityManager em) {
        PoliceStation policeStation = new PoliceStation().stationName(UPDATED_STATION_NAME).stationLocation(UPDATED_STATION_LOCATION);
        return policeStation;
    }

    @BeforeEach
    public void initTest() {
        policeStation = createEntity(em);
    }

    @Test
    @Transactional
    void createPoliceStation() throws Exception {
        int databaseSizeBeforeCreate = policeStationRepository.findAll().size();
        // Create the PoliceStation
        restPoliceStationMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(policeStation)))
            .andExpect(status().isCreated());

        // Validate the PoliceStation in the database
        List<PoliceStation> policeStationList = policeStationRepository.findAll();
        assertThat(policeStationList).hasSize(databaseSizeBeforeCreate + 1);
        PoliceStation testPoliceStation = policeStationList.get(policeStationList.size() - 1);
        assertThat(testPoliceStation.getStationName()).isEqualTo(DEFAULT_STATION_NAME);
        assertThat(testPoliceStation.getStationLocation()).isEqualTo(DEFAULT_STATION_LOCATION);
    }

    @Test
    @Transactional
    void createPoliceStationWithExistingId() throws Exception {
        // Create the PoliceStation with an existing ID
        policeStation.setId(1L);

        int databaseSizeBeforeCreate = policeStationRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restPoliceStationMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(policeStation)))
            .andExpect(status().isBadRequest());

        // Validate the PoliceStation in the database
        List<PoliceStation> policeStationList = policeStationRepository.findAll();
        assertThat(policeStationList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllPoliceStations() throws Exception {
        // Initialize the database
        policeStationRepository.saveAndFlush(policeStation);

        // Get all the policeStationList
        restPoliceStationMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(policeStation.getId().intValue())))
            .andExpect(jsonPath("$.[*].stationName").value(hasItem(DEFAULT_STATION_NAME)))
            .andExpect(jsonPath("$.[*].stationLocation").value(hasItem(DEFAULT_STATION_LOCATION.toString())));
    }

    @Test
    @Transactional
    void getPoliceStation() throws Exception {
        // Initialize the database
        policeStationRepository.saveAndFlush(policeStation);

        // Get the policeStation
        restPoliceStationMockMvc
            .perform(get(ENTITY_API_URL_ID, policeStation.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(policeStation.getId().intValue()))
            .andExpect(jsonPath("$.stationName").value(DEFAULT_STATION_NAME))
            .andExpect(jsonPath("$.stationLocation").value(DEFAULT_STATION_LOCATION.toString()));
    }

    @Test
    @Transactional
    void getNonExistingPoliceStation() throws Exception {
        // Get the policeStation
        restPoliceStationMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingPoliceStation() throws Exception {
        // Initialize the database
        policeStationRepository.saveAndFlush(policeStation);

        int databaseSizeBeforeUpdate = policeStationRepository.findAll().size();

        // Update the policeStation
        PoliceStation updatedPoliceStation = policeStationRepository.findById(policeStation.getId()).get();
        // Disconnect from session so that the updates on updatedPoliceStation are not directly saved in db
        em.detach(updatedPoliceStation);
        updatedPoliceStation.stationName(UPDATED_STATION_NAME).stationLocation(UPDATED_STATION_LOCATION);

        restPoliceStationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedPoliceStation.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedPoliceStation))
            )
            .andExpect(status().isOk());

        // Validate the PoliceStation in the database
        List<PoliceStation> policeStationList = policeStationRepository.findAll();
        assertThat(policeStationList).hasSize(databaseSizeBeforeUpdate);
        PoliceStation testPoliceStation = policeStationList.get(policeStationList.size() - 1);
        assertThat(testPoliceStation.getStationName()).isEqualTo(UPDATED_STATION_NAME);
        assertThat(testPoliceStation.getStationLocation()).isEqualTo(UPDATED_STATION_LOCATION);
    }

    @Test
    @Transactional
    void putNonExistingPoliceStation() throws Exception {
        int databaseSizeBeforeUpdate = policeStationRepository.findAll().size();
        policeStation.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPoliceStationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, policeStation.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(policeStation))
            )
            .andExpect(status().isBadRequest());

        // Validate the PoliceStation in the database
        List<PoliceStation> policeStationList = policeStationRepository.findAll();
        assertThat(policeStationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchPoliceStation() throws Exception {
        int databaseSizeBeforeUpdate = policeStationRepository.findAll().size();
        policeStation.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPoliceStationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(policeStation))
            )
            .andExpect(status().isBadRequest());

        // Validate the PoliceStation in the database
        List<PoliceStation> policeStationList = policeStationRepository.findAll();
        assertThat(policeStationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamPoliceStation() throws Exception {
        int databaseSizeBeforeUpdate = policeStationRepository.findAll().size();
        policeStation.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPoliceStationMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(policeStation)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the PoliceStation in the database
        List<PoliceStation> policeStationList = policeStationRepository.findAll();
        assertThat(policeStationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdatePoliceStationWithPatch() throws Exception {
        // Initialize the database
        policeStationRepository.saveAndFlush(policeStation);

        int databaseSizeBeforeUpdate = policeStationRepository.findAll().size();

        // Update the policeStation using partial update
        PoliceStation partialUpdatedPoliceStation = new PoliceStation();
        partialUpdatedPoliceStation.setId(policeStation.getId());

        restPoliceStationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPoliceStation.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedPoliceStation))
            )
            .andExpect(status().isOk());

        // Validate the PoliceStation in the database
        List<PoliceStation> policeStationList = policeStationRepository.findAll();
        assertThat(policeStationList).hasSize(databaseSizeBeforeUpdate);
        PoliceStation testPoliceStation = policeStationList.get(policeStationList.size() - 1);
        assertThat(testPoliceStation.getStationName()).isEqualTo(DEFAULT_STATION_NAME);
        assertThat(testPoliceStation.getStationLocation()).isEqualTo(DEFAULT_STATION_LOCATION);
    }

    @Test
    @Transactional
    void fullUpdatePoliceStationWithPatch() throws Exception {
        // Initialize the database
        policeStationRepository.saveAndFlush(policeStation);

        int databaseSizeBeforeUpdate = policeStationRepository.findAll().size();

        // Update the policeStation using partial update
        PoliceStation partialUpdatedPoliceStation = new PoliceStation();
        partialUpdatedPoliceStation.setId(policeStation.getId());

        partialUpdatedPoliceStation.stationName(UPDATED_STATION_NAME).stationLocation(UPDATED_STATION_LOCATION);

        restPoliceStationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPoliceStation.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedPoliceStation))
            )
            .andExpect(status().isOk());

        // Validate the PoliceStation in the database
        List<PoliceStation> policeStationList = policeStationRepository.findAll();
        assertThat(policeStationList).hasSize(databaseSizeBeforeUpdate);
        PoliceStation testPoliceStation = policeStationList.get(policeStationList.size() - 1);
        assertThat(testPoliceStation.getStationName()).isEqualTo(UPDATED_STATION_NAME);
        assertThat(testPoliceStation.getStationLocation()).isEqualTo(UPDATED_STATION_LOCATION);
    }

    @Test
    @Transactional
    void patchNonExistingPoliceStation() throws Exception {
        int databaseSizeBeforeUpdate = policeStationRepository.findAll().size();
        policeStation.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPoliceStationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, policeStation.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(policeStation))
            )
            .andExpect(status().isBadRequest());

        // Validate the PoliceStation in the database
        List<PoliceStation> policeStationList = policeStationRepository.findAll();
        assertThat(policeStationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchPoliceStation() throws Exception {
        int databaseSizeBeforeUpdate = policeStationRepository.findAll().size();
        policeStation.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPoliceStationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(policeStation))
            )
            .andExpect(status().isBadRequest());

        // Validate the PoliceStation in the database
        List<PoliceStation> policeStationList = policeStationRepository.findAll();
        assertThat(policeStationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamPoliceStation() throws Exception {
        int databaseSizeBeforeUpdate = policeStationRepository.findAll().size();
        policeStation.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPoliceStationMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(policeStation))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the PoliceStation in the database
        List<PoliceStation> policeStationList = policeStationRepository.findAll();
        assertThat(policeStationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deletePoliceStation() throws Exception {
        // Initialize the database
        policeStationRepository.saveAndFlush(policeStation);

        int databaseSizeBeforeDelete = policeStationRepository.findAll().size();

        // Delete the policeStation
        restPoliceStationMockMvc
            .perform(delete(ENTITY_API_URL_ID, policeStation.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<PoliceStation> policeStationList = policeStationRepository.findAll();
        assertThat(policeStationList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
