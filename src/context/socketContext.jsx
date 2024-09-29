import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client"
import { useRecoilState } from "recoil"
import { userAtom } from "../Atoms/user"

const socketContext = createContext()

export const useSocket = () => useContext(socketContext)

export const SocketContextProvider = ({ children }) => {
    const [socket, setSocket] = useState(null)
    const [user] = useRecoilState(userAtom)
    const [onlineUsers, setOnlineUsers] = useState()

    useEffect(() => {
        const socket = io(import.meta.env.VITE_SERVER_PATH, {
            query: {
                userId: user?._id 
            }
        })

        setSocket(socket)

        socket.on("getOnlineUsers" , (users) => {
            setOnlineUsers(users)
        })

        return () => {
            socket && socket.close()
        }

    }, [ user?._id])

    return (
        <socketContext.Provider value={{ socket, onlineUsers }}>
            {children}
        </socketContext.Provider>
    )
}