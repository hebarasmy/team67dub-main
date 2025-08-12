package team.bham.socket;

import com.corundumstudio.socketio.AckRequest;
import com.corundumstudio.socketio.Configuration;
import com.corundumstudio.socketio.SocketIOClient;
import com.corundumstudio.socketio.SocketIOServer;
import com.corundumstudio.socketio.listener.DataListener;

public class SocketIoServer {

    public static void main(String[] args) {
        // Create and start the WebSocket server in a separate thread
        Thread serverThread = new Thread(() -> {
            Configuration config = new Configuration();
            config.setHostname("localhost");
            config.setPort(8080);

            SocketIOServer server = new SocketIOServer(config);

            server.addEventListener(
                "chat message",
                String.class,
                new DataListener<String>() {
                    @Override
                    public void onData(SocketIOClient client, String data, AckRequest ackRequest) {
                        System.out.println("Received message: " + data);
                        server.getBroadcastOperations().sendEvent("chat message", data); // Broadcast the message to all clients
                    }
                }
            );

            server.start();
            System.out.println("Socket.IO server started");
        });

        serverThread.start();

        // Main application logic continues here
        System.out.println("Main application started");

        // Optionally, wait for the server thread to finish execution
        try {
            serverThread.join();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }
}
