export function generateGraph(data) {
  const nodes = [];
  const edges = [];

  let x = 0;
  let y = 0;

  data.levels.forEach((level, levelIndex) => {
    level.topics.forEach((topic, index) => {
      const nodeId = topic.id;

      nodes.push({
        id: nodeId,
        position: { x: levelIndex * 300, y: index * 150 },
        data: {
          label: `${topic.label}`
        },
        style: {
          background: "#111",
          color: "white",
          border: `2px solid ${level.color}`,
          padding: 10,
          borderRadius: "10px"
        }
      });

      // Connect previous node (basic flow)
      if (index > 0) {
        edges.push({
          id: `${level.topics[index - 1].id}-${nodeId}`,
          source: level.topics[index - 1].id,
          target: nodeId,
          animated: true
        });
      }
    });
  });

  return { nodes, edges };
}