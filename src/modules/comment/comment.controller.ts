import { Request, Response } from "express";
import { commentService } from "./comment.service";

const createComment = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    req.body.authorId = user?.id
    const result = await commentService.createComment(req.body)
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({
      error: "Comment create failed",
      details: err,
    });
  }
};

const getCommentById = async (req: Request, res: Response) => {
  try {
    const {commentId} = req.params;
    const result = await commentService.getCommentById(commentId as string)
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({
      error: "Comment fetched failed",
      details: err,
    });
  }
};

const getCommentByAuthorId = async (req: Request, res: Response) => {
  try {
    const {authorId} = req.params;
    const result = await commentService.getCommentsByAuthor(authorId as string)
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({
      error: "Comment fetched failed",
      details: err,
    });
  }
};

const deleteComment = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const {commentId} = req.params
    const result = await commentService.deleteComment(commentId as string, user?.id as string)
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({
      error: "Comment fetched failed",
      details: err,
    });
  }
};

const updateComment = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const {commentId} = req.params
    const result = await commentService.updateComment(commentId as string,req.body, user?.id as string)
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({
      error: "Comment Update failed",
      details: err,
    });
  }
};


const moderateComment = async (req: Request, res: Response) => {
  try {
   const {commentId} = req.params;
    const result = await commentService.moderateComment(commentId as string, req.body)
    res.status(200).json(result);
  } catch (err) {
    const errorMessage = (err instanceof Error) ? err.message : "Comment Update failed"
    res.status(400).json({
      error: errorMessage ,
      details: err,
    });
  }
};

export const commentController= {
    createComment,
    getCommentById,
    getCommentByAuthorId,
    deleteComment,
    updateComment,
    moderateComment,
}