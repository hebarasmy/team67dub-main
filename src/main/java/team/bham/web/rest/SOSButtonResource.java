package team.bham.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import team.bham.domain.SOSButton;
import team.bham.repository.SOSButtonRepository;
import team.bham.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link team.bham.domain.SOSButton}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class SOSButtonResource {

    private final Logger log = LoggerFactory.getLogger(SOSButtonResource.class);

    private static final String ENTITY_NAME = "sOSButton";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final SOSButtonRepository sOSButtonRepository;

    public SOSButtonResource(SOSButtonRepository sOSButtonRepository) {
        this.sOSButtonRepository = sOSButtonRepository;
    }

    /**
     * {@code POST  /sos-buttons} : Create a new sOSButton.
     *
     * @param sOSButton the sOSButton to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new sOSButton, or with status {@code 400 (Bad Request)} if the sOSButton has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/sos-buttons")
    public ResponseEntity<SOSButton> createSOSButton(@RequestBody SOSButton sOSButton) throws URISyntaxException {
        log.debug("REST request to save SOSButton : {}", sOSButton);
        if (sOSButton.getId() != null) {
            throw new BadRequestAlertException("A new sOSButton cannot already have an ID", ENTITY_NAME, "idexists");
        }
        SOSButton result = sOSButtonRepository.save(sOSButton);
        return ResponseEntity
            .created(new URI("/api/sos-buttons/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /sos-buttons/:id} : Updates an existing sOSButton.
     *
     * @param id the id of the sOSButton to save.
     * @param sOSButton the sOSButton to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated sOSButton,
     * or with status {@code 400 (Bad Request)} if the sOSButton is not valid,
     * or with status {@code 500 (Internal Server Error)} if the sOSButton couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/sos-buttons/{id}")
    public ResponseEntity<SOSButton> updateSOSButton(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody SOSButton sOSButton
    ) throws URISyntaxException {
        log.debug("REST request to update SOSButton : {}, {}", id, sOSButton);
        if (sOSButton.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, sOSButton.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!sOSButtonRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        SOSButton result = sOSButtonRepository.save(sOSButton);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, sOSButton.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /sos-buttons/:id} : Partial updates given fields of an existing sOSButton, field will ignore if it is null
     *
     * @param id the id of the sOSButton to save.
     * @param sOSButton the sOSButton to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated sOSButton,
     * or with status {@code 400 (Bad Request)} if the sOSButton is not valid,
     * or with status {@code 404 (Not Found)} if the sOSButton is not found,
     * or with status {@code 500 (Internal Server Error)} if the sOSButton couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/sos-buttons/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<SOSButton> partialUpdateSOSButton(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody SOSButton sOSButton
    ) throws URISyntaxException {
        log.debug("REST request to partial update SOSButton partially : {}, {}", id, sOSButton);
        if (sOSButton.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, sOSButton.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!sOSButtonRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<SOSButton> result = sOSButtonRepository
            .findById(sOSButton.getId())
            .map(existingSOSButton -> {
                if (sOSButton.getLabel() != null) {
                    existingSOSButton.setLabel(sOSButton.getLabel());
                }
                if (sOSButton.getIsActivated() != null) {
                    existingSOSButton.setIsActivated(sOSButton.getIsActivated());
                }
                if (sOSButton.getLocation() != null) {
                    existingSOSButton.setLocation(sOSButton.getLocation());
                }

                return existingSOSButton;
            })
            .map(sOSButtonRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, sOSButton.getId().toString())
        );
    }

    /**
     * {@code GET  /sos-buttons} : get all the sOSButtons.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of sOSButtons in body.
     */
    @GetMapping("/sos-buttons")
    public List<SOSButton> getAllSOSButtons() {
        log.debug("REST request to get all SOSButtons");
        return sOSButtonRepository.findAll();
    }

    /**
     * {@code GET  /sos-buttons/:id} : get the "id" sOSButton.
     *
     * @param id the id of the sOSButton to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the sOSButton, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/sos-buttons/{id}")
    public ResponseEntity<SOSButton> getSOSButton(@PathVariable Long id) {
        log.debug("REST request to get SOSButton : {}", id);
        Optional<SOSButton> sOSButton = sOSButtonRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(sOSButton);
    }

    /**
     * {@code DELETE  /sos-buttons/:id} : delete the "id" sOSButton.
     *
     * @param id the id of the sOSButton to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/sos-buttons/{id}")
    public ResponseEntity<Void> deleteSOSButton(@PathVariable Long id) {
        log.debug("REST request to delete SOSButton : {}", id);
        sOSButtonRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
