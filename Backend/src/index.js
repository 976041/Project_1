import { Hono } from 'hono';
import { userRouter } from './routes/user';
import { blogRouter } from './routes/blog';
import { cors } from 'hono/cors';
// const app = new Hono()
const app = new Hono();
app.use('/api/*', cors());
app.route("/api/v1/user", userRouter);
app.route("/api/v1/blog", blogRouter);
// app.post('/api/v1/blog', (c) => {
//   return c.text('Hello Hono!')
// })
// app.put('/api/v1/blog', (c) => {
//   return c.text('Hello Hono!')
// })
// app.get('/api/v1/blog/:id', (c) => {
//   const prisma = new PrismaClient({
//     datasourceUrl: c.env.DATABASE_URL,
//   }).$extends(withAccelerate())
//   const {id} = c.req.param()
//   // console.log(id)
//   // console.log(prisma);
//   // console.log(c.get(id))
//   return c.text('Hello Hono!')
// })
// app.get('/api/v1/blog/bulk', (c) => {
//   return c.text('Hello Hono!')
// })
export default app;
