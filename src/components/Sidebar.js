"use client";

import styles from "./Sidebar.module.css";

export default function Sidebar({
    conversations,
    activeId,
    onSelect,
    onNew,
    onDelete,
    isOpen,
    onClose,
}) {
    return (
        <>
            {isOpen && <div className={styles.overlay} onClick={onClose} />}
            <aside
                className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ""}`}
            >
                <div className={styles.header}>
                    <button className={styles.newChat} onClick={onNew}>
                        <span className={styles.newChatIcon}>+</span>
                        Nova Conversa
                    </button>
                </div>
                <div className={styles.list}>
                    {conversations.length > 0 ? (
                        <>
                            <div className={styles.listLabel}>Conversas</div>
                            {conversations.map((conv) => (
                                <div
                                    key={conv.id}
                                    className={`${styles.chatItem} ${conv.id === activeId ? styles.chatItemActive : ""
                                        }`}
                                    onClick={() => {
                                        onSelect(conv.id);
                                        onClose();
                                    }}
                                >
                                    <span className={styles.chatTitle}>{conv.title}</span>
                                    <button
                                        className={styles.deleteBtn}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onDelete(conv.id);
                                        }}
                                        aria-label="Deletar conversa"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </>
                    ) : (
                        <div className={styles.empty}>
                            <div className={styles.emptyIcon}>🍞</div>
                            Nenhuma conversa ainda.
                            <br />
                            Comece uma nova!
                        </div>
                    )}
                </div>
            </aside>
        </>
    );
}
