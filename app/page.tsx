'use client';

import { useState, useMemo } from "react";
import Link from "next/link";
import initialTasks from "./data/tasks.json";
import styles from "./page.module.less";

export interface Task {
    id: string;
    title: string;
    description: string;
    assignee: string;
    status: "Новая" | "В работе" | "Выполнена";
    result: string;
    priority: "Низкий" | "Средний" | "Высокий";
    createdAt: string;
    comments: string[];
}

export default function HomePage() {
    const [tasks] = useState<Task[]>(initialTasks as Task[]);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("Все");
    const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

    const filteredAndSortedTasks = useMemo(() => {
        return tasks
            .filter((task) =>
                task.title.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .filter((task) => {
                if (statusFilter === "Все") return true;
                return task.status === statusFilter;
            })
            .sort((a, b) => {
                const dateA = new Date(a.createdAt).getTime();
                const dateB = new Date(b.createdAt).getTime();
                return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
            });
    }, [tasks, searchQuery, statusFilter, sortOrder]);

    return (
        <main className={styles.container}>
            <h1 className={styles.title}>Список задач</h1>

            <section className={styles.controls} aria-label="Фильтры и поиск">
                <div className={styles.filterGroup}>
                    <label htmlFor="search-input">Поиск по названию:</label>
                    <input
                        id="search-input"
                        type="text"
                        placeholder="Введите название..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className={styles.filterGroup}>
                    <label htmlFor="status-select">Статус:</label>
                    <select
                        id="status-select"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="Все">Все статусы</option>
                        <option value="Новая">Новая</option>
                        <option value="В работе">В работе</option>
                        <option value="Выполнена">Выполнена</option>
                    </select>
                </div>

                <div className={styles.filterGroup}>
                    <label htmlFor="sort-select">Сортировка по дате:</label>
                    <select
                        id="sort-select"
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value as "newest" | "oldest")}
                    >
                        <option value="newest">Сначала новые</option>
                        <option value="oldest">Сначала старые</option>
                    </select>
                </div>
            </section>

            <section aria-label="Список задач">
                {filteredAndSortedTasks.length === 0 ? (
                    <p>Задачи не найдены.</p>
                ) : (
                    <ul className={styles.taskList}>
                        {filteredAndSortedTasks.map((task) => (
                            <li key={task.id} className={styles.taskCard}>
                                <div className={styles.taskHeader}>
                                    <Link href={`/tasks/${task.id}`} className={styles.taskTitle}>
                                        {task.title}
                                    </Link>
                                </div>
                                <div className={styles.taskMeta}>
                                    <span>Статус: <strong className={styles.status}>{task.status}</strong></span>
                                    <span>Приоритет: {task.priority}</span>
                                    <span>Дата: {new Date(task.createdAt).toLocaleDateString("ru-RU")}</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </main>
    );
}