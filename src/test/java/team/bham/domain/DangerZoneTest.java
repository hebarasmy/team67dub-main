package team.bham.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import team.bham.web.rest.TestUtil;

class DangerZoneTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(DangerZone.class);
        DangerZone dangerZone1 = new DangerZone();
        dangerZone1.setId(1L);
        DangerZone dangerZone2 = new DangerZone();
        dangerZone2.setId(dangerZone1.getId());
        assertThat(dangerZone1).isEqualTo(dangerZone2);
        dangerZone2.setId(2L);
        assertThat(dangerZone1).isNotEqualTo(dangerZone2);
        dangerZone1.setId(null);
        assertThat(dangerZone1).isNotEqualTo(dangerZone2);
    }
}
