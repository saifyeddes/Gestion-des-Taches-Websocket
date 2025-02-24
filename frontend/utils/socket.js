import { useEffect, useRef } from 'react';
import io from 'socket.io-client';

const SOCKET_SERVER_URL = 'http://localhost:5000'; // Remplacez par l'URL de votre serveur

export const useSocket = () => {
    const socketRef = useRef();

    useEffect(() => {
        socketRef.current = io(SOCKET_SERVER_URL);

        return () => {
            socketRef.current.disconnect();
        };
    }, []);

    return socketRef.current;
};
