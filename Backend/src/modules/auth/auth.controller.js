import { loginAdmin } from "./auth.service.js";

export const login = async (req, res) => {
  try {
    const result = await loginAdmin(req.body);

    res.json(result);
  } catch (error) {
    res.status(401).json({
      message: error.message,
    });
  }
};