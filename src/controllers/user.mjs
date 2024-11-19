import User from "../models/user.mjs";

export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: "Error fetching user", error });
  }
};
