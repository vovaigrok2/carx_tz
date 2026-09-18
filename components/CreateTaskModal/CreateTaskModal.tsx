import { useState } from "react";
import styles from "./CreateTaskModal.module.less";

export interface NewTaskPayload {
    title: string;
    description: string;
    assignee: string;
    priority: "Низкий" | "Средний" | "Высокий";
}

interface CreateTaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (payload: NewTaskPayload) => Promise<void>;
}

export default function CreateTaskModal({ isOpen, onClose, onCreate }: CreateTaskModalProps) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [assignee, setAssignee] = useState("");
    const [priority, setPriority] = useState<"Низкий" | "Средний" | "Высокий">("Средний");
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !assignee.trim()) return;

        try {
            setIsSubmitting(true);
            await onCreate({ title, description, assignee, priority });
            setTitle("");
            setDescription("");
            setAssignee("");
            setPriority("Средний");
            onClose();
        } catch (err) {
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={styles.modalOverlay} role="dialog" aria-modal="true" aria-labelledby="modal-title">
            <div className={styles.modalContent}>
                <h2 id="modal-title">Новая задача</h2>
                <form onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label htmlFor="task-title">Название *</label>
                        <input
                            id="task-title"
                            type="text"
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="task-assignee">Исполнитель *</label>
                        <input
                            id="task-assignee"
                            type="text"
                            required
                            value={assignee}
                            onChange={(e) => setAssignee(e.target.value)}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="task-priority">Приоритет</label>
                        <select
                            id="task-priority"
                            value={priority}
                            onChange={(e) => setPriority(e.target.value as "Низкий" | "Средний" | "Высокий")}
                        >
                            <option value="Низкий">Низкий</option>
                            <option value="Средний">Средний</option>
                            <option value="Высокий">Высокий</option>
                        </select>
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="task-desc">Описание</label>
                        <textarea
                            id="task-desc"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    <div className={styles.formActions}>
                        <button
                            type="button"
                            className={styles.cancelBtn}
                            onClick={onClose}
                            disabled={isSubmitting}
                        >
                            Отмена
                        </button>
                        <button
                            type="submit"
                            className={styles.submitBtn}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Сохранение..." : "Создать"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}