import express, { Router } from "express";
import { PostController } from "./post.controller";

import auth, { UserRole } from "../../middlewares/auth";

const router = express.Router();

router.get("/", PostController.getAllPost); //done

router.get("/stats", auth(UserRole.ADMIN), PostController.getStats);

router.get("/my-posts", auth(UserRole.USER, UserRole.ADMIN), PostController.getMyPosts); //done

router.get("/:postId", PostController.getPostById); //done

router.post("/", auth(UserRole.USER, UserRole.ADMIN), PostController.createPost); //Done

router.patch("/:postId", auth(UserRole.USER, UserRole.ADMIN), PostController.updatePost); //done


router.delete("/:postId", auth(UserRole.USER, UserRole.ADMIN), PostController.deletePost);


export const postRouter: Router = router;
