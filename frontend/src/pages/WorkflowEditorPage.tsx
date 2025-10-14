import React, {useState, useEffect, useCallback} from 'react';
import ReactFlow,{
    addEdge,
    Background,
    Controls,
    MiniMap,
    useEdgesState,
    useNodesState,
} from 'reactflow';
import "reactflow/dist/style.css";
import { v4 as uuidv4 } from "uuid";
import { getWorkflowSteps, saveWorkflowStep } from "../services/workflowService";

export default function WorkflowEditorPage() {
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [projectId, setProjectId] = useState<number>(1); // valitse projektin ID myöhemmin dynaamisesti

    // 🔹 Hae workflow-stepit backendistä
    useEffect(() => {
        const fetchData = async () => {
            const data = await getWorkflowSteps(projectId);
            const formattedNodes = data.map((step: any) => ({
                id: step.id.toString(),
                type: "default",
                data: { label: step.name },
                position: { x: step.position_x, y: step.position_y },
            }));

            const formattedEdges = data
                .filter((step: any) => step.next_step_id)
                .map((step: any) => ({
                    id: uuidv4(),
                    source: step.id.toString(),
                    target: step.next_step_id.toString(),
                }));

            setNodes(formattedNodes);
            setEdges(formattedEdges);
        };
        fetchData();
    }, [projectId]);

    // 🔹 Lisää uusi node
    const addNode = useCallback(() => {
        const newNode = {
            id: uuidv4(),
            type: "default",
            position: { x: 100, y: 100 },
            data: { label: `Uusi vaihe` },
        };
        setNodes((nds) => nds.concat(newNode));
    }, []);

    // 🔹 Kun reuna (yhteys) lisätään
    const onConnect = useCallback(
        (params: any) => setEdges((eds) => addEdge(params, eds)),
        [setEdges]
    );

    // 🔹 Tallenna muutokset backendille
    const saveWorkflow = async () => {
        for (const node of nodes) {
            const nextEdge = edges.find((e) => e.source === node.id);
            const stepPayload = {
                name: node.data.label,
                position_x: node.position.x,
                position_y: node.position.y,
                next_step_id: nextEdge ? Number(nextEdge.target) : null,
                action_type: "default"
            };
            console.log(stepPayload)
            console.log(projectId)
            if (!isNaN(Number(node.id))) {
                // Existing step
                await saveWorkflowStep({ id: node.id, ...stepPayload });
            } else {
                // New step
                await saveWorkflowStep({ project_id: projectId, ...stepPayload });
            }
        }
        alert("Työnkulku tallennettu!");
    };

    return (
        <div className="w-full h-[85vh]">
            <div className="flex justify-between p-4">
                <button onClick={addNode} className="bg-blue-500 text-white px-4 py-2 rounded">
                    ➕ Lisää vaihe
                </button>
                <button onClick={saveWorkflow} className="bg-green-500 text-white px-4 py-2 rounded">
                    💾 Tallenna
                </button>
            </div>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                fitView
            >
                <MiniMap />
                <Controls />
                <Background gap={12} size={1} />
            </ReactFlow>
        </div>
    );
}