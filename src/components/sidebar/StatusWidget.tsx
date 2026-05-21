import { useEffect, useState } from 'react';

export default function StatusWidget() {
  const [time, setTime] = useState('');

  useEffect(() => {
    function tick() {
      const now = new Date();
      setTime(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
      );
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{ userSelect: 'none' }}>
      {/* Live clock */}
      <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', fontWeight: 400, color: '#2d4a1e', marginBottom: '4px' }}>
        {time}
      </p>

      {/* Status row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span style={{ position: 'relative', display: 'inline-flex', width: '8px', height: '8px', flexShrink: 0 }}>
          <span
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '50%',
              background: '#6b8f4e',
              opacity: 0.75,
              animation: 'ping 1.2s cubic-bezier(0,0,0.2,1) infinite',
            }}
          />
          <span
            style={{
              position: 'relative',
              display: 'inline-flex',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#6b8f4e',
            }}
          />
        </span>
        <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', fontWeight: 400, color: '#9aaf7a', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          All systems operational
        </span>
      </div>
      <style>{`
        @keyframes ping {
          75%, 100% { transform: scale(2); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
