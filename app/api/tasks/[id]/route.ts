import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { Task } from "@/app/page";

const filePath = path.join(process.cwd(), "public", "tasks.json");

async function getTasksFromFile(): Promise<Task[]> {
    try {
        const data = await fs.readFile(filePath, "utf-8");
        return JSON.parse(data);
    } catch {
        return [];
    }
}

// GET /api/tasks/[id] — получение конкретной задачи
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const tasks = await getTasksFromFile();
        const task = tasks.find((t) => t.id === id);

        if (!task) {
            return NextResponse.json({ error: "Задача не найдена" }, { status: 404 });
        }

        return NextResponse.json(task);
    } catch (error) {
        console.error("Ошибка при получении задачи:", error);
        return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
    }
}

// PATCH /api/tasks/[id] — обновление полей задачи (статус, комментарии и т.д.)
export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const tasks = await getTasksFromFile();

        const taskIndex = tasks.findIndex((t) => t.id === id);
        if (taskIndex === -1) {
            return NextResponse.json({ error: "Задача не найдена" }, { status: 404 });
        }

        const updatedTask = { ...tasks[taskIndex], ...body };
        tasks[taskIndex] = updatedTask;

        await fs.writeFile(filePath, JSON.stringify(tasks, null, 2), "utf-8");

        return NextResponse.json(updatedTask);
    } catch (error) {
        console.error("Ошибка при обновлении задачи:", error);
        return NextResponse.json({ error: "Не удалось обновить задачу" }, { status: 500 });
    }
}