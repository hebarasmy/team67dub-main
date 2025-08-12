package team.bham.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import team.bham.domain.UserChatHistory;
import team.bham.repository.UserChatHistoryRepository;
import team.bham.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link team.bham.domain.UserChatHistory}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class UserChatHistoryResource {

    private final Logger log = LoggerFactory.getLogger(UserChatHistoryResource.class);

    private static final String ENTITY_NAME = "userChatHistory";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final UserChatHistoryRepository userChatHistoryRepository;

    public UserChatHistoryResource(UserChatHistoryRepository userChatHistoryRepository) {
        this.userChatHistoryRepository = userChatHistoryRepository;
    }

    /**
     * {@code POST  /user-chat-histories} : Create a new userChatHistory.
     *
     * @param userChatHistory the userChatHistory to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new userChatHistory, or with status {@code 400 (Bad Request)} if the userChatHistory has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/user-chat-histories")
    public ResponseEntity<UserChatHistory> createUserChatHistory(@Valid @RequestBody UserChatHistory userChatHistory)
        throws URISyntaxException {
        log.debug("REST request to save UserChatHistory : {}", userChatHistory);
        if (userChatHistory.getId() != null) {
            throw new BadRequestAlertException("A new userChatHistory cannot already have an ID", ENTITY_NAME, "idexists");
        }
        UserChatHistory result = userChatHistoryRepository.save(userChatHistory);
        return ResponseEntity
            .created(new URI("/api/user-chat-histories/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * GET /user-chat-history/{userId} : Get chat history for the given user ID.
     *
     * @param userId the ID of the user
     * @return the list of chat history records
     */
    @GetMapping("/user-chat-history/{userId}")
    public List<UserChatHistory> getChatHistoryForUser(@PathVariable Long userId) {
        return userChatHistoryRepository.findBySenderUserIDOrReceiverUserID(userId, userId);
    }

    /**
     * {@code PUT  /user-chat-histories/:id} : Updates an existing userChatHistory.
     *
     * @param id the id of the userChatHistory to save.
     * @param userChatHistory the userChatHistory to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated userChatHistory,
     * or with status {@code 400 (Bad Request)} if the userChatHistory is not valid,
     * or with status {@code 500 (Internal Server Error)} if the userChatHistory couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/user-chat-histories/{id}")
    public ResponseEntity<UserChatHistory> updateUserChatHistory(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody UserChatHistory userChatHistory
    ) throws URISyntaxException {
        log.debug("REST request to update UserChatHistory : {}, {}", id, userChatHistory);
        if (userChatHistory.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, userChatHistory.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!userChatHistoryRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        UserChatHistory result = userChatHistoryRepository.save(userChatHistory);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, userChatHistory.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /user-chat-histories/:id} : Partial updates given fields of an existing userChatHistory, field will ignore if it is null
     *
     * @param id the id of the userChatHistory to save.
     * @param userChatHistory the userChatHistory to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated userChatHistory,
     * or with status {@code 400 (Bad Request)} if the userChatHistory is not valid,
     * or with status {@code 404 (Not Found)} if the userChatHistory is not found,
     * or with status {@code 500 (Internal Server Error)} if the userChatHistory couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/user-chat-histories/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<UserChatHistory> partialUpdateUserChatHistory(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody UserChatHistory userChatHistory
    ) throws URISyntaxException {
        log.debug("REST request to partial update UserChatHistory partially : {}, {}", id, userChatHistory);
        if (userChatHistory.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, userChatHistory.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!userChatHistoryRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<UserChatHistory> result = userChatHistoryRepository
            .findById(userChatHistory.getId())
            .map(existingUserChatHistory -> {
                if (userChatHistory.getSenderUserID() != null) {
                    existingUserChatHistory.setSenderUserID(userChatHistory.getSenderUserID());
                }
                if (userChatHistory.getReceiverUserID() != null) {
                    existingUserChatHistory.setReceiverUserID(userChatHistory.getReceiverUserID());
                }
                if (userChatHistory.getMessageContent() != null) {
                    existingUserChatHistory.setMessageContent(userChatHistory.getMessageContent());
                }
                if (userChatHistory.getMessageDateTime() != null) {
                    existingUserChatHistory.setMessageDateTime(userChatHistory.getMessageDateTime());
                }

                return existingUserChatHistory;
            })
            .map(userChatHistoryRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, userChatHistory.getId().toString())
        );
    }

    /**
     * {@code GET  /user-chat-histories} : get all the userChatHistories.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of userChatHistories in body.
     */
    @GetMapping("/user-chat-histories")
    public List<UserChatHistory> getAllUserChatHistories() {
        log.debug("REST request to get all UserChatHistories");
        return userChatHistoryRepository.findAll();
    }

    /**
     * {@code GET  /user-chat-histories/:id} : get the "id" userChatHistory.
     *
     * @param id the id of the userChatHistory to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the userChatHistory, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/user-chat-histories/{id}")
    public ResponseEntity<UserChatHistory> getUserChatHistory(@PathVariable Long id) {
        log.debug("REST request to get UserChatHistory : {}", id);
        Optional<UserChatHistory> userChatHistory = userChatHistoryRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(userChatHistory);
    }

    /**
     * {@code DELETE  /user-chat-histories/:id} : delete the "id" userChatHistory.
     *
     * @param id the id of the userChatHistory to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/user-chat-histories/{id}")
    public ResponseEntity<Void> deleteUserChatHistory(@PathVariable Long id) {
        log.debug("REST request to delete UserChatHistory : {}", id);
        userChatHistoryRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
