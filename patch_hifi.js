const fs = require('fs');
const file = 'src/components/canvas/ForceGraph.tsx';
let code = fs.readFileSync(file, 'utf8');

// Find the start of Hi-fi screens
const startIndex = code.indexOf('{/* 4d: Hi-fi screens — 1-col grid (Fix 5) */}');

// The section ends right before "{/* ══════════════════════════════════════════"
const endIndex = code.indexOf('{/* ══════════════════════════════════════════', startIndex);

if(startIndex > -1 && endIndex > -1) {
  let section = code.substring(startIndex, endIndex);
  
  // Wrap it
  let wrapped = `<div
              className="hifi-section-bg cs-reveal"
              style={{
                background: "#f5f0e8",
                margin: "40px -24px",
                padding: "40px 24px",
                borderTop: "0.5px solid rgba(154,175,122,0.2)",
                borderBottom: "0.5px solid rgba(154,175,122,0.2)"
              }}
            >
${section}            </div>\n\n            `;
  
  code = code.substring(0, startIndex) + wrapped + code.substring(endIndex);
  // remove the extra </div> from section if we don't need it? Wait, section was NOT closed before {hr()}
}
fs.writeFileSync(file, code);
