package team.bham.repository;

import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import team.bham.domain.VoiceRecording;

/**
 * Spring Data JPA repository for the VoiceRecording entity.
 */
@SuppressWarnings("unused")
@Repository
public interface VoiceRecordingRepository extends JpaRepository<VoiceRecording, Long> {
    @Query("select voiceRecording from VoiceRecording voiceRecording where voiceRecording.user.login = ?#{principal.username}")
    List<VoiceRecording> findByUserIsCurrentUser();
}
