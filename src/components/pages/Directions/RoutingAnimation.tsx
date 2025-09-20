import { useState, useEffect, useMemo, useCallback, memo } from "react";
import { Grow } from "@mui/material";

const NODE_COUNT = 35;
const MIN_DISTANCE = 70;
const NEIGHBOR_COUNT = 3;
const ANIMATION_DURATION_MS = 1200;
const LOOP_INTERVAL_MS = 1600;
const WIDTH = 800;
const HEIGHT = 500;

const baseRoad = "#4a5568";
const baseNode = "#718096";
const startNode = "#4299e1";
const endNode = "#48bb78";

type Node = { id: string; x: number; y: number };
type Edge = { from: string; to: string };
type GraphData = { nodes: Node[]; edges: Edge[] };
type Path = string[];

const getDistance = (n1: Node, n2: Node) => Math.sqrt((n1.x - n2.x) ** 2 + (n1.y - n2.y) ** 2);

const generateRandomGraph = (): GraphData => {
    const nodes: Node[] = [];
    let attempts = 0;

    while (nodes.length < NODE_COUNT && attempts < 2000) {
        const newNode = {
            id: `n${nodes.length}`,
            x: Math.random() * (WIDTH - 100) + 50,
            y: Math.random() * (HEIGHT - 100) + 50,
        };
        if (!nodes.some((node) => getDistance(node, newNode) < MIN_DISTANCE)) {
            nodes.push(newNode);
        }
        attempts++;
    }

    const edges: Edge[] = [];
    const edgeSet = new Set<string>();

    nodes.forEach((node) => {
        const neighbors = nodes
            .map((n) => ({ node: n, dist: getDistance(node, n) }))
            .filter((n) => n.node.id !== node.id)
            .sort((a, b) => a.dist - b.dist)
            .slice(0, NEIGHBOR_COUNT);

        neighbors.forEach(({ node: neighbor }) => {
            const edgeKey = [node.id, neighbor.id].sort().join("-");
            if (!edgeSet.has(edgeKey)) {
                edges.push({ from: node.id, to: neighbor.id });
                edgeSet.add(edgeKey);
            }
        });
    });
    return { nodes, edges };
};

const findRandomPathDFS = (graph: GraphData, startId: string, endId: string): Path | null => {
    const adj = new Map<string, string[]>();
    graph.edges.forEach(({ from, to }) => {
        adj.set(from, [...(adj.get(from) || []), to]);
        adj.set(to, [...(adj.get(to) || []), from]);
    });

    const stack = [{ nodeId: startId, path: [startId] }];
    const visited = new Set([startId]);
    while (stack.length > 0) {
        const { nodeId, path } = stack.pop()!;
        if (nodeId === endId) return path;

        const neighbors = adj.get(nodeId) || [];
        for (let i = neighbors.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [neighbors[i], neighbors[j]] = [neighbors[j], neighbors[i]];
        }

        for (const neighbor of neighbors) {
            if (!visited.has(neighbor)) {
                visited.add(neighbor);
                stack.push({ nodeId: neighbor, path: [...path, neighbor] });
            }
        }
    }
    return null;
};

const Edge = memo(({ fromNode, toNode }: { fromNode: Node; toNode: Node }) => (
    <line x1={fromNode.x} y1={fromNode.y} x2={toNode.x} y2={toNode.y} stroke={baseRoad} strokeWidth="2" />
));

