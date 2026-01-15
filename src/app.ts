import express, { Application } from "express";
import { postRouter } from "./modules/post/post.router";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import cors from "cors";
import { commentRouter } from "./modules/comment/comment.router";
import errorHandler from "./middlewares/globalErrorHandler";
import { notFound } from "./middlewares/notFound";
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const app: Application = express();

app.use(
  cors({
    origin: [
      process.env.APP_URL || "http://localhost:4000",
      "http://localhost:5000",
    ],
    credentials: true,
  })
);
app.use(express.json());

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Prisma Blog Project Api",
      version: "1.0.0",
    },
    servers: [{ url: "http://localhost:5000" }],
    security: [
      {
        BearerAuth: [],
      },
    ],
  },
  apis: ["./src/app.ts"],
};

const swaggerSpec = swaggerJSDoc(options);

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    swaggerOptions: {
      persistAuthorization: true,
      tryItOutEnabled: true,
    },
  })
);

/**
 * @swagger
 * /:
 *  get:
 *    summary: This api is used to check if get method is working or not
 *    description: This api is used to check if get method is working or not
 *    responses:
 *      200:
 *        description: To test Get method
 */

app.get("/", (req, res) => {
  res.send("Hello world");
});
//Post components
/**
 * @swagger
 * components:
 *   schemas:
 *     PostStatus:
 *       type: string
 *       enum:
 *         - DRAFT
 *         - PUBLISHED
 *         - ARCHIVED
 *
 *     Post:
 *       type: object
 *       required:
 *         - title
 *         - content
 *         - authorId
 *         - tags
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: string
 *         title:
 *           type: string
 *           maxLength: 225
 *           example: string
 *         content:
 *           type: string
 *           example: string
 *         thumbnail:
 *           type: string
 *           nullable: true
 *           example: string
 *         isFeatured:
 *           type: boolean
 *           default: false
 *         status:
 *           $ref: '#/components/schemas/PostStatus'
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           example: []
 *         views:
 *           type: integer
 *           default: 0
 *         authorId:
 *           type: string
 *           nullable: true
 *           example: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2025-01-01T10:00:00.000Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2025-01-02T12:00:00.000Z"
 */

// Comment Components
/**
 * @swagger
 * components:
 *   schemas:
 *     Comment:
 *       type: object
 *       required:
 *         - content
 *         - authorId
 *         - postId
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: "String"
 *         content:
 *           type: string
 *           example: "String"
 *         authorId:
 *           type: string
 *           example: "user-uuid"
 *         postId:
 *           type: string
 *           example: "post-uuid"
 *         parentId:
 *           type: string
 *           nullable: true
 *           example: "parent-comment-uuid"
 *         status:
 *           type: string
 *           enum:
 *             - APPROVED
 *             - REJECT
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2026-01-15T10:00:00.000Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2026-01-15T12:00:00.000Z"
 */


/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: Token
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *           example: Meaningful error message
 *         errors:
 *           type: array
 *           items:
 *             type: string
 *           nullable: true
 */


/**
 * @swagger
 * /api/auth/sign-up/email:
 *   post:
 *     tags: [Auth]
 *     summary: Sign up with email and password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *               image:
 *                 type: string
 *                 nullable: true
 *               phone:
 *                 type: string
 *     responses:
 *       200:
 *         description: Verification email sent
 */

/**
 * @swagger
 * /api/auth/sign-in/email:
 *   post:
 *     tags: [Auth]
 *     summary: Sign in with email and password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Signed in successfully
 */

app.all("/api/auth/*splat", toNodeHandler(auth));

// get api: "/posts/"
/**
 * @swagger
 * /posts:
 *   get:
 *     tags: [Posts]
 *     summary: Get all posts
 *     responses:
 *       200:
 *         description: List of posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 */

// post api: "/posts/"
/**
 * @swagger
 * /posts:
 *   post:
 *     tags: [Posts]
 *     summary: Create a new post
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *               - tags
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               thumbnail:
 *                 type: string
 *                 nullable: true
 *     responses:
 *       201:
 *         description: Post created successfully
 */

// get api: "/posts/:postId"
/**
 * @swagger
 * /posts/{postId}:
 *   get:
 *     tags: [Posts]
 *     summary: Get post by ID 
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Post retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       404:
 *         description: Post not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Post not found
 */

