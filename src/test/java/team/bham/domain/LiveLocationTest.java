package team.bham.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import team.bham.web.rest.TestUtil;

class LiveLocationTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(LiveLocation.class);
        LiveLocation liveLocation1 = new LiveLocation();
        liveLocation1.setId(1L);
        LiveLocation liveLocation2 = new LiveLocation();
        liveLocation2.setId(liveLocation1.getId());
        assertThat(liveLocation1).isEqualTo(liveLocation2);
        liveLocation2.setId(2L);
        assertThat(liveLocation1).isNotEqualTo(liveLocation2);
        liveLocation1.setId(null);
        assertThat(liveLocation1).isNotEqualTo(liveLocation2);
    }
}
