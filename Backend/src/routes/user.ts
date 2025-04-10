import { signinInput, signupInput } from '@praveenbisht/medium-app'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono"
import { sign } from "hono/jwt";



export const userRouter = new Hono<{
	Bindings: {
		DATABASE_URL: string
    JWT_SECRET : string
	},
  variables : {
    id : number
  }
}>()


userRouter.post('/signup', async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  console.log(prisma.$accelerate)

  const body = await c.req.json();
  const {success} = signupInput.safeParse(body);

  console.log(success)
  if (!success) {
    // c.status(411);
    return c.json({
      message : "Inputs not correct"
    })
  }
  
    const user = await prisma.user.create({
      data: {
        username: body.username,
        password: body.password,
        name : body.name
      }
    });

    console.log(user.id);
    console.log(user.username);
    const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);
    return c.json({ jwt });
  })


userRouter.post('/signin',  async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())


  const body = await c.req.json()
  //validation
  const {success} = signinInput.safeParse(body);
  console.log(success);
  if (!success) {
    // c.status(411);
    return c.json({
      message : "Inputs not correct"
    })
  }
  const user = await prisma.user.findUnique({
    where : {
      username : body.username
    }
  })

  if(!user){
    c.status(403);
    return c.json({error: 'user not found'});
  }
  const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);
  return c.json({ 
    "msg" : "user find it",
    "jwt" : jwt });

  // return c.text('Hello Hono!')
})