// patch api :"posts/:postId"

/**
 * @swagger
 * /posts/{postId}:
 *   patch:
 *     tags: [Posts]
 *     summary: Update a post by ID (user and admin)
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               thumbnail:
 *                 type: string
 *                 nullable: true
 *               status:
 *                 $ref: '#/components/schemas/PostStatus'
 *               isFeatured:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Post updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       400:
 *         description: Invalid request or missing postId
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

// get api :"posts/my-posts"

/**
 * @swagger
 * /posts/my-posts:
 *   get:
 *     tags: [Posts]
 *     summary: Get posts of the logged-in user (user and admin)
 *     description: Returns all posts created by the currently authenticated user.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's posts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Post'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       example: 5
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 10
 *                     totalPages:
 *                       type: integer
 *                       example: 1
 *       401:
 *         description: Unauthorized, user not logged in
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

// get api: "/posts/stats"
/**
 * @swagger
 * /posts/stats:
 *   get:
 *     tags: [Posts]
 *     summary: Get blog statistics (admin only)
 *     description: Returns counts for posts, comments, users, and total views. Only accessible by Admin users.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalPost:
 *                   type: integer
 *                   example: 50
 *                 publishedPosts:
 *                   type: integer
 *                   example: 30
 *                 draftPosts:
 *                   type: integer
 *                   example: 15
 *                 archivedPosts:
 *                   type: integer
 *                   example: 5
 *                 totalComments:
 *                   type: integer
 *                   example: 120
 *                 approvedComment:
 *                   type: integer
 *                   example: 100
 *                 rejectComment:
 *                   type: integer
 *                   example: 20
 *                 totalUsers:
 *                   type: integer
 *                   example: 10
 *                 adminCount:
 *                   type: integer
 *                   example: 2
 *                 userCount:
 *                   type: integer
 *                   example: 8
 *                 totalViews:
 *                   type: integer
 *                   example: 1500
 *       401:
 *         description: Unauthorized, user not logged in or not admin
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

// Delete api:

/**
 * @swagger
 * /posts/{postId}:
 *   delete:
 *     tags: [Posts]
 *     summary: Delete a post by ID (user or admin)
 *     description: Users can delete their own posts; admins can delete any post.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         description: ID of the post to delete
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Post deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Post deleted successfully
 *       400:
 *         description: Delete failed (e.g., not owner or invalid ID)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized (user not logged in)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

app.use("/posts", postRouter);

/**
 * @swagger
 * /comments/{commentId}:
 *   get:
 *     tags: [Comments]
 *     summary: Get a comment by ID
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Comment retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       404:
 *         description: Comment not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /comments/author/{authorId}:
 *   get:
 *     tags: [Comments]
 *     summary: Get all comments by author
 *     parameters:
 *       - in: path
 *         name: authorId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: List of comments by the author
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comment'
 *       404:
 *         description: Comments not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */


/**
 * @swagger
 * /comments:
 *   post:
 *     tags: [Comments]
 *     summary: Create a new comment
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *               - postId
 *             properties:
 *               content:
 *                 type: string
 *               postId:
 *                 type: string
 *                 format: uuid
 *               parentId:
 *                 type: string
 *                 nullable: true
 *     responses:
 *       201:
 *         description: Comment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       400:
 *         description: Comment creation failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /comments/{commentId}:
 *   delete:
 *     tags: [Comments]
 *     summary: Delete a comment
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 *       400:
 *         description: Delete failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /comments/{commentId}:
 *   patch:
 *     tags: [Comments]
 *     summary: Update a comment (user/admin)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum:
 *                   - APPROVED
 *                   - REJECT
 *     responses:
 *       200:
 *         description: Comment updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       400:
 *         description: Update failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /comments/{commentId}/moderate:
 *   patch:
 *     tags: [Comments]
 *     summary: Moderate a comment (Admin only)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum:
 *                   - APPROVED
 *                   - REJECT
 *     responses:
 *       200:
 *         description: Comment status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       400:
 *         description: Moderation failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

app.use("/comments", commentRouter);

app.use(notFound);
app.use(errorHandler);

export default app;
