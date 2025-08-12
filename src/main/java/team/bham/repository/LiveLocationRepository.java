package team.bham.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import team.bham.domain.LiveLocation;

/**
 * Spring Data JPA repository for the LiveLocation entity.
 */
@SuppressWarnings("unused")
@Repository
public interface LiveLocationRepository extends JpaRepository<LiveLocation, Long> {}
