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
import team.bham.domain.SOSButton;
import team.bham.domain.enumeration.Geopoint;
import team.bham.repository.SOSButtonRepository;

/**
 * Integration tests for the {@link SOSButtonResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class SOSButtonResourceIT {

    private static final String DEFAULT_LABEL = "AAAAAAAAAA";
    private static final String UPDATED_LABEL = "BBBBBBBBBB";

    private static final Boolean DEFAULT_IS_ACTIVATED = false;
    private static final Boolean UPDATED_IS_ACTIVATED = true;

    private static final Geopoint DEFAULT_LOCATION = Geopoint.LATITUDE;
    private static final Geopoint UPDATED_LOCATION = Geopoint.LONGITUDE;

    private static final String ENTITY_API_URL = "/api/sos-buttons";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private SOSButtonRepository sOSButtonRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restSOSButtonMockMvc;

    private SOSButton sOSButton;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static SOSButton createEntity(EntityManager em) {
        SOSButton sOSButton = new SOSButton().label(DEFAULT_LABEL).isActivated(DEFAULT_IS_ACTIVATED).location(DEFAULT_LOCATION);
        return sOSButton;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static SOSButton createUpdatedEntity(EntityManager em) {
        SOSButton sOSButton = new SOSButton().label(UPDATED_LABEL).isActivated(UPDATED_IS_ACTIVATED).location(UPDATED_LOCATION);
        return sOSButton;
    }

    @BeforeEach
    public void initTest() {
        sOSButton = createEntity(em);
    }

    @Test
    @Transactional
    void createSOSButton() throws Exception {
        int databaseSizeBeforeCreate = sOSButtonRepository.findAll().size();
        // Create the SOSButton
        restSOSButtonMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(sOSButton)))
            .andExpect(status().isCreated());

        // Validate the SOSButton in the database
        List<SOSButton> sOSButtonList = sOSButtonRepository.findAll();
        assertThat(sOSButtonList).hasSize(databaseSizeBeforeCreate + 1);
        SOSButton testSOSButton = sOSButtonList.get(sOSButtonList.size() - 1);
        assertThat(testSOSButton.getLabel()).isEqualTo(DEFAULT_LABEL);
        assertThat(testSOSButton.getIsActivated()).isEqualTo(DEFAULT_IS_ACTIVATED);
        assertThat(testSOSButton.getLocation()).isEqualTo(DEFAULT_LOCATION);
    }

    @Test
    @Transactional
    void createSOSButtonWithExistingId() throws Exception {
        // Create the SOSButton with an existing ID
        sOSButton.setId(1L);

        int databaseSizeBeforeCreate = sOSButtonRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restSOSButtonMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(sOSButton)))
            .andExpect(status().isBadRequest());

        // Validate the SOSButton in the database
        List<SOSButton> sOSButtonList = sOSButtonRepository.findAll();
        assertThat(sOSButtonList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllSOSButtons() throws Exception {
        // Initialize the database
        sOSButtonRepository.saveAndFlush(sOSButton);

        // Get all the sOSButtonList
        restSOSButtonMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(sOSButton.getId().intValue())))
            .andExpect(jsonPath("$.[*].label").value(hasItem(DEFAULT_LABEL)))
            .andExpect(jsonPath("$.[*].isActivated").value(hasItem(DEFAULT_IS_ACTIVATED.booleanValue())))
            .andExpect(jsonPath("$.[*].location").value(hasItem(DEFAULT_LOCATION.toString())));
    }

    @Test
    @Transactional
    void getSOSButton() throws Exception {
        // Initialize the database
        sOSButtonRepository.saveAndFlush(sOSButton);

        // Get the sOSButton
        restSOSButtonMockMvc
            .perform(get(ENTITY_API_URL_ID, sOSButton.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(sOSButton.getId().intValue()))
            .andExpect(jsonPath("$.label").value(DEFAULT_LABEL))
            .andExpect(jsonPath("$.isActivated").value(DEFAULT_IS_ACTIVATED.booleanValue()))
            .andExpect(jsonPath("$.location").value(DEFAULT_LOCATION.toString()));
    }

    @Test
    @Transactional
    void getNonExistingSOSButton() throws Exception {
        // Get the sOSButton
        restSOSButtonMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingSOSButton() throws Exception {
        // Initialize the database
        sOSButtonRepository.saveAndFlush(sOSButton);

        int databaseSizeBeforeUpdate = sOSButtonRepository.findAll().size();

        // Update the sOSButton
        SOSButton updatedSOSButton = sOSButtonRepository.findById(sOSButton.getId()).get();
        // Disconnect from session so that the updates on updatedSOSButton are not directly saved in db
        em.detach(updatedSOSButton);
        updatedSOSButton.label(UPDATED_LABEL).isActivated(UPDATED_IS_ACTIVATED).location(UPDATED_LOCATION);

        restSOSButtonMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedSOSButton.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedSOSButton))
            )
            .andExpect(status().isOk());

        // Validate the SOSButton in the database
        List<SOSButton> sOSButtonList = sOSButtonRepository.findAll();
        assertThat(sOSButtonList).hasSize(databaseSizeBeforeUpdate);
        SOSButton testSOSButton = sOSButtonList.get(sOSButtonList.size() - 1);
        assertThat(testSOSButton.getLabel()).isEqualTo(UPDATED_LABEL);
        assertThat(testSOSButton.getIsActivated()).isEqualTo(UPDATED_IS_ACTIVATED);
        assertThat(testSOSButton.getLocation()).isEqualTo(UPDATED_LOCATION);
    }

    @Test
    @Transactional
    void putNonExistingSOSButton() throws Exception {
        int databaseSizeBeforeUpdate = sOSButtonRepository.findAll().size();
        sOSButton.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSOSButtonMockMvc
            .perform(
                put(ENTITY_API_URL_ID, sOSButton.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(sOSButton))
            )
            .andExpect(status().isBadRequest());

        // Validate the SOSButton in the database
        List<SOSButton> sOSButtonList = sOSButtonRepository.findAll();
        assertThat(sOSButtonList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchSOSButton() throws Exception {
        int databaseSizeBeforeUpdate = sOSButtonRepository.findAll().size();
        sOSButton.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSOSButtonMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(sOSButton))
            )
            .andExpect(status().isBadRequest());

        // Validate the SOSButton in the database
        List<SOSButton> sOSButtonList = sOSButtonRepository.findAll();
        assertThat(sOSButtonList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamSOSButton() throws Exception {
        int databaseSizeBeforeUpdate = sOSButtonRepository.findAll().size();
        sOSButton.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSOSButtonMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(sOSButton)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the SOSButton in the database
        List<SOSButton> sOSButtonList = sOSButtonRepository.findAll();
        assertThat(sOSButtonList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateSOSButtonWithPatch() throws Exception {
        // Initialize the database
        sOSButtonRepository.saveAndFlush(sOSButton);

        int databaseSizeBeforeUpdate = sOSButtonRepository.findAll().size();

        // Update the sOSButton using partial update
        SOSButton partialUpdatedSOSButton = new SOSButton();
        partialUpdatedSOSButton.setId(sOSButton.getId());

        partialUpdatedSOSButton.location(UPDATED_LOCATION);

        restSOSButtonMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSOSButton.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSOSButton))
            )
            .andExpect(status().isOk());

        // Validate the SOSButton in the database
        List<SOSButton> sOSButtonList = sOSButtonRepository.findAll();
        assertThat(sOSButtonList).hasSize(databaseSizeBeforeUpdate);
        SOSButton testSOSButton = sOSButtonList.get(sOSButtonList.size() - 1);
        assertThat(testSOSButton.getLabel()).isEqualTo(DEFAULT_LABEL);
        assertThat(testSOSButton.getIsActivated()).isEqualTo(DEFAULT_IS_ACTIVATED);
        assertThat(testSOSButton.getLocation()).isEqualTo(UPDATED_LOCATION);
    }

    @Test
    @Transactional
    void fullUpdateSOSButtonWithPatch() throws Exception {
        // Initialize the database
        sOSButtonRepository.saveAndFlush(sOSButton);

        int databaseSizeBeforeUpdate = sOSButtonRepository.findAll().size();

        // Update the sOSButton using partial update
        SOSButton partialUpdatedSOSButton = new SOSButton();
        partialUpdatedSOSButton.setId(sOSButton.getId());

        partialUpdatedSOSButton.label(UPDATED_LABEL).isActivated(UPDATED_IS_ACTIVATED).location(UPDATED_LOCATION);

        restSOSButtonMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSOSButton.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSOSButton))
            )
            .andExpect(status().isOk());

        // Validate the SOSButton in the database
        List<SOSButton> sOSButtonList = sOSButtonRepository.findAll();
        assertThat(sOSButtonList).hasSize(databaseSizeBeforeUpdate);
        SOSButton testSOSButton = sOSButtonList.get(sOSButtonList.size() - 1);
        assertThat(testSOSButton.getLabel()).isEqualTo(UPDATED_LABEL);
        assertThat(testSOSButton.getIsActivated()).isEqualTo(UPDATED_IS_ACTIVATED);
        assertThat(testSOSButton.getLocation()).isEqualTo(UPDATED_LOCATION);
    }

    @Test
    @Transactional
    void patchNonExistingSOSButton() throws Exception {
        int databaseSizeBeforeUpdate = sOSButtonRepository.findAll().size();
        sOSButton.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSOSButtonMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, sOSButton.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(sOSButton))
            )
            .andExpect(status().isBadRequest());

        // Validate the SOSButton in the database
        List<SOSButton> sOSButtonList = sOSButtonRepository.findAll();
        assertThat(sOSButtonList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchSOSButton() throws Exception {
        int databaseSizeBeforeUpdate = sOSButtonRepository.findAll().size();
        sOSButton.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSOSButtonMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(sOSButton))
            )
            .andExpect(status().isBadRequest());

        // Validate the SOSButton in the database
        List<SOSButton> sOSButtonList = sOSButtonRepository.findAll();
        assertThat(sOSButtonList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamSOSButton() throws Exception {
        int databaseSizeBeforeUpdate = sOSButtonRepository.findAll().size();
        sOSButton.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSOSButtonMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(sOSButton))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the SOSButton in the database
        List<SOSButton> sOSButtonList = sOSButtonRepository.findAll();
        assertThat(sOSButtonList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteSOSButton() throws Exception {
        // Initialize the database
        sOSButtonRepository.saveAndFlush(sOSButton);

        int databaseSizeBeforeDelete = sOSButtonRepository.findAll().size();

        // Delete the sOSButton
        restSOSButtonMockMvc
            .perform(delete(ENTITY_API_URL_ID, sOSButton.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<SOSButton> sOSButtonList = sOSButtonRepository.findAll();
        assertThat(sOSButtonList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
