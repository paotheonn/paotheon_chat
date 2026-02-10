"use client";

import { useState, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import styles from "./ChatMessage.module.css";

const AVATAR_URL =
    "https://ddragon.leagueoflegends.com/cdn/img/champion/tiles/Pantheon_8.jpg";

function CodeBlock({ language, children }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(children);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className={styles.codeBlock}>
            <div className={styles.codeHeader}>
                <span className={styles.codeLang}>{language || "text"}</span>
                <button
                    className={`${styles.copyBtn} ${copied ? styles.copied : ""}`}
                    onClick={handleCopy}
                >
                    {copied ? "✓ Copiado" : "Copiar"}
                </button>
            </div>
            <div className={styles.codeContent}>
                <SyntaxHighlighter
                    style={oneDark}
                    language={language || "text"}
                    showLineNumbers
                    wrapLongLines
                    customStyle={{
                        margin: 0,
                        padding: "14px",
                        background: "transparent",
                        fontSize: "13px",
                    }}
                >
                    {children}
                </SyntaxHighlighter>
            </div>
        </div>
    );
}

function stripThinkingBlocks(content) {
    return content.replace(/<think>[\s\S]*?<\/think>/g, "").trim();
}

export default function ChatMessage({ message }) {
    const isUser = message.role === "user";

    const cleanContent = useMemo(
        () => (isUser ? message.content : stripThinkingBlocks(message.content)),
        [message.content, isUser]
    );

    const markdownComponents = {
        code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            if (!inline && match) {
                return (
                    <CodeBlock language={match[1]}>
                        {String(children).replace(/\n$/, "")}
                    </CodeBlock>
                );
            }
            if (!inline) {
                return (
                    <CodeBlock language="text">
                        {String(children).replace(/\n$/, "")}
                    </CodeBlock>
                );
            }
            return (
                <code className={styles.inlineCode} {...props}>
                    {children}
                </code>
            );
        },
    };

    const time = message.timestamp
        ? new Date(message.timestamp).toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
        })
        : null;

    return (
        <div
            className={`${styles.messageRow} ${isUser ? styles.messageRowUser : styles.messageRowAi
                }`}
        >
            {!isUser && (
                <div className={`${styles.avatar} ${styles.avatarAi}`}>
                    <img src={AVATAR_URL} alt="Pãotheon" />
                </div>
            )}
            <div
                className={`${styles.bubble} ${isUser ? styles.bubbleUser : styles.bubbleAi
                    }`}
            >
                <div className={styles.content}>
                    {message.attachments?.map((att, i) => (
                        <div key={i}>
                            {att.type === "image" ? (
                                <img
                                    src={att.preview}
                                    alt={att.name}
                                    className={styles.imagePreview}
                                />
                            ) : (
                                <div className={styles.fileAttachment}>
                                    <span className={styles.fileIcon}>📄</span>
                                    {att.name}
                                </div>
                            )}
                        </div>
                    ))}
                    {isUser ? (
                        <p style={{ whiteSpace: "pre-wrap" }}>{message.content}</p>
                    ) : message.isStreaming && !cleanContent ? (
                        <div className={styles.typing}>
                            <span className={styles.typingDot}></span>
                            <span className={styles.typingDot}></span>
                            <span className={styles.typingDot}></span>
                        </div>
                    ) : (
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={markdownComponents}
                        >
                            {cleanContent}
                        </ReactMarkdown>
                    )}
                </div>
                {time && <div className={styles.timestamp}>{time}</div>}
            </div>
            {isUser && (
                <div className={`${styles.avatar} ${styles.avatarUser}`}>
                    <svg viewBox="0 0 24 24" fill="white" width="18" height="18">
                        <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                    </svg>
                </div>
            )}
        </div>
    );
}
