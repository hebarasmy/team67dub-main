package team.bham.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import team.bham.web.rest.TestUtil;

class SOSButtonTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(SOSButton.class);
        SOSButton sOSButton1 = new SOSButton();
        sOSButton1.setId(1L);
        SOSButton sOSButton2 = new SOSButton();
        sOSButton2.setId(sOSButton1.getId());
        assertThat(sOSButton1).isEqualTo(sOSButton2);
        sOSButton2.setId(2L);
        assertThat(sOSButton1).isNotEqualTo(sOSButton2);
        sOSButton1.setId(null);
        assertThat(sOSButton1).isNotEqualTo(sOSButton2);
    }
}
