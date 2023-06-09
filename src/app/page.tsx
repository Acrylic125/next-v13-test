import prisma from "@/utils/db";
import { revalidatePath } from "next/cache";
import Image from "next/image";
import { z } from "zod";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";

async function getData() {
  const todos = prisma.todo.findMany({});
  return todos;
}

async function TestComponent({ test }: { test: string }) {
  return <div>{test}</div>;
}

const crateTodoSchema = z.object({
  title: z.string(),
});

export default async function Home() {
  const data = await getData();

  async function createTodo(data: FormData) {
    "use server";

    console.log(data.get("title"));
    const todo = crateTodoSchema.parse({
      title: data.get("title"),
    });

    await prisma.todo.create({
      data: todo,
    });
    console.log(todo);
    revalidatePath("/");
  }

  return (
    <main>
      <h1>Todos</h1>
      <Alert>
        <AlertTitle>Heads up!</AlertTitle>
        <AlertDescription>You can add components to your app using the cli.</AlertDescription>
      </Alert>
      <form action={createTodo}>
        <input type="text" name="title" className="text-black" />
        <button type="submit">Add Todo</button>
      </form>
      {data.map((todo) => (
        <div key={todo.id}>
          <p>{todo.title}</p>
        </div>
      ))}
      {/* @ts-expect-error Async Server Component */}
      <TestComponent test="lol" />
    </main>
  );
}
