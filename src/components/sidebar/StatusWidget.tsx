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
    <div
      className="rounded-xl px-4 pt-3 pb-5 font-mono text-xs leading-relaxed select-none"
      style={{ background: '#EEEADE', color: '#6B6560' }}
    >
      {/* Live clock */}
      <p className="text-sm font-medium tracking-tight" style={{ color: '#4A453F' }}>
        {time}
      </p>

      {/* Status row */}
      <div className="flex items-center gap-1.5 mt-1">
        {/* Green pulse dot */}
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
        <span className="uppercase tracking-widest text-[10px]" style={{ color: '#6B6560' }}>
          All Systems Operational
        </span>
      </div>
    </div>
  );
}

