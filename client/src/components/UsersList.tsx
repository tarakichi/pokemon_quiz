import { useContext, useEffect, useState } from "react";
import SocketContext from "../contexts/SocketContext";

type User = {
    name: string;
    color: string;
    avatar: string;
}

export default function UserList() {
    const socket = useContext(SocketContext);
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        if (!socket) return;

        const handleUsers = (userList: User[]) => {
            console.log("👥 ユーザー一覧更新:", userList);
            setUsers(userList);
        };

        socket.on("users", handleUsers);

        return () => {
            socket.off("users", handleUsers);
        };
    }, [socket]);

    return (
        <div className="p-4 mt-3 mx-auto border rounded-md w-full max-w-md bg-white shadow">
            <h3 className="text-lg font-bold mb-2">接続中のユーザー</h3>
            <ul className="space-y-1">
                {users.map((user, i) => (
                    <li key={i} className="flex items-center gap-2">
                        <span className="text-xl">{user.avatar}</span>
                        <span style={{ color: user.color }}>{user.name}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}