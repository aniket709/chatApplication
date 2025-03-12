import React from "react";
import { useNavigate } from "react-router-dom";

const Navbar = ({ username }) => {
  const navigate = useNavigate();

  const leaveRoom = () => {
    navigate("/"); // Redirect to Join Room Page
  };

  return (
    <div className="w-full bg-gray-900 text-white p-4 flex justify-between items-center shadow-md">
      <h2 className="text-lg font-semibold">{username ? `User: ${username}` : "Chat App"}</h2>
      <button 
        onClick={leaveRoom} 
        className="bg-red-600 px-4 py-2 rounded-md hover:bg-red-700 transition-all"
      >
        Leave Room
      </button>
    </div>
  );
};

export default Navbar;
