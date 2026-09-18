'use client';

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { Task } from "@/app/page";
import styles from "./task.module.less";

interface TaskPageProps {
    params: Promise<{ id: string }>;
}

export default function TaskPage({ params }: TaskPageProps) {
    const { id } = use(params);

    const [task, setTask] = useState<Task | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Состояние для нового комментария
    const [commentText, setCommentText] = useState("");
    const [isUpdating, setIsUpdating] = useState(false);

    // Загрузка задачи
    useEffect(() => {
        const fetchTask = async () => {
            try {
                setIsLoading(true);
                setError(null);

                const response = await fetch(`/api/tasks/${id}`);
                if (!response.ok) {
                    if (response.status === 404) {
                        throw new Error("Задача не найдена");
                    }
                    throw new Error("Ошибка при загрузке задачи");
                }

                const data = await response.json();
                setTask(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Неизвестная ошибка");
            } finally {
                setIsLoading(false);
            }
        };

        fetchTask();
    }, [id]);

    // Обновление статуса задачи
    const handleStatusChange = async (newStatus: Task["status"]) => {
        if (!task || isUpdating) return;

        try {
            setIsUpdating(true);
            const response = await fetch(`/api/tasks/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });

            if (!response.ok) throw new Error("Не удалось обновить статус");

            const updated = await response.json();
            setTask(updated);
        } catch (err) {
            alert("Ошибка при изменении статуса");
        } finally {
            setIsUpdating(false);
        }
    };

    // Добавление нового комментария
    const handleAddComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!task || !commentText.trim() || isUpdating) return;

        try {
            setIsUpdating(true);
            const updatedComments = [...(task.comments || []), commentText.trim()];

            const response = await fetch(`/api/tasks/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ comments: updatedComments }),
            });

            if (!response.ok) throw new Error("Не удалось добавить комментарий");

            const updated = await response.json();
            setTask(updated);
            setCommentText("");
        } catch (err) {
            alert("Ошибка при добавлении комментария");
        } finally {
            setIsUpdating(false);
        }
    };

    const getStatusClass = (status: Task["status"]) => {
        switch (status) {
            case "Новая": return `${styles.statusBadge} ${styles.new}`;
            case "В работе": return `${styles.statusBadge} ${styles.inProgress}`;
            case "Выполнена": return `${styles.statusBadge} ${styles.completed}`;
            default: return styles.statusBadge;
        }
    };

    if (isLoading) {
        return (
            <main className={styles.container}>
                <p className={styles.loadingMessage}>Загрузка информации о задаче...</p>
            </main>
        );
    }

    if (error || !task) {
        return (
            <main className={styles.container}>
                <div className={styles.errorBox}>
                    <h2>{error || "Задача не найдена"}</h2>
                    <Link href="/" className={styles.backLink}>
                        ← Вернуться к списку
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className={styles.container}>
            <nav className={styles.navigation} aria-label="Навигация">
                <Link href="/" className={styles.backLink}>
                    ← Вернуться к списку задач
                </Link>
            </nav>

            <article className={styles.taskDetail}>
                <header className={styles.header}>
                    <h1 className={styles.title}>{task.title}</h1>
                    <div className={styles.statusControl}>
                        <label htmlFor="status-change">Статус:</label>
                        <select
                            id="status-change"
                            value={task.status}
                            onChange={(e) => handleStatusChange(e.target.value as Task["status"])}
                            disabled={isUpdating}
                            className={getStatusClass(task.status)}
                        >
                            <option value="Новая">Новая</option>
                            <option value="В работе">В работе</option>
                            <option value="Выполнена">Выполнена</option>
                        </select>
                    </div>
                </header>

                <dl className={styles.metaGrid}>
                    <div className={styles.metaItem}>
                        <dt>Исполнитель:</dt>
                        <dd>{task.assignee}</dd>
                    </div>
                    <div className={styles.metaItem}>
                        <dt>Приоритет:</dt>
                        <dd><strong>{task.priority}</strong></dd>
                    </div>
                    <div className={styles.metaItem}>
                        <dt>Дата создания:</dt>
                        <dd>{new Date(task.createdAt).toLocaleString("ru-RU")}</dd>
                    </div>
                </dl>

                <section className={styles.section}>
                    <h2>Описание</h2>
                    <p className={styles.description}>
                        {task.description || "Описание отсутствует."}
                    </p>
                </section>

                {task.result && (
                    <section className={styles.section}>
                        <h2>Результат выполнения</h2>
                        <p className={styles.resultText}>{task.result}</p>
                    </section>
                )}

                <section className={styles.section}>
                    <h2>Комментарии ({task.comments?.length || 0})</h2>

                    {task.comments && task.comments.length > 0 ? (
                        <ul className={styles.commentList}>
                            {task.comments.map((comment, index) => (
                                <li key={index} className={styles.commentItem}>
                                    {comment}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className={styles.noComments}>Комментариев пока нет.</p>
                    )}

                    <form onSubmit={handleAddComment} className={styles.commentForm}>
                        <label htmlFor="new-comment" className={styles.srOnly}>
                            Добавить комментарий
                        </label>
                        <textarea
                            id="new-comment"
                            placeholder="Напишите комментарий..."
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            disabled={isUpdating}
                        />
                        <button
                            type="submit"
                            disabled={isUpdating || !commentText.trim()}
                            className={styles.sendBtn}
                        >
                            Отправить
                        </button>
                    </form>
                </section>
            </article>
        </main>
    );
}