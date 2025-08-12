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
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import team.bham.domain.VoiceRecording;
import team.bham.repository.VoiceRecordingRepository;
import team.bham.service.VoiceRecordingService;
import team.bham.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link team.bham.domain.VoiceRecording}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class VoiceRecordingResource {

    private final Logger log = LoggerFactory.getLogger(VoiceRecordingResource.class);

    private static final String ENTITY_NAME = "voiceRecording";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final VoiceRecordingRepository voiceRecordingRepository;
    private final VoiceRecordingService voiceRecordingService;

    public VoiceRecordingResource(VoiceRecordingRepository voiceRecordingRepository, VoiceRecordingService voiceRecordingService) {
        this.voiceRecordingRepository = voiceRecordingRepository;
        this.voiceRecordingService = voiceRecordingService; // Make sure you assign it here
    }

    /**
     * {@code POST  /voice-recordings} : Create a new voiceRecording.
     *
     * @param file the voiceRecording to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new voiceRecording, or with status {@code 400 (Bad Request)} if the voiceRecording has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */

    @PostMapping("/voice-recordings/upload")
    public ResponseEntity<VoiceRecording> uploadVoiceRecording(@RequestParam("file") MultipartFile file) {
        log.debug("REST request to upload VoiceRecording file");

        if (file.isEmpty()) {
            throw new BadRequestAlertException("Invalid file", ENTITY_NAME, "file empty");
        }

        VoiceRecording result = voiceRecordingService.storeFile(file);
        try {
            String fileDownloadUri = ServletUriComponentsBuilder
                .fromCurrentContextPath()
                .path("/downloadFile/")
                .path(result.getId().toString())
                .toUriString();

            return ResponseEntity
                .created(new URI(fileDownloadUri))
                .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
                .body(result);
        } catch (URISyntaxException e) {
            log.error("Error while creating download URI", e);
            throw new BadRequestAlertException("Error while creating download URI", ENTITY_NAME, "uriSyntaxException");
        }
    }

    @PostMapping("/voice-recordings")
    public ResponseEntity<VoiceRecording> createVoiceRecording(@RequestBody VoiceRecording voiceRecording) throws URISyntaxException {
        log.debug("REST request to save VoiceRecording : {}", voiceRecording);
        if (voiceRecording.getId() != null) {
            throw new BadRequestAlertException("A new voiceRecording cannot already have an ID", ENTITY_NAME, "idexists");
        }
        VoiceRecording result = voiceRecordingRepository.save(voiceRecording);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}").buildAndExpand(result.getId()).toUri();

        return ResponseEntity
            .created(location)
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /voice-recordings/:id} : Updates an existing voiceRecording.
     *
     * @param id the id of the voiceRecording to save.
     * @param voiceRecording the voiceRecording to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated voiceRecording,
     * or with status {@code 400 (Bad Request)} if the voiceRecording is not valid,
     * or with status {@code 500 (Internal Server Error)} if the voiceRecording couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/voice-recordings/{id}")
    public ResponseEntity<VoiceRecording> updateVoiceRecording(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody VoiceRecording voiceRecording
    ) throws URISyntaxException {
        log.debug("REST request to update VoiceRecording : {}, {}", id, voiceRecording);
        if (voiceRecording.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, voiceRecording.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!voiceRecordingRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        VoiceRecording result = voiceRecordingRepository.save(voiceRecording);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, voiceRecording.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /voice-recordings/:id} : Partial updates given fields of an existing voiceRecording, field will ignore if it is null
     *
     * @param id the id of the voiceRecording to save.
     * @param voiceRecording the voiceRecording to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated voiceRecording,
     * or with status {@code 400 (Bad Request)} if the voiceRecording is not valid,
     * or with status {@code 404 (Not Found)} if the voiceRecording is not found,
     * or with status {@code 500 (Internal Server Error)} if the voiceRecording couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/voice-recordings/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<VoiceRecording> partialUpdateVoiceRecording(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody VoiceRecording voiceRecording
    ) throws URISyntaxException {
        log.debug("REST request to partial update VoiceRecording partially : {}, {}", id, voiceRecording);
        if (voiceRecording.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, voiceRecording.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!voiceRecordingRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<VoiceRecording> result = voiceRecordingRepository
            .findById(voiceRecording.getId())
            .map(existingVoiceRecording -> {
                if (voiceRecording.getTitle() != null) {
                    existingVoiceRecording.setTitle(voiceRecording.getTitle());
                }
                if (voiceRecording.getDuration() != null) {
                    existingVoiceRecording.setDuration(voiceRecording.getDuration());
                }
                if (voiceRecording.getRecordingDate() != null) {
                    existingVoiceRecording.setRecordingDate(voiceRecording.getRecordingDate());
                }
                if (voiceRecording.getFilePath() != null) {
                    existingVoiceRecording.setFilePath(voiceRecording.getFilePath());
                }

                return existingVoiceRecording;
            })
            .map(voiceRecordingRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, voiceRecording.getId().toString())
        );
    }

    /**
     * {@code GET  /voice-recordings} : get all the voiceRecordings.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of voiceRecordings in body.
     */
    @GetMapping("/voice-recordings")
    public List<VoiceRecording> getAllVoiceRecordings() {
        log.debug("REST request to get all VoiceRecordings");
        return voiceRecordingRepository.findAll();
    }

    /**
     * {@code GET  /voice-recordings/:id} : get the "id" voiceRecording.
     *
     * @param id the id of the voiceRecording to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the voiceRecording, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/voice-recordings/{id}")
    public ResponseEntity<VoiceRecording> getVoiceRecording(@PathVariable Long id) {
        log.debug("REST request to get VoiceRecording : {}", id);
        Optional<VoiceRecording> voiceRecording = voiceRecordingRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(voiceRecording);
    }

    /**
     * {@code DELETE  /voice-recordings/:id} : delete the "id" voiceRecording.
     *
     * @param id the id of the voiceRecording to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/voice-recordings/{id}")
    public ResponseEntity<Void> deleteVoiceRecording(@PathVariable Long id) {
        log.debug("REST request to delete VoiceRecording : {}", id);
        voiceRecordingRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
