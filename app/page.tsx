'use client';

import { useState, useMemo, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
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

// Выносим основную логику в отдельный компонент
function TasksContent() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Состояния данных и UI
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Состояния фильтров — берем начальные значения из URL параметров
    const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
    const [statusFilter, setStatusFilter] = useState(searchParams.get("status") || "Все");
    const [sortOrder, setSortOrder] = useState<"newest" | "oldest">(
        (searchParams.get("sort") as "newest" | "oldest") || "newest"
    );

    // Загрузка данных при монтировании
    useEffect(() => {
        const loadScheduleData = async () => {
            try {
                setIsLoading(true);
                setError(null);

                const response = await fetch('/tasks.json');

                if (!response.ok) {
                    throw new Error(`Ошибка HTTP: ${response.status}`);
                }

                const data = await response.json();
                setTasks(data);
            } catch (err) {
                console.error('Ошибка загрузки данных:', err);
                setError('Не удалось загрузить список задач. Пожалуйста, попробуйте позже.');
            } finally {
                setIsLoading(false);
            }
        };

        loadScheduleData();
    }, []);

    // Синхронизация фильтров с URL
    useEffect(() => {
        const params = new URLSearchParams();

        // Добавляем параметры только если они отличаются от значений по умолчанию
        if (searchQuery) params.set("q", searchQuery);
        if (statusFilter !== "Все") params.set("status", statusFilter);
        if (sortOrder !== "newest") params.set("sort", sortOrder);

        const query = params.toString();
        const newUrl = query ? `${pathname}?${query}` : pathname;

        // Используем replace, чтобы не засорять историю браузера на каждый чих
        // { scroll: false } предотвращает прыжок страницы наверх при обновлении URL
        router.replace(newUrl, { scroll: false });
    }, [searchQuery, statusFilter, sortOrder, pathname, router]);

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
                        disabled={isLoading || !!error}
                    />
                </div>

                <div className={styles.filterGroup}>
                    <label htmlFor="status-select">Статус:</label>
                    <select
                        id="status-select"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        disabled={isLoading || !!error}
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
                        disabled={isLoading || !!error}
                    >
                        <option value="newest">Сначала новые</option>
                        <option value="oldest">Сначала старые</option>
                    </select>
                </div>
            </section>

            <section aria-label="Список задач">
                {isLoading ? (
                    <p className={styles.loadingMessage}>Загрузка задач...</p>
                ) : error ? (
                    <p className={styles.errorMessage}>{error}</p>
                ) : filteredAndSortedTasks.length === 0 ? (
                    <p>Задачи не найдены.</p>
                ) : (
                    <ul className={styles.taskList}>
                        {filteredAndSortedTasks.map((task) => (
                            <li key={task.id} className={styles.taskCard}>
                                <div className={styles.taskHeader}>
                                    <Link href={`/tasks/${task.id}`} className={styles.taskTitle}>
                                        {task.title}
                                    </Link>
                                    <span className={getStatusClass(task.status)}>
                                        {task.status}
                                    </span>
                                </div>
                                <div className={styles.taskMeta}>
                                    <span>Приоритет: <strong>{task.priority}</strong></span>
                                    <span>•</span>
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

// Экспортируем страницу, обернутую в Suspense
export default function HomePage() {
    return (
        <Suspense fallback={<div style={{ textAlign: 'center', padding: '2rem' }}>Загрузка интерфейса...</div>}>
            <TasksContent />
        </Suspense>
    );
}