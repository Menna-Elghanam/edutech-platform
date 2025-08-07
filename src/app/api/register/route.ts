import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists)
    return new Response("User already exists", { status: 400 });

  const hashed = await hash(password, 10);

  const user = await prisma.user.create({
    data: { email, password: hashed },
  });

  return Response.json(user);
}