export default () => {
    const [animationKey, setAnimationKey] = useState(0);
    const [{ graph, path, nodeAnimationDelays }, setRouteState] = useState({
        graph: null as GraphData | null,
        path: null as Path | null,
        nodeAnimationDelays: new Map<string, number>(),
    });

    const generateNewRoute = useCallback(() => {
        let newPath: Path | null = null;
        let newGraph: GraphData | undefined;
        let startNode, endNode;

        while (!newPath) {
            newGraph = generateRandomGraph();
            if (newGraph.nodes.length < 2) continue;

            const sortedNodes = [...newGraph.nodes].sort((a, b) => a.x - b.x);
            startNode = sortedNodes[0];
            endNode = sortedNodes[sortedNodes.length - 1];
            newPath = findRandomPathDFS(newGraph, startNode.id, endNode.id);
        }

        const nodeMap = new Map<string, Node>();
        newGraph!.nodes.forEach((n) => nodeMap.set(n.id, n));

        let totalPathLength = 0;
        const subPathLengths: number[] = [0];
        for (let i = 0; i < newPath.length - 1; i++) {
            totalPathLength += getDistance(nodeMap.get(newPath[i])!, nodeMap.get(newPath[i + 1])!);
            subPathLengths.push(totalPathLength);
        }

        const delays = new Map<string, number>();
        newPath.forEach((nodeId, index) => {
            if (!totalPathLength) return;

            delays.set(nodeId, (subPathLengths[index] / totalPathLength) * ANIMATION_DURATION_MS * 0.8);
        });

        setRouteState({
            graph: newGraph!,
            path: newPath,
            nodeAnimationDelays: delays,
        });

        setAnimationKey((k) => k + 1);
    }, []);

    useEffect(() => {
        generateNewRoute();
        const intervalId = setInterval(generateNewRoute, LOOP_INTERVAL_MS);

        return () => {
            clearInterval(intervalId);
        };
    }, [generateNewRoute]);

    const nodeMap = useMemo(() => {
        if (!graph) return new Map<string, Node>();

        return new Map(graph.nodes.map((n) => [n.id, n]));
    }, [graph]);

    const pathData = useMemo(() => {
        if (!graph || !path) return null;

        return path
            .map((nodeId) => {
                const node = nodeMap.get(nodeId)!;

                return `${node.x},${node.y}`;
            })
            .join(" L ");
    }, [path, nodeMap]);

    const pathNodeIds = useMemo(() => {
        if (!path) return new Set<string>();

        return new Set(path);
    }, [path]);

    if (!graph || !path) return null;

    const startNodeId = path[0];
    const endNodeId = path[path.length - 1];

    return (
        <Grow in>
            <svg
                viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
                style={{ width: "100%", maxWidth: "800px", margin: "0 auto" }}
            >
                <g id="edges">
                    {graph.edges.map(({ from, to }) => (
                        <Edge key={`${from}-${to}`} fromNode={nodeMap.get(from)!} toNode={nodeMap.get(to)!} />
                    ))}
                </g>

                {pathData && (
                    <path
                        key={animationKey}
                        d={`M ${pathData}`}
                        fill="none"
                        stroke="#e2e8f0"
                        strokeWidth="4"
                        strokeLinecap="round"
                        style={{
                            animation: `draw-path ${ANIMATION_DURATION_MS}ms ease-in-out forwards`,
                        }}
                        ref={(el) => {
                            if (!el) return;

                            el.style.strokeDasharray = el.style.strokeDashoffset = `${el.getTotalLength()}`;
                        }}
                    />
                )}

                <g id="nodes">
                    {graph.nodes.map(({ id, x, y }) => {
                        if (pathNodeIds.has(id) && id !== startNodeId && id !== endNodeId) {
                            return (
                                <circle
                                    key={`${id}-${animationKey}`}
                                    cx={x}
                                    cy={y}
                                    r={6}
                                    fill={baseNode}
                                    style={{
                                        animation: `highlight-node 300ms ease-out forwards`,
                                        animationDelay: `${nodeAnimationDelays.get(id) || 0}ms`,
                                        transformOrigin: `${x}px ${y}px`,
                                    }}
                                />
                            );
                        } else {
                            return (
                                <circle
                                    key={id}
                                    cx={x}
                                    cy={y}
                                    r={6}
                                    fill={
                                        id === startNodeId ? startNode : id === endNodeId ? endNode : baseNode
                                    }
                                />
                            );
                        }
                    })}
                </g>
            </svg>
        </Grow>
    );
};
