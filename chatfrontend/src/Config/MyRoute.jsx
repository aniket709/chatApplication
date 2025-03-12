import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import JoinCreate from "../Components/JoinCreate";
import ChatPage from "../Components/ChatPage";

function MyRoute() {
    return (
        <Routes>
            <Route path="/" element={<JoinCreate />} />
            <Route path="/chat" element={<Navigate to="/" />} /> {/* Redirect if no roomId */}
            <Route path="/chat/:roomId" element={<ChatPage />} /> {/* Dynamic roomId */}
        </Routes>
    );
}

export default MyRoute;
