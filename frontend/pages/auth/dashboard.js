import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSocket } from '../../utils/socket'; // Remarquez les deux points pour remonter à la racine

const Dashboard = () => {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState('');
    const socket = useSocket();

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const res = await axios.get('http://localhost:5001/api/tasks');
                setTasks(res.data);
            } catch (error) {
                console.error('Erreur lors de la récupération des tâches:', error);
            }
        };
        fetchTasks();

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

        return () => {
            if (socket) {
                socket.off('task:added');
                socket.off('task:updated');
                socket.off('task:deleted');
            }
        };
    }, [socket]);

    const handleAddTask = async () => {
        try {
            const res = await axios.post('http://localhost:5001/api/tasks', { title: newTask });
            socket.emit('task:add', res.data);
            setNewTask('');
        } catch (error) {
            console.error('Erreur lors de l\'ajout de la tâche:', error);
        }
    };

    const handleDeleteTask = async (taskId) => {
        try {
            await axios.delete(`http://localhost:5001/api/tasks/${taskId}`);
            socket.emit('task:delete', taskId);
        } catch (error) {
            console.error('Erreur lors de la suppression de la tâche:', error);
        }
    };

    return (
        <div>
            <h1>Dashboard</h1>
            <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="Nouvelle tâche"
            />
            <button onClick={handleAddTask}>Ajouter tâche</button>

            <ul>
                {tasks.map((task) => (
                    <li key={task._id}>
                        {task.title} 
                        <button onClick={() => handleDeleteTask(task._id)}>Supprimer</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Dashboard;
