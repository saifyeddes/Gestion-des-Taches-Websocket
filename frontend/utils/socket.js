import { useState, useEffect } from 'react';
import io from 'socket.io-client';

let socket;

export const useSocket = () => {
  const [socketInstance, setSocketInstance] = useState(null);

  useEffect(() => {
    // S'assurer que nous n'avons qu'une seule instance de socket
    if (!socket) {
      socket = io('http://localhost:5001'); // L'URL de votre serveur WebSocket
      setSocketInstance(socket);
    }

    // Nettoyer l'instance de socket lors du démontage du composant
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  return socketInstance;
};
