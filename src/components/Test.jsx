
import React, { useState } from 'react';

function Test() {
    const [items, setItems] = useState([
        { id: 1, name: 'Man', order: 1 },
        { id: 2, name: 'Task', order: 2 },
        { id: 3, name: 'Flowe', order: 3 },
    ]);

    const [draggedItem, setDraggedItem] = useState(null);

    const handleDragStart = (e, item) => {
        setDraggedItem(item);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (e, target) => {
        const updatedItems = [...items];
        const draggedIndex = updatedItems.findIndex((item) => item.id === draggedItem.id);
        const targetIndex = updatedItems.findIndex((item) => item.id === target.id);

        if (draggedIndex !== targetIndex) {
            updatedItems.splice(targetIndex, 0, updatedItems.splice(draggedIndex, 1)[0]);
            setItems(updatedItems);
        }
    };

    const handleSendPayload = () => {
        const payload = items.map((item) => ({ id: item.id, order: item.order }));
        // Send payload to backend
        console.log(payload);
    };

    return (
        <div fluid className="p-0" style={{ marginTop: "6em" }}>
            {items.map((item) => (
                <div
                    key={item.id}
                    draggable="true"
                    onDragStart={(e) => handleDragStart(e, item)}
                    onDragOver={(e) => handleDragOver(e)}
                    onDrop={(e) => handleDrop(e, item)}
                >
                    {item.name} ({item.order})
                </div>
            ))}
            <button onClick={handleSendPayload}>Send Payload</button>
        </div>
    );
}

export default Test;
