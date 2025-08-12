package team.bham.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import team.bham.web.rest.TestUtil;

class PoliceStationTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(PoliceStation.class);
        PoliceStation policeStation1 = new PoliceStation();
        policeStation1.setId(1L);
        PoliceStation policeStation2 = new PoliceStation();
        policeStation2.setId(policeStation1.getId());
        assertThat(policeStation1).isEqualTo(policeStation2);
        policeStation2.setId(2L);
        assertThat(policeStation1).isNotEqualTo(policeStation2);
        policeStation1.setId(null);
        assertThat(policeStation1).isNotEqualTo(policeStation2);
    }
}
