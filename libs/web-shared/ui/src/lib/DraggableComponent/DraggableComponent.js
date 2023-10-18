import './DraggableComponent.css';
import { useEffect } from 'react';
import { useDrag } from 'react-dnd';
export const DraggableComponent=({ type, renderElement, children, handleClose, item })=> {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: type,
    item: { id: item },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const elementProps = {
    ref: drag,
    style: { opacity: isDragging ? 0.5 : 1 },
  };
  useEffect(() => {
    if (isDragging) {
      handleClose()
    }
  }, [isDragging])

  const Element = renderElement || 'div';

  return <Element {...elementProps}>{children}</Element>;
}
export default DraggableComponent;
