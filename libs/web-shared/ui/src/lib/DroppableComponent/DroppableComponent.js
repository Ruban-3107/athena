import './DroppableComponent.css';
import { useDrop } from 'react-dnd';
import { useEffect, useState, useRef } from 'react';

export const DroppableComponent = ({ accept, onDrop, children, fields }) => {
  const abcRef = useRef(fields); 

  useEffect(() => {
    abcRef.current = fields;
  }, [fields]);
  
  const handleDrop = (topicId) => {
    onDrop(topicId, abcRef.current);
  };

  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    accept: accept,
    drop: (item) => {
      handleDrop(item.id);
    },
    collect: (monitor) => ({
      canDrop: !!monitor.canDrop(),
      isOver: !!monitor.isOver(),
    }),
  }));

  const isActive = canDrop && isOver;

  return (
    <div ref={drop} style={{ backgroundColor: isActive ?? 'gray' }}>
      {children}
    </div>
  );
}
export default DroppableComponent;
