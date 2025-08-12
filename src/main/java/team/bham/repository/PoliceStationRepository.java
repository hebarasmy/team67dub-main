package team.bham.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import team.bham.domain.PoliceStation;

/**
 * Spring Data JPA repository for the PoliceStation entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PoliceStationRepository extends JpaRepository<PoliceStation, Long> {}
