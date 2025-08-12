package team.bham.repository;

import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import team.bham.domain.UserChatHistory;

/**
 * Spring Data JPA repository for the UserChatHistory entity.
 */
@SuppressWarnings("unused")
@Repository
public interface UserChatHistoryRepository extends JpaRepository<UserChatHistory, Long> {
    @Query("select userChatHistory from UserChatHistory userChatHistory where userChatHistory.user.login = ?#{principal.username}")
    List<UserChatHistory> findByUserIsCurrentUser();

    List<UserChatHistory> findBySenderUserIDOrReceiverUserID(Long userId, Long userId2);
}
