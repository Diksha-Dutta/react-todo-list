import React, { useState, useEffect } from 'react';
import './TodoList.css';

const TodoList = () => {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('tasks');
    if (!saved) return [];
    try {
      const parsed = JSON.parse(saved);
      return parsed.map(task => ({
        ...task,
        createdAt: task.createdAt ? Number(task.createdAt) : Date.now(),
      }));
    } catch {
      return [];
    }
  });

  const [newTask, setNewTask] = useState('');
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('dateDesc');

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = () => {
    const trimmed = newTask.trim();
    if (trimmed === '') {
      alert('Task cannot be empty!');
      return;
    }
    setTasks([
      ...tasks,
      {
        id: Date.now(),
        text: trimmed,
        completed: false,
        createdAt: Date.now(),
      },
    ]);
    setNewTask('');
  };

  const handleDeleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const handleToggleComplete = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === 'dateDesc') return b.createdAt - a.createdAt;
    if (sortBy === 'dateAsc') return a.createdAt - b.createdAt;
    if (sortBy === 'nameAsc') return a.text.localeCompare(b.text);
    if (sortBy === 'nameDesc') return b.text.localeCompare(a.text); 
    return 0;
  });

  return (
    <div className="container">
      <h1 className="heading">To-Do List</h1>

      <div className="input-container">
        <input type="text" value={newTask} onChange={(e) => setNewTask(e.target.value)} placeholder="Add a new task..." className="input" onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}/>
        <button onClick={handleAddTask} className="add-button"> Add </button>
      </div>

      <div className="filter-sort-container">
        <div>
          <span style={{ marginRight: 10 }}>Filter:</span>
          <button onClick={() => setFilter('all')} className={filter === 'all' ? 'active-button' : 'filter-button'}>All</button>
          <button onClick={() => setFilter('active')} className={filter === 'active' ? 'active-button' : 'filter-button'}>Active</button>
          <button onClick={() => setFilter('completed')} className={filter === 'completed' ? 'active-button' : 'filter-button'}>Completed </button>
        </div>

        <div>
          <span style={{ marginRight: 10 }}>Sort by:</span>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="select">
            <option value="dateDesc">Date Added (Newest)</option>
            <option value="dateAsc">Date Added (Oldest)</option>
            <option value="nameAsc">Name (A to Z)</option>
            <option value="nameDesc">Name (Z to A)</option>
          </select>
        </div>
      </div>

      <ul className="task-list">
        {sortedTasks.length === 0 && (
          <li className="no-tasks">No tasks added</li>
        )}
        {sortedTasks.map((task) => (
          <li key={task.id} className="task-item">
            <span onClick={() => handleToggleComplete(task.id)} className={`task-text${task.completed ? ' completed' : ''}`} title="Click to toggle complete">
              {task.text}</span>
            <button onClick={() => handleDeleteTask(task.id)} className="delete-button">X</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
