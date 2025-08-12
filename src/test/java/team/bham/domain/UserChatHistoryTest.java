package team.bham.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import team.bham.web.rest.TestUtil;

class UserChatHistoryTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(UserChatHistory.class);
        UserChatHistory userChatHistory1 = new UserChatHistory();
        userChatHistory1.setId(1L);
        UserChatHistory userChatHistory2 = new UserChatHistory();
        userChatHistory2.setId(userChatHistory1.getId());
        assertThat(userChatHistory1).isEqualTo(userChatHistory2);
        userChatHistory2.setId(2L);
        assertThat(userChatHistory1).isNotEqualTo(userChatHistory2);
        userChatHistory1.setId(null);
        assertThat(userChatHistory1).isNotEqualTo(userChatHistory2);
    }
}
