import { useState, useRef, useEffect } from 'react';
import Head from 'next/head';

export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hey! 👋 I'm your Cash Creators AI assistant. I can help you:\n\n• **Create your Offer Doc** (Google Doc 314 style)\n• **Plan your 90 Days of Offers**\n• **Set up your Offer Shell**\n• **Build your Workshop Funnel**\n• **Write email copy & DM scripts**\n\nWhat would you like to work on today?",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const newMessages = [...messages, { role: 'user', content: text }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      const data = await res.json();

      if (data.error) {
        setMessages([...newMessages, { role: 'assistant', content: '❌ Error: ' + data.error }]);
      } else {
        setMessages([...newMessages, { role: 'assistant', content: data.message }]);
      }
    } catch (err) {
      setMessages([...newMessages, { role: 'assistant', content: '❌ Something went wrong. Please try again.' }]);
    }

    setLoading(false);
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatMessage = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br/>');
  };

  const quickPrompts = [
    '📄 Create my Offer Doc',
    '🗓️ Plan my 90 Days of Offers',
    '🐳 Help me write Whale Bait content',
    '🛠️ Set up my Offer Shell',
    '📧 Write a sales email',
    '💬 Write a DM script',
  ];

  return (
    <>
      <Head>
        <title>Cash Creators AI</title>
        <meta name="description" content="Your AI assistant for building a profitable Cash Creator business" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>💰</text></svg>" />
      </Head>

      <div style={styles.page}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerInner}>
            <span style={styles.logo}>💰</span>
            <div>
              <div style={styles.headerTitle}>Cash Creators AI</div>
              <div style={styles.headerSub}>Your offer-building assistant</div>
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div style={styles.chatArea}>
          {messages.map((msg, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start', marginBottom: 16 }}>
              {msg.role === 'assistant' && (
                <div style={styles.avatar}>💰</div>
              )}
              <div
                style={msg.role === 'user' ? styles.userBubble : styles.aiBubble}
                dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }}
              />
              {msg.role === 'user' && (
                <div style={styles.userAvatar}>👤</div>
              )}
            </div>
          ))}

          {loading && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <div style={styles.avatar}>💰</div>
              <div style={styles.aiBubble}>
                <span style={styles.typing}>●●●</span>
              </div>
            </div>
          )}

          {/* Quick prompts — show only at start */}
          {messages.length === 1 && !loading && (
            <div style={styles.quickPromptsWrap}>
              <div style={styles.quickLabel}>Quick starts:</div>
              <div style={styles.quickGrid}>
                {quickPrompts.map((p, i) => (
                  <button key={i} style={styles.quickBtn} onClick={() => { setInput(p); }}>
                    {p}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input Area */}
        <div style={styles.inputArea}>
          <div style={styles.inputWrap}>
            <textarea
              style={styles.textarea}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask me anything about your offers, funnels, emails..."
              rows={1}
              disabled={loading}
            />
            <button
              style={{ ...styles.sendBtn, opacity: loading || !input.trim() ? 0.5 : 1 }}
              onClick={sendMessage}
              disabled={loading || !input.trim()}
            >
              {loading ? '...' : '→'}
            </button>
          </div>
          <div style={styles.hint}>Press Enter to send • Shift+Enter for new line</div>
        </div>
      </div>
    </>
  );
}

const styles = {
  page: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    backgroundColor: '#0f0f0f',
    color: '#f0f0f0',
    fontFamily: "'Inter', -apple-system, sans-serif",
  },
  header: {
    backgroundColor: '#1a1a1a',
    borderBottom: '1px solid #2a2a2a',
    padding: '14px 20px',
    flexShrink: 0,
  },
  headerInner: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    maxWidth: 760,
    margin: '0 auto',
  },
  logo: {
    fontSize: 28,
  },
  headerTitle: {
    fontWeight: 700,
    fontSize: 18,
    color: '#f0f0f0',
  },
  headerSub: {
    fontSize: 12,
    color: '#888',
  },
  chatArea: {
    flex: 1,
    overflowY: 'auto',
    padding: '24px 20px',
    maxWidth: 760,
    width: '100%',
    margin: '0 auto',
    boxSizing: 'border-box',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: '50%',
    backgroundColor: '#2a2a2a',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 18,
    flexShrink: 0,
    marginRight: 10,
  },
  userAvatar: {
    width: 36,
    height: 36,
    borderRadius: '50%',
    backgroundColor: '#1e3a5f',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 18,
    flexShrink: 0,
    marginLeft: 10,
  },
  aiBubble: {
    backgroundColor: '#1e1e1e',
    border: '1px solid #2a2a2a',
    borderRadius: '0 16px 16px 16px',
    padding: '12px 16px',
    maxWidth: '80%',
    fontSize: 14,
    lineHeight: 1.6,
    color: '#e0e0e0',
  },
  userBubble: {
    backgroundColor: '#1a3a5c',
    borderRadius: '16px 0 16px 16px',
    padding: '12px 16px',
    maxWidth: '80%',
    fontSize: 14,
    lineHeight: 1.6,
    color: '#e8f4fd',
  },
  typing: {
    color: '#888',
    letterSpacing: 4,
    animation: 'pulse 1.2s infinite',
  },
  quickPromptsWrap: {
    marginTop: 8,
    marginBottom: 8,
  },
  quickLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
    marginLeft: 46,
  },
  quickGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
    marginLeft: 46,
  },
  quickBtn: {
    backgroundColor: '#1e1e1e',
    border: '1px solid #333',
    borderRadius: 20,
    padding: '8px 14px',
    color: '#ccc',
    fontSize: 13,
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  inputArea: {
    borderTop: '1px solid #2a2a2a',
    backgroundColor: '#1a1a1a',
    padding: '16px 20px',
    flexShrink: 0,
  },
  inputWrap: {
    display: 'flex',
    gap: 10,
    maxWidth: 760,
    margin: '0 auto',
    alignItems: 'flex-end',
  },
  textarea: {
    flex: 1,
    backgroundColor: '#0f0f0f',
    border: '1px solid #333',
    borderRadius: 12,
    padding: '12px 16px',
    color: '#f0f0f0',
    fontSize: 14,
    resize: 'none',
    outline: 'none',
    fontFamily: 'inherit',
    lineHeight: 1.5,
  },
  sendBtn: {
    backgroundColor: '#2563eb',
    color: 'white',
    border: 'none',
    borderRadius: 12,
    width: 44,
    height: 44,
    fontSize: 20,
    cursor: 'pointer',
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hint: {
    fontSize: 11,
    color: '#555',
    textAlign: 'center',
    marginTop: 8,
    maxWidth: 760,
    margin: '8px auto 0',
  },
};
