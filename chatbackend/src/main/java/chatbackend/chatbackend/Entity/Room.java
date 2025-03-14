package chatbackend.chatbackend.Entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.util.List;
import java.util.ArrayList;
import chatbackend.chatbackend.Entity.Message;

@Document(collection = "rooms")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

public class Room {
    @Id
    private String id; 
    private String roomId;

    private List <Message> message= new ArrayList<>();
    
}
