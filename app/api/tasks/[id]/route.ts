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

// GET /api/tasks/[id]
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
        return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
    }
}

// PATCH /api/tasks/[id]
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
        return NextResponse.json({ error: "Не удалось обновить задачу" }, { status: 500 });
    }
}

// DELETE /api/tasks/[id] — удаление задачи
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const tasks = await getTasksFromFile();
        const filteredTasks = tasks.filter((t) => t.id !== id);

        if (tasks.length === filteredTasks.length) {
            return NextResponse.json({ error: "Задача не найдена" }, { status: 404 });
        }

        await fs.writeFile(filePath, JSON.stringify(filteredTasks, null, 2), "utf-8");

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Не удалось удалить задачу" }, { status: 500 });
    }
}