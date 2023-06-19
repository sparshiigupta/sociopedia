import express from "express";
import { getFeedPosts, getUserPosts, likePost } from "../controllers/posts.js";
import { verifyUser } from "../middleware/auth.js";

const router = express.Router();

/* READ */
router.get("/", verifyUser, getFeedPosts);
router.get("/:userId/posts", verifyUser, getUserPosts);

/* UPDATE */
router.patch("/:id/like", verifyUser, likePost);

export default router;
