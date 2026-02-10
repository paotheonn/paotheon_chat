import styles from "./Header.module.css";

const AVATAR_URL =
    "https://ddragon.leagueoflegends.com/cdn/img/champion/tiles/Pantheon_8.jpg";

export default function Header({ onToggleSidebar }) {
    return (
        <header className={styles.header}>
            <div className={styles.left}>
                <button
                    className={styles.menuButton}
                    onClick={onToggleSidebar}
                    aria-label="Menu"
                >
                    <div className={styles.menuIcon}>
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </button>
                <div className={styles.logo}>
                    <div className={styles.logoIcon}>
                        <img src={AVATAR_URL} alt="Pãotheon" />
                    </div>
                    <span className={styles.logoText}>Pãotheon</span>
                </div>
            </div>
            <span className={styles.model}>DeepSeek R1 · 70B</span>
        </header>
    );
}
