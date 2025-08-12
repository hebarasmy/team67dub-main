package team.bham.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import team.bham.domain.DangerZone;

/**
 * Spring Data JPA repository for the DangerZone entity.
 */
@SuppressWarnings("unused")
@Repository
public interface DangerZoneRepository extends JpaRepository<DangerZone, Long> {}
