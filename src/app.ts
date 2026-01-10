import express, { Application } from "express";
import { postRouter } from "./modules/post/post.router";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import cors from "cors";
import { commentRouter } from "./modules/comment/comment.router";
import errorHandler from "./middlewares/globalErrorHandler";
import { notFound } from "./middlewares/notFound";
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express')
const app: Application = express();

app.use(
  cors({
    origin: [process.env.APP_URL || "http://localhost:4000",
       "http://localhost:5000",],
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


const swaggerSpec = swaggerJSDoc(options)

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
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *         title:
 *           type: string
 *           maxLength: 225
 *           example: "My First Blog Post"
 *         content:
 *           type: string
 *           example: "This is the content of the blog post"
 *         thumbnail:
 *           type: string
 *           nullable: true
 *           example: "https://example.com/image.jpg"
 *         isFeatured:
 *           type: boolean
 *           default: false
 *         status:
 *           $ref: '#/components/schemas/PostStatus'
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           example: ["prisma", "nodejs", "swagger"]
 *         views:
 *           type: integer
 *           default: 0
 *         authorId:
 *           type: string
 *           nullable: true
 *           example: "user_123"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2025-01-01T10:00:00.000Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2025-01-02T12:00:00.000Z"
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

app.use("/posts", postRouter);
app.use("/comments", commentRouter);

app.use(notFound)
app.use(errorHandler)

export default app;
