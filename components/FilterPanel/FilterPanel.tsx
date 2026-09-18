import styles from "./FilterPanel.module.less";

interface FilterPanelProps {
    searchQuery: string;
    onSearchChange: (val: string) => void;
    statusFilter: string;
    onStatusChange: (val: string) => void;
    sortOrder: "newest" | "oldest";
    onSortChange: (val: "newest" | "oldest") => void;
    disabled?: boolean;
}

export default function FilterPanel({
    searchQuery,
    onSearchChange,
    statusFilter,
    onStatusChange,
    sortOrder,
    onSortChange,
    disabled = false,
}: FilterPanelProps) {
    return (
        <section className={styles.controls} aria-label="Фильтры и поиск">
            <div className={styles.filterGroup}>
                <label htmlFor="search-input">Поиск по названию:</label>
                <input
                    id="search-input"
                    type="text"
                    placeholder="Введите название..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    disabled={disabled}
                />
            </div>

            <div className={styles.filterGroup}>
                <label htmlFor="status-select">Статус:</label>
                <select
                    id="status-select"
                    value={statusFilter}
                    onChange={(e) => onStatusChange(e.target.value)}
                    disabled={disabled}
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
                    onChange={(e) => onSortChange(e.target.value as "newest" | "oldest")}
                    disabled={disabled}
                >
                    <option value="newest">Сначала новые</option>
                    <option value="oldest">Сначала старые</option>
                </select>
            </div>
        </section>
    );
}