"use client";

import { useState, useRef, useEffect } from "react";
import styles from "./ChatInput.module.css";

export default function ChatInput({ onSend, isLoading }) {
    const [text, setText] = useState("");
    const [attachments, setAttachments] = useState([]);
    const textareaRef = useRef(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height =
                Math.min(textareaRef.current.scrollHeight, 200) + "px";
        }
    }, [text]);

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        files.forEach((file) => {
            const isImage = file.type.startsWith("image/");
            const reader = new FileReader();
            reader.onload = () => {
                setAttachments((prev) => [
                    ...prev,
                    {
                        name: file.name,
                        type: isImage ? "image" : "file",
                        data: reader.result,
                        preview: isImage ? reader.result : null,
                        mimeType: file.type,
                    },
                ]);
            };
            reader.readAsDataURL(file);
        });
        e.target.value = "";
    };

    const removeAttachment = (index) => {
        setAttachments((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSend = () => {
        if ((!text.trim() && attachments.length === 0) || isLoading) return;
        onSend(text.trim(), attachments);
        setText("");
        setAttachments([]);
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className={styles.wrapper}>
            {attachments.length > 0 && (
                <div className={styles.attachments}>
                    {attachments.map((att, i) => (
                        <div key={i} className={styles.attachmentChip}>
                            {att.type === "image" ? (
                                <img
                                    src={att.preview}
                                    alt={att.name}
                                    className={styles.attachmentPreview}
                                />
                            ) : (
                                <span>📄</span>
                            )}
                            <span>{att.name}</span>
                            <button
                                className={styles.removeAttachment}
                                onClick={() => removeAttachment(i)}
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                </div>
            )}
            <div className={styles.inputContainer}>
                <textarea
                    ref={textareaRef}
                    className={styles.textarea}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Mande uma mensagem para o Pãotheon..."
                    rows={1}
                    disabled={isLoading}
                />
                <div className={styles.actions}>
                    <button
                        className={styles.uploadBtn}
                        onClick={() => fileInputRef.current?.click()}
                        aria-label="Anexar arquivo"
                        type="button"
                    >
                        <svg viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" />
                        </svg>
                    </button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept="image/*,.pdf,.txt,.py,.js,.ts,.jsx,.tsx,.json,.csv,.md,.sql,.html,.css,.java,.c,.cpp,.go,.rs,.rb,.php,.sh,.yaml,.yml,.xml,.log"
                        onChange={handleFileChange}
                        className={styles.fileInput}
                    />
                    <button
                        className={styles.sendBtn}
                        onClick={handleSend}
                        disabled={isLoading || (!text.trim() && attachments.length === 0)}
                        aria-label="Enviar mensagem"
                        type="button"
                    >
                        <img src="/spear.svg" alt="Enviar" className={styles.sendIcon} />
                    </button>
                </div>
            </div>
            <div className={styles.hint}>
                Enter para enviar · Shift+Enter para nova linha
            </div>
        </div>
    );
}
