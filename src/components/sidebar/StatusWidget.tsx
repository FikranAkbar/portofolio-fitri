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
    <div className="select-none font-mono">
      {/* Live clock — 16px */}
      <p className="font-medium tracking-tight" style={{ fontSize: '16px', color: '#000000' }}>
        {time}
      </p>

      {/* Status row — 14px */}
      <div className="flex items-center gap-1.5 mt-1">
        <span className="relative inline-flex h-2 w-2">
          <span
            className="absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping"
            style={{ background: '#4CAF50' }}
          />
          <span
            className="relative inline-flex h-2 w-2 rounded-full"
            style={{ background: '#4CAF50' }}
          />
        </span>
        <span className="uppercase tracking-widest" style={{ fontSize: '14px', color: '#6D6D6D' }}>
          All Systems Operational
        </span>
      </div>
    </div>
  );
}
