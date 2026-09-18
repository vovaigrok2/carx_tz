import styles from "./StatusBadge.module.less";

interface StatusBadgeProps {
    status: "Новая" | "В\u00A0работе" | "Выполнена" | string;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
    let statusClass = styles.new;

    if (status === "В работе") {
        statusClass = styles.inProgress;
    } else if (status === "Выполнена") {
        statusClass = styles.completed;
    }

    return (
        <span className={`${styles.badge} ${statusClass}`}>
            {status}
        </span>
    );
}