const fs = require('fs');
const file = 'src/components/canvas/ForceGraph.tsx';
let code = fs.readFileSync(file, 'utf8');

// FIX 1: Title and Subtitle
code = code.replace(
  />\s*Fishdoro\s*<\/h1>/,
  '>\n              Designing a Gamified Pomodoro Timer: Can Focus Feel Like Play?\n            </h1>'
);
code = code.replace(
  /A cozy Pomodoro timer disguised as a fishing game\. Complete a\s*focus session\. Catch a fish\. That’s it\./,
  'A personal exploration of gamification, emotional rewards, and what makes people actually stick with a productivity tool.'
);

// Remove duplicate heading in hi-fi:
code = code.replace(
  /\{\/\* 4d: Hi-fi screens \*\/\}[\s\S]*?\{\/\* 4d: Hi-fi screens — 2-col grid \(Fix 8\+9\) \*\/\}/,
  '{/* 4d: Hi-fi screens — 1-col grid (Fix 5) */}'
);

// Convert hi-fi grid
code = code.replace(
  /gridTemplateColumns:\s*\"1fr 1fr\",\s*gap:\s*\"16px\"/,
  'display: \"flex\", flexDirection: \"column\", gap: \"20px\"'
);

// Style hifi images
code = code.replace(
  /objectFit:\s*\"contain\",\s*background:\s*\"#f5f5f5\",\s*display:\s*\"block\",\s*cursor:\s*\"zoom-in\"/g,
  'width: \"100%\", maxHeight: \"500px\", objectFit: \"contain\", background: \"#f5f5f5\", border: \"0.5px solid rgba(154, 175, 122, 0.3)\", borderRadius: \"12px\", display: \"block\", cursor: \"zoom-in\", transition: \"transform 0.2s ease, box-shadow 0.2s ease\"'
);

// Wrap hi-fi
const startHifi = code.indexOf('{/* 4d: Hi-fi screens — 1-col grid (Fix 5) */}');
const endHifi = code.indexOf('{/* 4e: What\'s built so far */}');
if (startHifi > -1 && endHifi > -1) {
    let section = code.substring(startHifi, endHifi);
    
    let wrapped = `<div
              className="hifi-section-bg"
              style={{
                background: "#f5f0e8",
                margin: "40px -24px",
                padding: "40px 24px",
                borderTop: "0.5px solid rgba(154,175,122,0.2)",
                borderBottom: "0.5px solid rgba(154,175,122,0.2)"
              }}
            >
${section}            </div>\n\n            `;
    code = code.substring(0, startHifi) + wrapped + code.substring(endHifi);
}

// FIX 6: Subtitle hint outside the LofiHifiFade cards
const lofiHifiStart = code.indexOf('{/* Side-by-side components (Before/After) */}');
if(lofiHifiStart > -1) {
    const hint = `<p className="lh-hint-outside" style={{ fontSize: "13px", fontWeight: 400, color: "#9aaf7a", textAlign: "center", marginBottom: "12px", fontStyle: "italic" }}>
              Hover the left card to reveal the final design →
            </p>\n            `;
    code = code.substring(0, lofiHifiStart) + hint + code.substring(lofiHifiStart);
}


fs.writeFileSync(file, code);
