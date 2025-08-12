package team.bham.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import team.bham.web.rest.TestUtil;

class VoiceRecordingTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(VoiceRecording.class);
        VoiceRecording voiceRecording1 = new VoiceRecording();
        voiceRecording1.setId(1L);
        VoiceRecording voiceRecording2 = new VoiceRecording();
        voiceRecording2.setId(voiceRecording1.getId());
        assertThat(voiceRecording1).isEqualTo(voiceRecording2);
        voiceRecording2.setId(2L);
        assertThat(voiceRecording1).isNotEqualTo(voiceRecording2);
        voiceRecording1.setId(null);
        assertThat(voiceRecording1).isNotEqualTo(voiceRecording2);
    }
}
