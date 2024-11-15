import Task from "../models/task.mjs";

export const createTask = async (req, res) => {
  try {
    const { title, description, deadline, priority } = req.body;
    const task = new Task({ title, description, deadline, priority });
    await task.save();
    res.status(201).json({ message: "Task created successfully", task });
  } catch (error) {
    res.status(500).json({ message: "Error creating task", error });
  }
};

export const getTasks = async (req, res) => {
  const { priority, deadline, query } = req.query;

  try {
    const filter = {};

    if (priority) {
      filter.priority = priority;
    }

    if (deadline) {
      filter.deadline = { $lte: new Date(deadline) };
    }

    if (query) {
      filter.$or = [
        { title: { $regex: query, $options: "i" } }, // Case-insensitive match in title
        { description: { $regex: query, $options: "i" } }, // Case-insensitive match in description
      ];
    }

    const tasks = await Task.find(filter);
    res.status(200).json({ tasks });
  } catch (error) {
    res.status(500).json({ message: "Error fetching tasks", error });
  }
};

export const updateTask = async (req, res) => {
  const { id } = req.params;

  try {
    const task = await Task.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json({ message: "Task updated successfully", task });
  } catch (error) {
    res.status(500).json({ message: "Error updating task", error });
  }
};

export const deleteTask = async (req, res) => {
  const { id } = req.params;

  try {
    await Task.findByIdAndDelete(id);
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting task", error });
  }
};
