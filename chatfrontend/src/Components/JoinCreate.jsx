import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { createRoomService } from "../Services/RoomService";
import { ChatProvider, useChatContext } from "../Context/ChatContext";

import { useNavigate } from "react-router-dom"; // ✅ Use correct import
import { joinChatApi } from "../Services/RoomService";

const JoinCreate = () => {
  // ✅ Call hooks inside the component body
  const { roomId, currentUser, connected, setRoomId, setCurrentUser, setConnected } = useChatContext();
  const navigate = useNavigate();

  const [detail, setDetail] = useState({
    roomId: "",
    userName: "",
  });

  function handleFormatChange(event) {
    setDetail((prevDetail) => {
      const updatedDetail = { ...prevDetail, [event.target.name]: event.target.value };
      console.log("Updating State:", updatedDetail);
      return updatedDetail;
    });
  }

  function validateform() {
    if (detail.roomId === "" || detail.userName === "") {
      toast.error("Invalid Input");
      return false;
    }
    return true;
  }
  async function joinchat() {
    if (validateform()) {
      try {
        const room = await joinChatApi(detail.roomId);
        toast.success("Joined successfully");
  
        setCurrentUser(detail.userName);
        setRoomId(room.roomId);
        setConnected(true);
  
        navigate(`/chat/${detail.roomId}`);  // ✅ Navigating with roomId
  
      } catch (error) {
        if (error.status === 400) {
          toast.error(error.response.data);
        } else {
          toast.error("Error in joining room ");
        }
        console.log(error);
      }
    }
  }
  
  async function createroom() {
    console.log("Create Room button clicked!");
  
    if (validateform()) {
      try {
        const response = await createRoomService(detail.roomId);
        console.log(response);
        toast.success("Room created Successfully");
  
        setCurrentUser(detail.userName);
        setRoomId(response.roomId);
        setConnected(true);
  
        navigate(`/chat/${detail.roomId}`); // ✅ Navigating with roomId
  
      } catch (error) {
        if (error.status === 400) {
          console.error("Error Response:", error);
          toast.error("Room with this ID already exists. Try another ID.");
        } else {
          console.log("Error in creating room");
          toast.error("Error in creating room.");
        }
      }
    }
  }
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-700">
      <div className="backdrop-blur-lg bg-white/10 border border-white/20 p-8 rounded-3xl shadow-2xl w-96">
        <h2 className="text-3xl font-extrabold text-center text-white mb-6">
          Join or Create a Room
        </h2>

        <label className="block text-white font-medium mb-1">Your Name</label>
        <input
          onChange={handleFormatChange}
          value={detail.userName}
          type="text"
          name="userName"
          placeholder="Enter the name"
          className="w-full p-3 mb-4 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <label className="block text-white font-medium mb-1">Room ID / New Room ID</label>
        <input
          name="roomId"
          onChange={handleFormatChange}
          type="text"
          placeholder="Enter Room ID"
          value={detail.roomId}
          className="w-full p-3 mb-6 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <div className="flex justify-between space-x-2">
          <button
            onClick={joinchat}
            className="w-1/2 bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition-all shadow-md"
          >
            Join Room
          </button>

          <button
            onClick={createroom}
            className="w-1/2 bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 transition-all shadow-md"
          >
            Create Room
          </button>
        </div>
      </div>
    </div>
  );
};

export default JoinCreate;
