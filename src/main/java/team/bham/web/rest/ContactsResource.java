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
import team.bham.domain.Contacts;
import team.bham.repository.ContactsRepository;
import team.bham.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link team.bham.domain.Contacts}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ContactsResource {

    private final Logger log = LoggerFactory.getLogger(ContactsResource.class);

    private static final String ENTITY_NAME = "contacts";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ContactsRepository contactsRepository;

    public ContactsResource(ContactsRepository contactsRepository) {
        this.contactsRepository = contactsRepository;
    }

    /**
     * {@code POST  /contacts} : Create a new contacts.
     *
     * @param contacts the contacts to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new contacts, or with status {@code 400 (Bad Request)} if the contacts has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/contacts")
    public ResponseEntity<Contacts> createContacts(@RequestBody Contacts contacts) throws URISyntaxException {
        log.debug("REST request to save Contacts : {}", contacts);
        if (contacts.getId() != null) {
            throw new BadRequestAlertException("A new contacts cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Contacts result = contactsRepository.save(contacts);
        return ResponseEntity
            .created(new URI("/api/contacts/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /contacts/:id} : Updates an existing contacts.
     *
     * @param id the id of the contacts to save.
     * @param contacts the contacts to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated contacts,
     * or with status {@code 400 (Bad Request)} if the contacts is not valid,
     * or with status {@code 500 (Internal Server Error)} if the contacts couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/contacts/{id}")
    public ResponseEntity<Contacts> updateContacts(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Contacts contacts
    ) throws URISyntaxException {
        log.debug("REST request to update Contacts : {}, {}", id, contacts);
        if (contacts.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, contacts.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!contactsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Contacts result = contactsRepository.save(contacts);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, contacts.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /contacts/:id} : Partial updates given fields of an existing contacts, field will ignore if it is null
     *
     * @param id the id of the contacts to save.
     * @param contacts the contacts to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated contacts,
     * or with status {@code 400 (Bad Request)} if the contacts is not valid,
     * or with status {@code 404 (Not Found)} if the contacts is not found,
     * or with status {@code 500 (Internal Server Error)} if the contacts couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/contacts/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Contacts> partialUpdateContacts(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Contacts contacts
    ) throws URISyntaxException {
        log.debug("REST request to partial update Contacts partially : {}, {}", id, contacts);
        if (contacts.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, contacts.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!contactsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Contacts> result = contactsRepository
            .findById(contacts.getId())
            .map(existingContacts -> {
                if (contacts.getImage() != null) {
                    existingContacts.setImage(contacts.getImage());
                }
                if (contacts.getImageContentType() != null) {
                    existingContacts.setImageContentType(contacts.getImageContentType());
                }
                if (contacts.getContactName() != null) {
                    existingContacts.setContactName(contacts.getContactName());
                }
                if (contacts.getContactPhone() != null) {
                    existingContacts.setContactPhone(contacts.getContactPhone());
                }
                if (contacts.getContactRelation() != null) {
                    existingContacts.setContactRelation(contacts.getContactRelation());
                }

                return existingContacts;
            })
            .map(contactsRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, contacts.getId().toString())
        );
    }

    /**
     * {@code GET  /contacts} : get all the contacts.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of contacts in body.
     */
    @GetMapping("/contacts")
    public List<Contacts> getAllContacts(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all Contacts");
        if (eagerload) {
            return contactsRepository.findAllWithEagerRelationships();
        } else {
            return contactsRepository.findAll();
        }
    }

    /**
     * {@code GET  /contacts/:id} : get the "id" contacts.
     *
     * @param id the id of the contacts to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the contacts, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/contacts/{id}")
    public ResponseEntity<Contacts> getContacts(@PathVariable Long id) {
        log.debug("REST request to get Contacts : {}", id);
        Optional<Contacts> contacts = contactsRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(contacts);
    }

    /**
     * {@code DELETE  /contacts/:id} : delete the "id" contacts.
     *
     * @param id the id of the contacts to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/contacts/{id}")
    public ResponseEntity<Void> deleteContacts(@PathVariable Long id) {
        log.debug("REST request to delete Contacts : {}", id);
        contactsRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
