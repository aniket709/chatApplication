package chatbackend.chatbackend.Controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import chatbackend.chatbackend.Entity.*;
import chatbackend.chatbackend.Repository.*;
import java.util.*;

@RestController
@RequestMapping("/api/v1/rooms")
@CrossOrigin("*")
public class RoomController {

    private RoomRepository roomrepository;

    public RoomController(RoomRepository roomrepository) {
        this.roomrepository = roomrepository;
    }

    @PostMapping
public ResponseEntity<?> createRoom(@RequestBody String roomId) {
    if (roomrepository.findByRoomId(roomId) != null) {
        return ResponseEntity.badRequest().body("Room already exists");
    }

    // Trim and remove trailing '=' if it exists
    roomId = roomId.trim().replaceAll("=+$", "");  // ✅ Remove trailing '='

    Room room = new Room();
    room.setRoomId(roomId);
    roomrepository.save(room);

    return ResponseEntity.status(HttpStatus.CREATED).body(room);
}


@GetMapping("/{roomId}")
public ResponseEntity<?> joinroom(@PathVariable String roomId) {
    // Remove trailing '=' if present
    roomId = roomId.trim().replaceAll("=+$", "");  // ✅ Ensure clean roomId

    Room room = roomrepository.findByRoomId(roomId);
    if (room == null) {
        return ResponseEntity.badRequest().body("Not found");
    }

    return ResponseEntity.ok(room);
}


@GetMapping("/{roomId}/messages")
public ResponseEntity<?> getmessage(
    @PathVariable String roomId,
    @RequestParam(value = "page", defaultValue = "0", required = false) int page,
    @RequestParam(value = "size", defaultValue = "20", required = false) int size) {

    // ✅ Ensure roomId is valid
    if (roomId == null || roomId.trim().isEmpty()) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid roomId");
    }

    Room room = roomrepository.findByRoomId(roomId.trim());
    
    if (room == null) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Room not found");
    }

    List<Message> messages = room.getMessage();

    // ✅ Handle case when no messages exist
    if (messages == null || messages.isEmpty()) {
        return ResponseEntity.status(HttpStatus.NO_CONTENT).body("No messages found in this room");
    }

    // ✅ Fix pagination logic
    int totalMessages = messages.size();
    int start = Math.max(0, totalMessages - ((page + 1) * size));
    int end = Math.min(totalMessages, start + size);

    // ✅ Handle invalid pagination cases
    if (start >= end || start < 0) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid page or size parameters");
    }

    List<Message> paginatedMessages = messages.subList(start, end);
    return ResponseEntity.ok(paginatedMessages);
}


    
}
