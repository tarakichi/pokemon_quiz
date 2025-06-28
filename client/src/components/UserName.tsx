import { useContext, useEffect, useState } from "react";
import SocketContext from "../contexts/SocketContext";
import NameDisplay from "./NameDisplay";
import NameInput from "./NameInput";

export default function UserName() {
    const socket = useContext(SocketContext);
    const [myName, setMyName] = useState("");
    const [editing, setEditing] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem("myName");
        if (saved && socket) {
            setMyName(saved);
            socket.emit("setName", saved);
        }
    }, [socket]);

    const submitName = (name: string) => {
        if (socket) {
            socket.emit("setName", name);
            setMyName(name);
            localStorage.setItem("myName", name);
            setEditing(false);
        }
    };

    const handleChangeRequest = () => {
        setEditing(true);
    };

    return (
        <div className="p-4">
            {myName && !editing ? (
                <NameDisplay name={myName} onChangeRequest={handleChangeRequest} />
            ) : (
                <NameInput onSubmit={submitName}/>
            )}
        </div>
    );
}