import express from "express";
import { verifyUser } from "../middleware/auth.js";
import {
  getUser,
  getUserFriends,
  addRemoveFriend,
} from "../controllers/users.js";

const router = express.Router();

/*READ*/
router.use("/:id", verifyUser, getUser);
router.use("/:id/friends", verifyUser, getUserFriends);

/*UPDATE*/
router.use("/:id/:friendId", verifyUser, addRemoveFriend);

export default router;
