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
import team.bham.domain.PoliceStation;
import team.bham.repository.PoliceStationRepository;
import team.bham.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link team.bham.domain.PoliceStation}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class PoliceStationResource {

    private final Logger log = LoggerFactory.getLogger(PoliceStationResource.class);

    private static final String ENTITY_NAME = "policeStation";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final PoliceStationRepository policeStationRepository;

    public PoliceStationResource(PoliceStationRepository policeStationRepository) {
        this.policeStationRepository = policeStationRepository;
    }

    /**
     * {@code POST  /police-stations} : Create a new policeStation.
     *
     * @param policeStation the policeStation to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new policeStation, or with status {@code 400 (Bad Request)} if the policeStation has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/police-stations")
    public ResponseEntity<PoliceStation> createPoliceStation(@RequestBody PoliceStation policeStation) throws URISyntaxException {
        log.debug("REST request to save PoliceStation : {}", policeStation);
        if (policeStation.getId() != null) {
            throw new BadRequestAlertException("A new policeStation cannot already have an ID", ENTITY_NAME, "idexists");
        }
        PoliceStation result = policeStationRepository.save(policeStation);
        return ResponseEntity
            .created(new URI("/api/police-stations/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /police-stations/:id} : Updates an existing policeStation.
     *
     * @param id the id of the policeStation to save.
     * @param policeStation the policeStation to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated policeStation,
     * or with status {@code 400 (Bad Request)} if the policeStation is not valid,
     * or with status {@code 500 (Internal Server Error)} if the policeStation couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/police-stations/{id}")
    public ResponseEntity<PoliceStation> updatePoliceStation(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody PoliceStation policeStation
    ) throws URISyntaxException {
        log.debug("REST request to update PoliceStation : {}, {}", id, policeStation);
        if (policeStation.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, policeStation.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!policeStationRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        PoliceStation result = policeStationRepository.save(policeStation);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, policeStation.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /police-stations/:id} : Partial updates given fields of an existing policeStation, field will ignore if it is null
     *
     * @param id the id of the policeStation to save.
     * @param policeStation the policeStation to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated policeStation,
     * or with status {@code 400 (Bad Request)} if the policeStation is not valid,
     * or with status {@code 404 (Not Found)} if the policeStation is not found,
     * or with status {@code 500 (Internal Server Error)} if the policeStation couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/police-stations/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<PoliceStation> partialUpdatePoliceStation(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody PoliceStation policeStation
    ) throws URISyntaxException {
        log.debug("REST request to partial update PoliceStation partially : {}, {}", id, policeStation);
        if (policeStation.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, policeStation.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!policeStationRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<PoliceStation> result = policeStationRepository
            .findById(policeStation.getId())
            .map(existingPoliceStation -> {
                if (policeStation.getStationName() != null) {
                    existingPoliceStation.setStationName(policeStation.getStationName());
                }
                if (policeStation.getStationLocation() != null) {
                    existingPoliceStation.setStationLocation(policeStation.getStationLocation());
                }

                return existingPoliceStation;
            })
            .map(policeStationRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, policeStation.getId().toString())
        );
    }

    /**
     * {@code GET  /police-stations} : get all the policeStations.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of policeStations in body.
     */
    @GetMapping("/police-stations")
    public List<PoliceStation> getAllPoliceStations() {
        log.debug("REST request to get all PoliceStations");
        return policeStationRepository.findAll();
    }

    /**
     * {@code GET  /police-stations/:id} : get the "id" policeStation.
     *
     * @param id the id of the policeStation to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the policeStation, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/police-stations/{id}")
    public ResponseEntity<PoliceStation> getPoliceStation(@PathVariable Long id) {
        log.debug("REST request to get PoliceStation : {}", id);
        Optional<PoliceStation> policeStation = policeStationRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(policeStation);
    }

    /**
     * {@code DELETE  /police-stations/:id} : delete the "id" policeStation.
     *
     * @param id the id of the policeStation to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/police-stations/{id}")
    public ResponseEntity<Void> deletePoliceStation(@PathVariable Long id) {
        log.debug("REST request to delete PoliceStation : {}", id);
        policeStationRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
