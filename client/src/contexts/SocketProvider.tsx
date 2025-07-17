import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import SocketContext from "./SocketContext";

type Props = {
    children: React.ReactNode;
};

const SocketProvider: React.FC<Props> = ({ children }) => {
    const [socketInstance, setSocketInstance] = useState<Socket | null>(null);
    
    useEffect(() => {
        // const socket = io("http://192.168.0.6:3001", {
        const socket = io("http://localhost:3001", {
            withCredentials: true,
            transports: ["websocket", "polling"],
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        });

        setSocketInstance(socket);

        return () => {
            socket.disconnect();
        }
    }, []);

    return (
        <SocketContext.Provider value={socketInstance}>
            {children}
        </SocketContext.Provider>
    );
};

export default SocketProvider;