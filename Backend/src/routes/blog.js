import { updateBlogInput } from '@praveenbisht/medium-app';
import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { verify } from "hono/jwt";
export const blogRouter = new Hono();
blogRouter.use('/*', async (c, next) => {
    const authHeader = c.req.header("Authorization") || "";
    console.log(authHeader);
    const payload = await verify(authHeader, c.env.JWT_SECRET);
    console.log(payload);
    if (payload.id) {
        c.set('userId', payload.id);
        await next();
    }
    else {
        c.status(403);
        return c.json({
            message: "You are not logged in"
        });
    }
});
blogRouter.post('/', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env?.DATABASE_URL,
    }).$extends(withAccelerate());
    try {
        const body = await c.req.json();
        const authorId = c.get("userId");
        const blog = await prisma.post.create({
            data: {
                title: body.title,
                content: body.content,
                authorId: authorId,
            }
        });
        return c.json({
            id: blog.id,
        });
    }
    catch (e) {
        console.log(e);
        c.json({
            "e ": e,
            message: "Failed to create blog"
        });
    }
});
blogRouter.put('/', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env?.DATABASE_URL,
    }).$extends(withAccelerate());
    const body = await c.req.json();
    const { success } = updateBlogInput.safeParse(body);
    if (!success) {
        c.status(411);
        return c.json({
            message: "Id is not corrrrrect"
        });
    }
    try {
        const authorId = c.get("userId");
        // console.log(id)
        const blog = await prisma.post.update({
            where: {
                id: body.id
            },
            data: {
                title: body.title,
                content: body.content,
            }
        });
        return c.json({
            id: blog.id,
        });
    }
    catch (e) {
        e.status(403);
        return c.json({
            "msg ": "Error while updating"
        });
    }
});
blogRouter.get('/bulk', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env?.DATABASE_URL,
    }).$extends(withAccelerate());
    const blogs = await prisma.post.findMany({
        select: {
            content: true,
            title: true,
            id: true,
            author: {
                select: {
                    name: true
                }
            }
        }
    });
    return c.json({
        blogs
    });
});
blogRouter.get('/:id', async (c) => {
    const { id } = c.req.param();
    const prisma = new PrismaClient({
        datasourceUrl: c.env?.DATABASE_URL,
    }).$extends(withAccelerate());
    try {
        const blog = await prisma.post.findUnique({
            where: {
                id: Number(id)
            },
            select: {
                id: true,
                title: true,
                content: true,
                author: {
                    select: {
                        name: true
                    }
                }
            }
        });
        return c.json({
            blog,
        });
    }
    catch (e) {
        // e.status(403);
        console.log(e);
        return c.json({
            "msg ": "Error while fetching blog post"
        });
    }
});
