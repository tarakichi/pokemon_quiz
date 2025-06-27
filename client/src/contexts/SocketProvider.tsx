import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import SocketContext from "./SocketContext";

const socket = io("http://localhost:3001");

type Props = {
    children: React.ReactNode;
};

const SocketProvider: React.FC<Props> = ({ children }) => {
    const [socketInstance, setSocketInstance] = useState<Socket | null>(null);

    useEffect(() => {
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