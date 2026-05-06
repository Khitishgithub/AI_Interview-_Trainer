"use client";

import React, { useState, useCallback } from "react";
import { useParams } from "next/navigation";
import ReactFlow, {
  Background,
  Controls,
  Handle,
  Position,
  useNodesState,
  useEdgesState,
} from "reactflow";
import "reactflow/dist/style.css";
import { useRouter } from "next/navigation";

import { getRoadmapData } from "../../../../lib/roadmap";

// ─── Graph Generator ──────────────────────────────────────────────────────────
function generateGraph(data) {
  if (!data) return { nodes: [], edges: [] };

  const nodes = [];
  const edges = [];

  // Title node
  nodes.push({
    id: "title",
    type: "titleNode",
    position: { x: 300, y: 0 },
    data: { label: data.title, description: data.description },
  });

  let yOffset = 130;

  data.levels.forEach((level, li) => {
    const levelId = `level-${li}`;

    // Level header node
    nodes.push({
      id: levelId,
      type: "levelNode",
      position: { x: 200, y: yOffset },
      data: { label: level.level, color: level.color },
    });

    edges.push({
      id: `title-${levelId}`,
      source: li === 0 ? "title" : `level-${li - 1}-last`,
      target: levelId,
      type: "smoothstep",
      style: { stroke: level.color, strokeWidth: 2 },
      animated: true,
    });

    yOffset += 90;

    const topicCount = level.topics.length;
    const totalWidth = (topicCount - 1) * 220;
    const startX = 300 - totalWidth / 2;

    level.topics.forEach((topic, ti) => {
      const topicId = topic.id;
      const x = startX + ti * 220;

      nodes.push({
        id: topicId,
        type: "topicNode",
        position: { x, y: yOffset },
        data: {
          label: topic.label,
          description: topic.description,
          content: topic.content,
          color: level.color,
        },
      });

      edges.push({
        id: `${levelId}-${topicId}`,
        source: levelId,
        target: topicId,
        type: "smoothstep",
        style: { stroke: level.color, strokeWidth: 1.5, opacity: 0.7 },
      });
    });

    // invisible connector for next level's edge source
    nodes.push({
      id: `level-${li}-last`,
      type: "default",
      position: { x: 300, y: yOffset + 80 },
      data: { label: "" },
      style: { opacity: 0, width: 1, height: 1, pointerEvents: "none" },
    });

    yOffset += 160;
  });

  return { nodes, edges };
}

// ─── Custom Node Types ────────────────────────────────────────────────────────
function TitleNode({ data }) {
  return (
    <div
      style={{
        background: "linear-gradient(135deg, #1e1b4b, #312e81)",
        border: "1px solid #6366f1",
        borderRadius: 16,
        padding: "16px 28px",
        minWidth: 280,
        textAlign: "center",
        boxShadow: "0 0 32px rgba(99,102,241,0.3)",
      }}
    >
      <div
        style={{
          color: "#a5b4fc",
          fontSize: 12,
          letterSpacing: 2,
          marginBottom: 4,
        }}
      >
        ROADMAP
      </div>
      <div style={{ color: "#fff", fontSize: 20, fontWeight: 700 }}>
        {data.label}
      </div>
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />
    </div>
  );
}

function LevelNode({ data }) {
  return (
    <div
      style={{
        background: `${data.color}18`,
        border: `1.5px solid ${data.color}`,
        borderRadius: 10,
        padding: "8px 20px",
        minWidth: 200,
        textAlign: "center",
        boxShadow: `0 0 16px ${data.color}40`,
      }}
    >
      <Handle type="target" position={Position.Top} style={{ opacity: 0 }} />
      <div
        style={{
          color: data.color,
          fontSize: 13,
          fontWeight: 700,
          letterSpacing: 1,
        }}
      >
        {data.label.toUpperCase()}
      </div>
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />
    </div>
  );
}

function TopicNode({ data, selected }) {
  return (
    <div
      style={{
        background: selected ? `${data.color}20` : "#111827",
        border: `1.5px solid ${selected ? data.color : "#374151"}`,
        borderRadius: 10,
        padding: "10px 18px",
        minWidth: 160,
        cursor: "pointer",
        transition: "all 0.2s ease",
        boxShadow: selected ? `0 0 20px ${data.color}60` : "none",
      }}
    >
      <Handle type="target" position={Position.Top} style={{ opacity: 0 }} />
      <div style={{ color: "#f9fafb", fontSize: 14, fontWeight: 600 }}>
        {data.label}
      </div>
      {data.description && (
        <div style={{ color: "#9ca3af", fontSize: 11, marginTop: 4 }}>
          {data.description}
        </div>
      )}
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />
    </div>
  );
}

