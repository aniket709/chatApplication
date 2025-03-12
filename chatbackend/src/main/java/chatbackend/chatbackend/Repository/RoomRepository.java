package chatbackend.chatbackend.Repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import  chatbackend.chatbackend.Entity.Room;

public interface  RoomRepository extends  MongoRepository<Room,String> {

    Room findByRoomId(String roomId);

    
}
