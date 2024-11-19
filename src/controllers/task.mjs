import Task from "../models/task.mjs";

export const createTask = async (req, res) => {
  try {
    const { user, title, description, deadline, priority } = req.body;
    const task = new Task({ user, title, description, deadline, priority });
    await task.save();
    res.status(201).json({ message: "Task created successfully", task });
  } catch (error) {
    res.status(500).json({ message: "Error creating task", error });
  }
};

export const getTasks = async (req, res) => {
  const { priority, deadline, query } = req.query;

  try {
    // Ensure `userId` is available from authentication middleware
    const userId = req.user?.id; // `req.user` is populated by authentication middleware

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized access" });
    }

    // Initialize base filter to include the user's tasks only
    const filter = { user: userId };

    // Add optional filters
    if (priority) {
      filter.priority = priority; // e.g., High, Medium, Low
    }

    if (deadline) {
      filter.deadline = { $lte: new Date(deadline) }; // Fetch tasks due before or on the given date
    }

    if (query) {
      filter.$or = [
        { title: { $regex: query, $options: "i" } }, // Case-insensitive match in title
        { description: { $regex: query, $options: "i" } }, // Case-insensitive match in description
      ];
    }

    // Fetch tasks from the database
    const tasks = await Task.find(filter);

    // Send the response with the filtered tasks
    res.status(200).json({ tasks });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ message: "Error fetching tasks", error });
  }
};

// export const getTasks = async (req, res) => {
//   const { priority, deadline, query } = req.query;

//   try {
//     const filter = {};

//     if (priority) {
//       filter.priority = priority;
//     }

//     if (deadline) {
//       filter.deadline = { $lte: new Date(deadline) };
//     }

//     if (query) {
//       filter.$or = [
//         { title: { $regex: query, $options: "i" } }, // Case-insensitive match in title
//         { description: { $regex: query, $options: "i" } }, // Case-insensitive match in description
//       ];
//     }

//     const tasks = await Task.find(filter);
//     res.status(200).json({ tasks });
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching tasks", error });
//   }
// };

export const getTask = async (req, res) => {
  const { id } = req.params;

  try {
    const task = await Task.findById(id);
    res.status(200).json({ task });
  } catch (error) {
    res.status(500).json({ message: "Error fetching task", error });
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
