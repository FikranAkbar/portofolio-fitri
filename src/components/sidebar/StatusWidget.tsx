import { useEffect, useState } from "react";

export default function StatusWidget() {
  const [time, setTime] = useState("");

  useEffect(() => {
    function tick() {
      const now = new Date();
      const h = now.getHours();
      const m = String(now.getMinutes()).padStart(2, "0");
      const s = String(now.getSeconds()).padStart(2, "0");
      const ampm = h >= 12 ? "PM" : "AM";
      const hh = String(h % 12 || 12).padStart(2, "0");
      setTime(`${hh}:${m}:${s} ${ampm}`);
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="select-none">
      <p className="sidebar-clock">{time}</p>
      <div className="sidebar-status-row">
        <span className="sidebar-status-dot" />
        <span className="sidebar-status-text">All systems operational</span>
      </div>
    </div>
  );
}
