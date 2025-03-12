package chatbackend.chatbackend.Controller;

import java.time.LocalDateTime;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Controller;
import chatbackend.chatbackend.Repository.RoomRepository;
import chatbackend.chatbackend.Payload.MessageRequest;
import chatbackend.chatbackend.Entity.Message;
import chatbackend.chatbackend.Entity.Room;

@Controller
public class ChatController {

    private final RoomRepository roomRepository;

    public ChatController(RoomRepository roomRepository) {
        this.roomRepository = roomRepository;
    }

    @MessageMapping("/sendMessage/{roomId}")
    @SendTo("/topic/room/{roomId}")  
    public Message sendMessage(@DestinationVariable String roomId, @Payload MessageRequest request) {

        System.out.println("🚀 Received Message: " + request.getContent() + " from " + request.getSender());

        Room room = roomRepository.findByRoomId(roomId);

        if (room == null) {
            throw new RuntimeException("Room not found");
        }

        Message message = new Message();
        message.setContent(request.getContent());
        message.setSender(request.getSender());
        message.setTimeStamp(LocalDateTime.now());

        room.getMessage().add(message);
        roomRepository.save(room);

        return message;  // ✅ Message is returned ONCE to the topic
    }
}
