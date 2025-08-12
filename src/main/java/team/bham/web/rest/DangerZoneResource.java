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
import team.bham.domain.DangerZone;
import team.bham.repository.DangerZoneRepository;
import team.bham.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link team.bham.domain.DangerZone}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class DangerZoneResource {

    private final Logger log = LoggerFactory.getLogger(DangerZoneResource.class);

    private static final String ENTITY_NAME = "dangerZone";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final DangerZoneRepository dangerZoneRepository;

    public DangerZoneResource(DangerZoneRepository dangerZoneRepository) {
        this.dangerZoneRepository = dangerZoneRepository;
    }

    /**
     * {@code POST  /danger-zones} : Create a new dangerZone.
     *
     * @param dangerZone the dangerZone to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new dangerZone, or with status {@code 400 (Bad Request)} if the dangerZone has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/danger-zones")
    public ResponseEntity<DangerZone> createDangerZone(@RequestBody DangerZone dangerZone) throws URISyntaxException {
        log.debug("REST request to save DangerZone : {}", dangerZone);
        if (dangerZone.getId() != null) {
            throw new BadRequestAlertException("A new dangerZone cannot already have an ID", ENTITY_NAME, "idexists");
        }
        DangerZone result = dangerZoneRepository.save(dangerZone);
        return ResponseEntity
            .created(new URI("/api/danger-zones/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /danger-zones/:id} : Updates an existing dangerZone.
     *
     * @param id the id of the dangerZone to save.
     * @param dangerZone the dangerZone to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated dangerZone,
     * or with status {@code 400 (Bad Request)} if the dangerZone is not valid,
     * or with status {@code 500 (Internal Server Error)} if the dangerZone couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/danger-zones/{id}")
    public ResponseEntity<DangerZone> updateDangerZone(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody DangerZone dangerZone
    ) throws URISyntaxException {
        log.debug("REST request to update DangerZone : {}, {}", id, dangerZone);
        if (dangerZone.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, dangerZone.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!dangerZoneRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        DangerZone result = dangerZoneRepository.save(dangerZone);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, dangerZone.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /danger-zones/:id} : Partial updates given fields of an existing dangerZone, field will ignore if it is null
     *
     * @param id the id of the dangerZone to save.
     * @param dangerZone the dangerZone to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated dangerZone,
     * or with status {@code 400 (Bad Request)} if the dangerZone is not valid,
     * or with status {@code 404 (Not Found)} if the dangerZone is not found,
     * or with status {@code 500 (Internal Server Error)} if the dangerZone couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/danger-zones/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<DangerZone> partialUpdateDangerZone(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody DangerZone dangerZone
    ) throws URISyntaxException {
        log.debug("REST request to partial update DangerZone partially : {}, {}", id, dangerZone);
        if (dangerZone.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, dangerZone.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!dangerZoneRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<DangerZone> result = dangerZoneRepository
            .findById(dangerZone.getId())
            .map(existingDangerZone -> {
                if (dangerZone.getZoneName() != null) {
                    existingDangerZone.setZoneName(dangerZone.getZoneName());
                }
                if (dangerZone.getZoneDescription() != null) {
                    existingDangerZone.setZoneDescription(dangerZone.getZoneDescription());
                }
                if (dangerZone.getZoneLocation() != null) {
                    existingDangerZone.setZoneLocation(dangerZone.getZoneLocation());
                }

                return existingDangerZone;
            })
            .map(dangerZoneRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, dangerZone.getId().toString())
        );
    }

    /**
     * {@code GET  /danger-zones} : get all the dangerZones.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of dangerZones in body.
     */
    @GetMapping("/danger-zones")
    public List<DangerZone> getAllDangerZones() {
        log.debug("REST request to get all DangerZones");
        return dangerZoneRepository.findAll();
    }

    /**
     * {@code GET  /danger-zones/:id} : get the "id" dangerZone.
     *
     * @param id the id of the dangerZone to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the dangerZone, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/danger-zones/{id}")
    public ResponseEntity<DangerZone> getDangerZone(@PathVariable Long id) {
        log.debug("REST request to get DangerZone : {}", id);
        Optional<DangerZone> dangerZone = dangerZoneRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(dangerZone);
    }

    /**
     * {@code DELETE  /danger-zones/:id} : delete the "id" dangerZone.
     *
     * @param id the id of the dangerZone to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/danger-zones/{id}")
    public ResponseEntity<Void> deleteDangerZone(@PathVariable Long id) {
        log.debug("REST request to delete DangerZone : {}", id);
        dangerZoneRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
