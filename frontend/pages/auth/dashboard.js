import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { Container, Card, Typography, TextField, Button, Grid, List, ListItem, ListItemText, IconButton, Box } from '@mui/material';
import { AddCircle, CheckCircle, HourglassEmpty } from '@mui/icons-material';

const socket = io("http://localhost:5001");

const Dashboard = () => {
    const [tasks, setTasks] = useState([]);
    const [taskTitle, setTaskTitle] = useState("");

    // Récupérer toutes les tâches
    const fetchTasks = async () => {
        try {
            const res = await axios.get('http://localhost:5001/api/tasks');
            setTasks(res.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des tâches:', error);
        }
    };

    useEffect(() => {
        fetchTasks();

        socket.on('task:added', (newTask) => {
            setTasks((prevTasks) => [...prevTasks, newTask]);
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

        return () => {
            socket.off('task:added');
            socket.off('task:updated');
            socket.off('task:deleted');
        };
    }, []);

    // Ajouter une nouvelle tâche
    const addTask = async () => {
        if (taskTitle) {
            try {
                await axios.post('http://localhost:5001/api/tasks', { title: taskTitle });
                setTaskTitle("");
            } catch (error) {
                console.error('Erreur lors de l\'ajout de la tâche:', error);
            }
        }
    };

    // Mettre à jour le statut de la tâche
    const updateTaskStatus = async (taskId, newStatus) => {
        try {
            await axios.put(`http://localhost:5001/api/tasks/${taskId}`, { status: newStatus });
        } catch (error) {
            console.error('Erreur lors de la mise à jour de la tâche:', error);
        }
    };

    // 📊 Calcul des statistiques
    const totalTasks = tasks.length;
    const tasksInProgress = tasks.filter(task => task.status === "in_progress").length;
    const tasksCompleted = tasks.filter(task => task.status === "completed").length;

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Typography variant="h4" align="center" gutterBottom>
                📌 Dashboard des Tâches
            </Typography>

            {/* Statistiques */}
            <Grid container spacing={3}>
                <Grid item xs={4}>
                    <Card sx={{ p: 3, textAlign: 'center', bgcolor: '#f5f5f5' }}>
                        <Typography variant="h6">Total</Typography>
                        <Typography variant="h4" color="primary">{totalTasks}</Typography>
                    </Card>
                </Grid>
                <Grid item xs={4}>
                    <Card sx={{ p: 3, textAlign: 'center', bgcolor: '#ffeb3b' }}>
                        <Typography variant="h6">En Cours</Typography>
                        <Typography variant="h4" color="warning">{tasksInProgress}</Typography>
                    </Card>
                </Grid>
                <Grid item xs={4}>
                    <Card sx={{ p: 3, textAlign: 'center', bgcolor: '#4caf50', color: 'white' }}>
                        <Typography variant="h6">Terminées</Typography>
                        <Typography variant="h4">{tasksCompleted}</Typography>
                    </Card>
                </Grid>
            </Grid>

            {/* Ajout de tâche */}
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 4 }}>
                <TextField 
                    label="Nouvelle tâche" 
                    variant="outlined" 
                    fullWidth 
                    value={taskTitle} 
                    onChange={(e) => setTaskTitle(e.target.value)} 
                />
                <IconButton color="primary" sx={{ ml: 2 }} onClick={addTask}>
                    <AddCircle fontSize="large" />
                </IconButton>
            </Box>

            {/* Liste des tâches */}
            <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>📋 Liste des Tâches</Typography>
            <List>
                {tasks.map((task) => (
                    <ListItem key={task._id} sx={{ borderBottom: "1px solid #ddd" }}>
                        <ListItemText primary={task.title} secondary={`Statut: ${task.status}`} />
                        <IconButton color="warning" onClick={() => updateTaskStatus(task._id, "in_progress")}>
                            <HourglassEmpty />
                        </IconButton>
                        <IconButton color="success" onClick={() => updateTaskStatus(task._id, "completed")}>
                            <CheckCircle />
                        </IconButton>
                    </ListItem>
                ))}
            </List>
        </Container>
    );
};

export default Dashboard;
