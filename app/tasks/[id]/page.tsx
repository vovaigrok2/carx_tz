import Link from "next/link";
import { notFound } from "next/navigation";
import tasksData from "../../data/tasks.json";
import { Task } from "../../page";

interface TaskPageProps {
    params: Promise<{ id: string }>;
}

export default async function TaskDetailPage({ params }: TaskPageProps) {
    const { id } = await params;
    const tasks: Task[] = tasksData as Task[];

    // Находим задачу по id
    const task = tasks.find((t) => t.id === id);

    // Если задача не найдена, отдаем 404
    if (!task) {
        notFound();
    }

    // Форматируем дату для удобного отображения
    const formattedDate = new Date(task.createdAt).toLocaleDateString("ru-RU", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });

    return (
        <main style={{ padding: "2rem", fontFamily: "sans-serif", maxWidth: "800px" }}>
            <nav style={{ marginBottom: "1.5rem" }}>
                <Link href="/">← Назад к списку задач</Link>
            </nav>

            <article>
                <h1>{task.title}</h1>

                <dl style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: "0.75rem", margin: "1.5rem 0" }}>
                    <dt><strong>Статус:</strong></dt>
                    <dd>{task.status}</dd>

                    <dt><strong>Приоритет:</strong></dt>
                    <dd>{task.priority}</dd>

                    <dt><strong>Ответственный:</strong></dt>
                    <dd>{task.assignee}</dd>

                    <dt><strong>Дата создания:</strong></dt>
                    <dd>{formattedDate}</dd>

                    <dt><strong>Описание:</strong></dt>
                    <dd>{task.description}</dd>

                    <dt><strong>Результат:</strong></dt>
                    <dd>{task.result || "Не указан"}</dd>
                </dl>

                <section aria-labelledby="comments-heading">
                    <h2 id="comments-heading">Комментарии</h2>
                    {task.comments.length === 0 ? (
                        <p>Комментариев пока нет.</p>
                    ) : (
                        <ul>
                            {task.comments.map((comment, index) => (
                                <li key={index}>{comment}</li>
                            ))}
                        </ul>
                    )}
                </section>
            </article>
        </main>
    );
}