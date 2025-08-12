package team.bham.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import team.bham.domain.SOSButton;

/**
 * Spring Data JPA repository for the SOSButton entity.
 */
@SuppressWarnings("unused")
@Repository
public interface SOSButtonRepository extends JpaRepository<SOSButton, Long> {}
