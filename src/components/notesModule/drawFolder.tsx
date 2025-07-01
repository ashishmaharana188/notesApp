import React from "react";

type FileItem = {
  id?: number;
  label?: string;
  group?: string;
};

const files: FileItem[] = [
  { id: 94, label: "oil lamp" },
  { id: 95, label: "oats" },
  { group: "O" },
  { id: 96, label: "pants" },
  { id: 97, label: "plane" },
  { id: 98, label: "plant 003" },
  { id: 99, label: "pomelo" },
  { id: 100, label: "phisher" },
  { id: 101, label: "palo alto" },
  { id: 102, label: "pencil" },
  { id: 103, label: "photos" },
  { id: 104, label: "quiet" },
  { group: "P" },
  { id: 105, label: "queen" },
  { id: 106, label: "questions" },
  { id: 107, label: "quizz" },
  { id: 108, label: "quit" },
  { group: "Q" },
  { id: 109, label: "raccoon" },
  { id: 111, label: "rizz" },
  { id: 112, label: "rum" },
  { id: 113, label: "generic guy" },
  { id: 114, label: "rain" },
  { id: 115, label: "rug" },
  { group: "R" },
  { id: 116, label: "ruby" },
  { id: 117, label: "sider" },
  { id: 118, label: "sony" },
  { id: 119, label: "sun" },
  { id: 120, label: "seller" },
  { id: 121, label: "sims" },
  { id: 122, label: "slides" },
  { id: 123, label: "simpsons" },
  { group: "S" },
  { id: 124, label: "sir" },
];

// Flatten into a single stack: group, then all notes for that group
function getStack(files: FileItem[]) {
  const stack: { type: "group" | "note"; data: FileItem }[] = [];
  let currentGroup: string | null = null;
  let groupNotes: FileItem[] = [];
  for (const file of files) {
    if (file.group) {
      // Push previous group notes
      if (groupNotes.length) {
        groupNotes.forEach((n) => stack.push({ type: "note", data: n }));
        groupNotes = [];
      }
      stack.push({ type: "group", data: file });
      currentGroup = file.group;
    } else if (file.id && file.label && currentGroup) {
      groupNotes.push(file);
    }
  }
  // Push last group notes
  if (groupNotes.length) {
    groupNotes.forEach((n) => stack.push({ type: "note", data: n }));
  }
  return stack;
}

// Generate a slight horizontal offset for each row
function getOffset(idx: number) {
  const offsets = [0, 18, 36, 12, 28, 8, 24, 32, 16, 20];
  return offsets[idx % offsets.length];
}

function FolderTab({
  label = "",
  width = 60,
  isGroup = false,
}: {
  label?: string;
  width?: number;
  isGroup?: boolean;
}) {
  return (
    <svg width={width} height={24} style={{ zIndex: 2 }}>
      <path
        d={`
          M2,22
          Q2,8 14,8
          L${width - 14},8
          Q${width - 2},8 ${width - 2},22
          Z
        `}
        fill={isGroup ? "#111" : "#fff"}
        stroke="#222"
        strokeWidth="2"
      />
      <text
        x="50%"
        y="17"
        textAnchor="middle"
        fontFamily="monospace"
        fontSize="13"
        fontWeight="bold"
        fill={isGroup ? "#fff" : "#222"}
      >
        {label}
      </text>
    </svg>
  );
}

export default function RetroFolderUI() {
  const stack = getStack(files);
  const rowHeight = 38; // 32px card + 6px overlap

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#ededed",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "monospace",
        padding: "24px",
      }}
    >
      <div
        style={{
          position: "relative",
          width: 540,
          minHeight: 900,
          background: "#fff",
          border: "2px solid #222",
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
          borderBottomLeftRadius: 8,
          borderBottomRightRadius: 8,
          boxShadow: "0 2px 8px #0001",
          overflow: "visible",
          padding: 32,
        }}
      >
        {/* Overlayed stack */}
        <div
          style={{
            position: "relative",
            width: "100%",
            height: stack.length * rowHeight + 40,
          }}
        >
          {stack.map((item, idx) => {
            const left = getOffset(idx);
            return (
              <div
                key={idx}
                style={{
                  position: "absolute",
                  top: idx * rowHeight,
                  left,
                  width: "85%",
                  zIndex: 1000 - idx,
                  pointerEvents: "none",
                }}
              >
                {/* Tab overlays the card below */}
                <div style={{ position: "relative", width: "100%" }}>
                  <div
                    style={{
                      position: "absolute",
                      top: -18,
                      left: 0,
                      width: "100%",
                    }}
                  >
                    {item.type === "group" ? (
                      <div
                        style={{
                          width: "100%",
                          display: "flex",
                          alignItems: "center",
                          background: "#111",
                          color: "#fff",
                          border: "2px solid #222",
                          borderRadius: 10,
                          fontWeight: 700,
                          fontSize: 14,
                          padding: "0 18px",
                          height: 24,
                        }}
                      >
                        <FolderTab label={item.data.group} width={60} isGroup />
                        <span style={{ marginLeft: 8 }}>{item.data.group}</span>
                        <span style={{ marginLeft: "auto", marginRight: 8 }}>
                          002
                        </span>
                      </div>
                    ) : (
                      <FolderTab label={String(item.data.id)} width={60} />
                    )}
                  </div>
                  {/* Card */}
                  {item.type === "group" ? (
                    <div style={{ height: 24 }} />
                  ) : (
                    <div
                      style={{
                        width: "100%",
                        height: 32,
                        display: "flex",
                        alignItems: "center",
                        background: "#fff",
                        color: "#111",
                        border: "2px solid #222",
                        borderRadius: 10,
                        fontWeight: 400,
                        fontSize: 14,
                        boxSizing: "border-box",
                        boxShadow: "0 1px 2px #0001",
                        overflow: "visible",
                        position: "relative",
                        marginTop: 6,
                      }}
                    >
                      <span style={{ marginLeft: 68 }}>{item.data.label}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        {/* Bottom tag */}
        <div
          style={{
            position: "absolute",
            bottom: -24,
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          <span
            style={{
              background: "#ffe066",
              color: "#111",
              fontWeight: 700,
              padding: "4px 18px",
              borderRadius: 6,
              fontSize: 13,
              boxShadow: "0 1px 2px #0001",
              border: "2px solid #222",
            }}
          >
            sam’s secret files
          </span>
        </div>
      </div>
    </div>
  );
}
