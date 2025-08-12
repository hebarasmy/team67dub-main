package team.bham.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import team.bham.domain.LiveLocation;
import team.bham.repository.LiveLocationRepository;
import team.bham.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link team.bham.domain.LiveLocation}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class LiveLocationResource {

    private final Logger log = LoggerFactory.getLogger(LiveLocationResource.class);

    private static final String ENTITY_NAME = "liveLocation";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final LiveLocationRepository liveLocationRepository;

    public LiveLocationResource(LiveLocationRepository liveLocationRepository) {
        this.liveLocationRepository = liveLocationRepository;
    }

    /**
     * {@code POST  /live-locations} : Create a new liveLocation.
     *
     * @param liveLocation the liveLocation to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new liveLocation, or with status {@code 400 (Bad Request)} if the liveLocation has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/live-locations")
    public ResponseEntity<LiveLocation> createLiveLocation(@RequestBody LiveLocation liveLocation) throws URISyntaxException {
        log.debug("REST request to save LiveLocation : {}", liveLocation);
        if (liveLocation.getId() != null) {
            throw new BadRequestAlertException("A new liveLocation cannot already have an ID", ENTITY_NAME, "idexists");
        }
        LiveLocation result = liveLocationRepository.save(liveLocation);
        return ResponseEntity
            .created(new URI("/api/live-locations/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /live-locations/:id} : Updates an existing liveLocation.
     *
     * @param id the id of the liveLocation to save.
     * @param liveLocation the liveLocation to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated liveLocation,
     * or with status {@code 400 (Bad Request)} if the liveLocation is not valid,
     * or with status {@code 500 (Internal Server Error)} if the liveLocation couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/live-locations/{id}")
    public ResponseEntity<LiveLocation> updateLiveLocation(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody LiveLocation liveLocation
    ) throws URISyntaxException {
        log.debug("REST request to update LiveLocation : {}, {}", id, liveLocation);
        if (liveLocation.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, liveLocation.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!liveLocationRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        LiveLocation result = liveLocationRepository.save(liveLocation);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, liveLocation.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /live-locations/:id} : Partial updates given fields of an existing liveLocation, field will ignore if it is null
     *
     * @param id the id of the liveLocation to save.
     * @param liveLocation the liveLocation to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated liveLocation,
     * or with status {@code 400 (Bad Request)} if the liveLocation is not valid,
     * or with status {@code 404 (Not Found)} if the liveLocation is not found,
     * or with status {@code 500 (Internal Server Error)} if the liveLocation couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/live-locations/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<LiveLocation> partialUpdateLiveLocation(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody LiveLocation liveLocation
    ) throws URISyntaxException {
        log.debug("REST request to partial update LiveLocation partially : {}, {}", id, liveLocation);
        if (liveLocation.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, liveLocation.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!liveLocationRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<LiveLocation> result = liveLocationRepository
            .findById(liveLocation.getId())
            .map(existingLiveLocation -> {
                if (liveLocation.getCurrentLocation() != null) {
                    existingLiveLocation.setCurrentLocation(liveLocation.getCurrentLocation());
                }
                if (liveLocation.getCurrentLocationName() != null) {
                    existingLiveLocation.setCurrentLocationName(liveLocation.getCurrentLocationName());
                }

                return existingLiveLocation;
            })
            .map(liveLocationRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, liveLocation.getId().toString())
        );
    }

    /**
     * {@code GET  /live-locations} : get all the liveLocations.
     *
     * @param filter the filter of the request.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of liveLocations in body.
     */
    @GetMapping("/live-locations")
    public List<LiveLocation> getAllLiveLocations(@RequestParam(required = false) String filter) {
        if ("sosbuttons-is-null".equals(filter)) {
            log.debug("REST request to get all LiveLocations where sOSButtons is null");
            return StreamSupport
                .stream(liveLocationRepository.findAll().spliterator(), false)
                .filter(liveLocation -> liveLocation.getSOSButtons() == null)
                .collect(Collectors.toList());
        }
        log.debug("REST request to get all LiveLocations");
        return liveLocationRepository.findAll();
    }

    /**
     * {@code GET  /live-locations/:id} : get the "id" liveLocation.
     *
     * @param id the id of the liveLocation to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the liveLocation, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/live-locations/{id}")
    public ResponseEntity<LiveLocation> getLiveLocation(@PathVariable Long id) {
        log.debug("REST request to get LiveLocation : {}", id);
        Optional<LiveLocation> liveLocation = liveLocationRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(liveLocation);
    }

    /**
     * {@code DELETE  /live-locations/:id} : delete the "id" liveLocation.
     *
     * @param id the id of the liveLocation to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/live-locations/{id}")
    public ResponseEntity<Void> deleteLiveLocation(@PathVariable Long id) {
        log.debug("REST request to delete LiveLocation : {}", id);
        liveLocationRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
