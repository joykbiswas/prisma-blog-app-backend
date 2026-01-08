// import { SortOrder } from './../../../generated/prisma/internal/prismaNamespaceBrowser';
import { Request, Response } from "express";
import { postService } from "./post.service";
import { PostStatus } from "../../../generated/prisma/enums";
import paginationSortingHelper from "../../helpers/paginationSortingHelper";

const createPost = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(400).json({
        error: "Unauthorized",
      });
    }

    const result = await postService.createPost(req.body, user.id as string);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({
      error: "Post create failed",
      details: err,
    });
  }
};

const getAllPost = async (req: Request, res: Response) => {
  try {
    const { search } = req.query;
    const searchString = typeof search === "string" ? search : undefined;
    const tags = req.query.tags ? (req.query.tags as string).split(",") : [];

    const isFeatured = req.query.isFeatured
      ? req.query.isFeatured === "true"
        ? true
        : req.query.isFeatured === "false"
        ? false
        : undefined
      : undefined;

    const status = req.query.status as PostStatus | undefined;

    const authorId = req.query.authorId as string | undefined;

    // const page = Number(req.query.page ?? 1);
    // const limit = Number(req.query.limit ?? 10)

    // const skip = (page-1) * limit

    // const sortBy = req.query.sortBy as string | undefined
    // const sortOrder = req.query.sortOrder as string | undefined

    const { page, limit, skip, sortBy, sortOrder } = paginationSortingHelper(
      req.query
    );

    const result = await postService.getAllPost({
      search: searchString,
      tags,
      isFeatured,
      status,
      authorId,
      page,
      limit,
      skip,
      sortBy,
      sortOrder,
    });
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({
      error: "Post create failed",
      details: err,
    });
  }
};

const getPostById = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;
    console.log({ postId });
    if (!postId) {
      throw new Error("Post Id is required");
    }
    const result = await postService.getPostById(postId);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({
      error: "Post found failed",
      details: err,
    });
  }
};

const getMyPosts = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    if (!user) {
      throw new Error("You are unauthorized !");
    }
    const result = await postService.getMyPosts(user.id as string);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({
      error: "Post Fetched failed",
      details: err,
    });
  }
};

const updatePost = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    if (!user) {
      throw new Error("You are unauthorized !");
    }
    const { postId } = req.params;
    const result = await postService.updatePost(
      postId as string,
      req.body,
      user.id
    );
    res.status(200).json(result);
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Post Update failed";
    res.status(400).json({
      error: errorMessage,
      details: err,
    });
  }
};

export const PostController = {
  createPost,
  getAllPost,
  getPostById,
  getMyPosts,
  updatePost
};
