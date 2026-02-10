"use client";

import { useEffect, useRef } from "react";
import ChatMessage from "./ChatMessage";
import styles from "./ChatWindow.module.css";

const AVATAR_URL =
    "https://ddragon.leagueoflegends.com/cdn/img/champion/tiles/Pantheon_8.jpg";

const SUGGESTIONS = [
    "Me explique como funciona o Apache Spark",
    "Escreva um código Python de web scraping",
    "Qual a diferença entre SQL e NoSQL?",
    "Me ajude a otimizar essa query SQL",
];

export default function ChatWindow({ messages, onSuggestionClick }) {
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    if (messages.length === 0) {
        return (
            <div className={styles.window}>
                <div className={styles.empty}>
                    <div className={styles.emptyLogo}>
                        <img src={AVATAR_URL} alt="Pãotheon" />
                    </div>
                    <h1 className={styles.emptyTitle}>Olá! Eu sou o Pãotheon</h1>
                    <p className={styles.emptySubtitle}>
                        Seu assistente de IA. Pergunte qualquer coisa — de código a
                        conceitos técnicos, estou aqui para ajudar.
                    </p>
                    <div className={styles.suggestions}>
                        {SUGGESTIONS.map((s, i) => (
                            <button
                                key={i}
                                className={styles.suggestion}
                                onClick={() => onSuggestionClick(s)}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.window}>
            {messages.map((msg, i) => (
                <ChatMessage key={i} message={msg} />
            ))}
            <div ref={bottomRef} />
        </div>
    );
}
