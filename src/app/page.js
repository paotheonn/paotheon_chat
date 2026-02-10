"use client";

import { useState, useEffect, useCallback } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import ChatWindow from "@/components/ChatWindow";
import ChatInput from "@/components/ChatInput";

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

function loadConversations() {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem("pao_conversations") || "[]");
  } catch {
    return [];
  }
}

function saveConversations(convs) {
  localStorage.setItem("pao_conversations", JSON.stringify(convs));
}

export default function Home() {
  const [conversations, setConversations] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const saved = loadConversations();
    setConversations(saved);
    if (saved.length > 0) {
      setActiveId(saved[0].id);
      setMessages(saved[0].messages || []);
    }
  }, []);

  const saveCurrentChat = useCallback(
    (msgs, convs) => {
      if (!activeId) return convs;
      return convs.map((c) =>
        c.id === activeId ? { ...c, messages: msgs } : c
      );
    },
    [activeId]
  );

  const handleNewChat = () => {
    const updated = saveCurrentChat(messages, conversations);
    const newConv = {
      id: generateId(),
      title: "Nova conversa",
      messages: [],
      createdAt: new Date().toISOString(),
    };
    const newConvs = [newConv, ...updated];
    setConversations(newConvs);
    setActiveId(newConv.id);
    setMessages([]);
    saveConversations(newConvs);
    setSidebarOpen(false);
  };

  const handleSelectChat = (id) => {
    const updated = saveCurrentChat(messages, conversations);
    const selected = updated.find((c) => c.id === id);
    setConversations(updated);
    setActiveId(id);
    setMessages(selected?.messages || []);
    saveConversations(updated);
  };

  const handleDeleteChat = (id) => {
    const updated = conversations.filter((c) => c.id !== id);
    setConversations(updated);
    saveConversations(updated);
    if (id === activeId) {
      if (updated.length > 0) {
        setActiveId(updated[0].id);
        setMessages(updated[0].messages || []);
      } else {
        setActiveId(null);
        setMessages([]);
      }
    }
  };

  const handleSend = async (text, attachments = []) => {
    if (!text && attachments.length === 0) return;

    let currentId = activeId;
    let currentConvs = conversations;

    if (!currentId) {
      const newConv = {
        id: generateId(),
        title: text.slice(0, 40) || "Nova conversa",
        messages: [],
        createdAt: new Date().toISOString(),
      };
      currentConvs = [newConv, ...conversations];
      currentId = newConv.id;
      setConversations(currentConvs);
      setActiveId(currentId);
    }

    let userContent = text;
    if (attachments.length > 0) {
      const fileTexts = attachments
        .filter((a) => a.type === "file")
        .map((a) => {
          const base64 = a.data.split(",")[1];
          try {
            return `\n\n[Arquivo: ${a.name}]\n${atob(base64)}`;
          } catch {
            return `\n\n[Arquivo: ${a.name}] (binário, não foi possível decodificar)`;
          }
        })
        .join("");
      userContent = text + fileTexts;
    }

    const userMsg = {
      role: "user",
      content: userContent,
      timestamp: new Date().toISOString(),
      attachments: attachments.map((a) => ({
        name: a.name,
        type: a.type,
        preview: a.preview,
      })),
    };

    const aiMsg = { role: "assistant", content: "", isStreaming: true, timestamp: new Date().toISOString() };
    const newMessages = [...messages, userMsg, aiMsg];
    setMessages(newMessages);
    setIsLoading(true);

    if (messages.length === 0) {
      const title = text.slice(0, 40) + (text.length > 40 ? "..." : "");
      currentConvs = currentConvs.map((c) =>
        c.id === currentId ? { ...c, title } : c
      );
      setConversations(currentConvs);
    }

    const apiMessages = newMessages
      .filter((m) => !m.isStreaming)
      .map((m) => ({ role: m.role, content: m.content }));

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages }),
      });

      if (!res.ok) {
        throw new Error(`Erro: ${res.status}`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let rawContent = "";
      let buffer = "";
      let insideThink = false;

      function stripThink(text) {
        let result = "";
        let i = 0;
        while (i < text.length) {
          if (!insideThink) {
            const openIdx = text.indexOf("<think>", i);
            if (openIdx === -1) {
              result += text.slice(i);
              break;
            }
            result += text.slice(i, openIdx);
            insideThink = true;
            i = openIdx + 7;
          } else {
            const closeIdx = text.indexOf("</think>", i);
            if (closeIdx === -1) break;
            insideThink = false;
            i = closeIdx + 8;
          }
        }
        return result.trim();
      }

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || !trimmed.startsWith("data: ")) continue;
          const data = trimmed.slice(6);
          if (data === "[DONE]") continue;

          try {
            const parsed = JSON.parse(data);
            const delta = parsed.choices?.[0]?.delta?.content;
            if (delta) {
              rawContent += delta;
              const display = stripThink(rawContent);
              setMessages((prev) => {
                const updated = [...prev];
                updated[updated.length - 1] = {
                  role: "assistant",
                  content: display,
                  isStreaming: true,
                };
                return updated;
              });
            }
          } catch { }
        }
      }

      setMessages((prev) => {
        const updated = [...prev];
        const finalContent = stripThink(rawContent);
        updated[updated.length - 1] = {
          role: "assistant",
          content: finalContent,
          isStreaming: false,
        };

        const finalConvs = currentConvs.map((c) =>
          c.id === currentId ? { ...c, messages: updated } : c
        );
        setConversations(finalConvs);
        saveConversations(finalConvs);

        return updated;
      });
    } catch (error) {
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "assistant",
          content: `⚠️ Erro ao conectar com o Pãotheon: ${error.message}`,
          isStreaming: false,
        };
        return updated;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (text) => {
    handleSend(text);
  };

  return (
    <div className="app-layout">
      <Sidebar
        conversations={conversations}
        activeId={activeId}
        onSelect={handleSelectChat}
        onNew={handleNewChat}
        onDelete={handleDeleteChat}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="main-content">
        <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <ChatWindow
          messages={messages}
          onSuggestionClick={handleSuggestionClick}
        />
        <ChatInput onSend={handleSend} isLoading={isLoading} />
      </div>
    </div>
  );
}
