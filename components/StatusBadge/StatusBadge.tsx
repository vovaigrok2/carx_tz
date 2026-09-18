import styles from "./StatusBadge.module.less";

export type TaskStatus = "Новая" | "В работе" | "Выполнена";

interface StatusBadgeProps {
    status: TaskStatus;
    className?: string;
}

export default function StatusBadge({ status, className = "" }: StatusBadgeProps) {
    const getStatusClass = (s: TaskStatus) => {
        switch (s) {
            case "Новая": return styles.new;
            case "В работе": return styles.inProgress;
            case "Выполнена": return styles.completed;
            default: return "";
        }
    };

    return (
        <span className={`${styles.statusBadge} ${getStatusClass(status)} ${className}`}>
            {status}
        </span>
    );
}