import React from 'react';

interface SudokuGridProps {
  puzzle: number[][];
  onCellChange: (row: number, col: number, value: number) => void;
  isGiven: boolean[][];
  isSolved: boolean[][];
}

const SudokuGrid: React.FC<SudokuGridProps> = ({ puzzle, onCellChange, isGiven, isSolved }) => {
  const handleInputChange = (row: number, col: number, value: string) => {
    const numValue = value === '' ? 0 : parseInt(value, 10);
    if (isNaN(numValue) || numValue < 0 || numValue > 9) return;
    onCellChange(row, col, numValue);
  };

  const getCellClassName = (row: number, col: number) => {
    let className = 'w-10 h-10 text-center border border-gray-300 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200';
    
    // Add thicker borders for 3x3 sections
    if (row % 3 === 0 && row !== 0) className += ' border-t-2 border-t-gray-800';
    if (col % 3 === 0 && col !== 0) className += ' border-l-2 border-l-gray-800';
    if (row === 8) className += ' border-b-2 border-b-gray-800';
    if (col === 8) className += ' border-r-2 border-r-gray-800';
    
    // Color coding for different cell types
    if (isGiven[row][col]) {
      className += ' bg-blue-50 text-blue-800 font-bold';
    } else if (isSolved[row][col]) {
      className += ' bg-green-50 text-green-800';
    } else {
      className += ' bg-white hover:bg-gray-50';
    }
    
    return className;
  };

  return (
    <div className="inline-block border-2 border-gray-800 rounded-lg overflow-hidden shadow-lg">
      <div className="grid grid-cols-9 gap-0">
        {puzzle.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <input
              key={`${rowIndex}-${colIndex}`}
              type="text"
              value={cell === 0 ? '' : cell.toString()}
              onChange={(e) => handleInputChange(rowIndex, colIndex, e.target.value)}
              className={getCellClassName(rowIndex, colIndex)}
              maxLength={1}
              disabled={isGiven[rowIndex][colIndex]}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default SudokuGrid;