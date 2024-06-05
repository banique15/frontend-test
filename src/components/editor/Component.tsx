import React from 'react';
import './component.css'; // Make sure to put your SCSS in a separate file

const DraggableItem = (props) => {
  return (
    <div className="draggable-item">
      <div
        className="drag-handle"
        contentEditable="false"
        draggable="true"
        data-drag-handle
      />
      <div className="content">
        {props.children}
      </div>
    </div>
  );
}

export default DraggableItem;
