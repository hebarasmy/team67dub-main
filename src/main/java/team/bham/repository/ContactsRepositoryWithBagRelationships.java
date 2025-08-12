package team.bham.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import team.bham.domain.Contacts;

public interface ContactsRepositoryWithBagRelationships {
    Optional<Contacts> fetchBagRelationships(Optional<Contacts> contacts);

    List<Contacts> fetchBagRelationships(List<Contacts> contacts);

    Page<Contacts> fetchBagRelationships(Page<Contacts> contacts);
}
