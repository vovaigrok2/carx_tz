import Link from "next/link";
import { notFound } from "next/navigation";
import tasksData from "../../data/tasks.json";
import { Task } from "../../page";
import styles from "./task.module.less";

interface TaskPageProps {
    params: Promise<{ id: string }>;
}

export default async function TaskDetailPage({ params }: TaskPageProps) {
    const { id } = await params;
    const tasks: Task[] = tasksData as Task[];

    const task = tasks.find((t) => t.id === id);

    if (!task) {
        notFound();
    }

    const formattedDate = new Date(task.createdAt).toLocaleDateString("ru-RU", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });

    const getStatusClass = (status: Task["status"]) => {
        switch (status) {
            case "Новая":
                return `${styles.statusBadge} ${styles.new}`;
            case "В работе":
                return `${styles.statusBadge} ${styles.inProgress}`;
            case "Выполнена":
                return `${styles.statusBadge} ${styles.completed}`;
            default:
                return styles.statusBadge;
        }
    };

    return (
        <main className={styles.container}>
            <nav className={styles.backNav}>
                <Link href="/">← Назад к списку задач</Link>
            </nav>

            <article className={styles.card}>
                <header className={styles.header}>
                    <h1 className={styles.title}>{task.title}</h1>
                    <span className={getStatusClass(task.status)}>
                        {task.status}
                    </span>
                </header>

                <dl className={styles.grid}>
                    <div className={styles.gridItem}>
                        <dt>Приоритет:</dt>
                        <dd>{task.priority}</dd>
                    </div>

                    <div className={styles.gridItem}>
                        <dt>Ответственный:</dt>
                        <dd>{task.assignee}</dd>
                    </div>

                    <div className={styles.gridItem}>
                        <dt>Дата создания:</dt>
                        <dd>{formattedDate}</dd>
                    </div>

                    <div className={styles.gridItem}>
                        <dt>Описание:</dt>
                        <dd>{task.description}</dd>
                    </div>

                    <div className={styles.gridItem}>
                        <dt>Результат:</dt>
                        <dd>{task.result || "Не указан"}</dd>
                    </div>
                </dl>

                <section className={styles.commentsSection} aria-labelledby="comments-heading">
                    <h2 id="comments-heading">Комментарии ({task.comments.length})</h2>
                    {task.comments.length === 0 ? (
                        <p style={{ color: "var(--text-secondary)" }}>Комментариев пока нет.</p>
                    ) : (
                        <ul className={styles.commentList}>
                            {task.comments.map((comment, index) => (
                                <li key={index} className={styles.commentItem}>
                                    {comment}
                                </li>
                            ))}
                        </ul>
                    )}
                </section>
            </article>
        </main>
    );
}