package team.bham.web.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import team.bham.domain.ChatMessage;
import team.bham.domain.User;
import team.bham.domain.UserChatHistory;
import team.bham.repository.UserChatHistoryRepository;

@Controller
public class WebSocketController {

    @Autowired
    private UserChatHistoryRepository userChatHistoryRepository;

    @MessageMapping("/chat")
    @SendTo("/topic/chat")
    public ChatMessage handleTextMessage(@Payload ChatMessage message) {
        // Save the message to the database
        // Assuming you have a service class to handle database operations

        // Identify whether the message content belongs to the sender or receiver
        Long currentUserId = getCurrentUserId(); // You need to implement this method to get the current user's ID
        boolean isSender = currentUserId.equals(message.getSenderUserId());

        // Save message to chat history
        UserChatHistory chatHistory = new UserChatHistory();
        chatHistory.setSenderUserID(isSender ? currentUserId : message.getReceiverUserId());
        chatHistory.setReceiverUserID(isSender ? message.getReceiverUserId() : currentUserId);
        chatHistory.setMessageContent(message.getMessageContent());
        chatHistory.setMessageDateTime(message.getMessageDateTime());
        userChatHistoryRepository.save(chatHistory);

        return message; // Optionally, send a response back to the client
    }

    private Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof User) {
            User currentUser = (User) authentication.getPrincipal();
            return currentUser.getId();
        } else {
            // Handle case where user is not authenticated or principal is not of type User
            return null;
        }
    }
}
