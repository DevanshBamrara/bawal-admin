import React from 'react';

// Wrapper for the asymmetrical layout
export const EditorialGrid = ({ children }) => {
  return (
    <div className="editorial-grid">
      {children}
    </div>
  );
};

// Individual block inside the grid
export const GridBlock = ({ 
  children, 
  colSpan = 1, 
  rowSpan = 1, 
  className = '', 
  hoverable = false,
  neonHover = false
}) => {
  const classes = `grid-block col-span-${colSpan} row-span-${rowSpan} ${hoverable ? 'hoverable' : ''} ${neonHover ? 'neon-hover' : ''} ${className}`;
  
  return (
    <div className={classes}>
      {children}
    </div>
  );
};
