import React, { useEffect, useState } from 'react';
import { useSocket } from '../utils/socket';

const Dashboard = () => {
    const [tasks, setTasks] = useState([]);
    const socket = useSocket();

    useEffect(() => {
        if (socket) {
            socket.on('task:added', (task) => {
                setTasks((prevTasks) => [...prevTasks, task]);
            });

            socket.on('task:updated', (updatedTask) => {
                setTasks((prevTasks) =>
                    prevTasks.map((task) =>
                        task._id === updatedTask._id ? updatedTask : task
                    )
                );
            });

            socket.on('task:deleted', (taskId) => {
                setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
            });
        }

        // Cleanup socket connection on unmount
        return () => {
            socket.off('task:added');
            socket.off('task:updated');
            socket.off('task:deleted');
        };
    }, [socket]);

    return (
        <div>
            <h1>Dashboard</h1>
            {/* Afficher les tâches ici */}
            <ul>
                {tasks.map((task) => (
                    <li key={task._id}>{task.name}</li>
                ))}
            </ul>
        </div>
    );
};

export default Dashboard;
