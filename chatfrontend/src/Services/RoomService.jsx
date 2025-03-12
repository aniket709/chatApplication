import { httpClient } from "../Config/AxiosHelper";

export const createRoomService = async (roomDetail) => {
    const response = await httpClient.post(`/api/v1/rooms`, roomDetail); // Fix: Pass roomDetail as second argument
    return response.data;
};


export const joinChatApi = async (roomId) =>{

    const response = await httpClient.get(`/api/v1/rooms/${roomId}`);
return response.data;

}