const nodeTypes = {
  titleNode: TitleNode,
  levelNode: LevelNode,
  topicNode: TopicNode,
};

// ─── Doc Panel ────────────────────────────────────────────────────────────────
function DocPanel({ topic, onClose }) {
  if (!topic) return null;
  return (
    <div
      style={{
        position: "absolute",
        right: 0,
        top: 40,
        height: "90%",
        width: 460,
        background: "#0f172a",
        borderLeft: "1px solid #1e293b",
        zIndex: 10,
        display: "flex",
        flexDirection: "column",
        boxShadow: "-8px 0 32px rgba(0,0,0,0.6)",
      }}
    >
      <div
        style={{
          padding: "20px 24px",
          borderBottom: "1px solid #1e293b",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "#0f172a",
        }}
      >
        <div>
          <div
            style={{
              color: "#6366f1",
              fontSize: 11,
              letterSpacing: 2,
              marginBottom: 4,
            }}
          >
            DOCUMENTATION
          </div>
          <div style={{ color: "#f1f5f9", fontSize: 18, fontWeight: 700 }}>
            {topic.label}
          </div>
        </div>
        <button
          onClick={onClose}
          style={{
            background: "#1e293b",
            border: "none",
            borderRadius: 8,
            color: "#94a3b8",
            padding: "6px 12px",
            cursor: "pointer",
            fontSize: 16,
          }}
        >
          ✕
        </button>
      </div>

      <div style={{ padding: "20px 24px", overflowY: "auto", flex: 1 }}>
        {topic.description && (
          <div
            style={{
              background: "#1e293b",
              borderRadius: 8,
              padding: "10px 14px",
              color: "#94a3b8",
              fontSize: 13,
              marginBottom: 20,
              borderLeft: `3px solid ${topic.color || "#6366f1"}`,
            }}
          >
            {topic.description}
          </div>
        )}

        <pre
          style={{
            color: "#cbd5e1",
            fontSize: 13,
            lineHeight: 1.8,
            whiteSpace: "pre-wrap",
            // fontFamily: "'Fira Code', 'Courier New', monospace",
            margin: 0,
          }}
        >
          {topic.content}
        </pre>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function RoadmapDetail() {
  const router = useRouter();
  const { slug } = useParams();
  const data = getRoadmapData(slug);

  const [selectedTopic, setSelectedTopic] = useState(null);

  const { nodes: initialNodes, edges: initialEdges } = generateGraph(data);
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  const onNodeClick = useCallback((_, node) => {
    if (node.type === "topicNode") {
      setSelectedTopic(node.data);
    } else {
      setSelectedTopic(null);
    }
  }, []);

  if (!data) {
    return (
      <div className="mt-20 w-full bg-black flex items-center justify-center text-white">
        <div className="text-center">
          <div className="text-4xl mb-4">🗺️</div>
          <div className="text-xl font-bold text-indigo-400">
            Roadmap not found
          </div>
          <div className="text-gray-500 mt-2">"{slug}" doesn't exist yet.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-black relative overflow-hidden">
      {/* Header */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-3">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="px-3 py-1.5 rounded-lg bg-gray-900/80 backdrop-blur border border-white/10 
               text-gray-300 hover:text-white hover:border-indigo-500 transition"
        >
          ← Back
        </button>

        {/* Title */}
        <div className="bg-gray-900/80 backdrop-blur border border-white/10 rounded-xl px-4 py-2">
          <div className="text-indigo-400 text-xs tracking-widest mb-0.5">
            LEARNING PATH
          </div>
          <div className="text-white font-bold text-sm">{data.title}</div>
        </div>
      </div>

      {/* Hint */}
      {!selectedTopic && (
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-10 text-gray-500 text-xs bg-gray-900/70 px-3 py-1.5 rounded-full border border-white/5">
          Click any topic node to view documentation
        </div>
      )}

      {/* React Flow */}
      <div
        style={{
          width: selectedTopic ? "calc(100% - 360px)" : "100%",
          height: "100%",
        }}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          fitView
          fitViewOptions={{ padding: 0.15 }}
        >
          <Background color="#1e293b" gap={24} />
          <Controls />
        </ReactFlow>
      </div>

      {/* Doc Panel */}
      <DocPanel topic={selectedTopic} onClose={() => setSelectedTopic(null)} />
    </div>
  );
}
