// Check if a number is valid in a specific position
export const isValidMove = (grid: number[][], row: number, col: number, num: number): boolean => {
  // Check row
  for (let i = 0; i < 9; i++) {
    if (grid[row][i] === num) return false;
  }
  
  // Check column
  for (let i = 0; i < 9; i++) {
    if (grid[i][col] === num) return false;
  }
  
  // Check 3x3 box
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;
  
  for (let i = boxRow; i < boxRow + 3; i++) {
    for (let j = boxCol; j < boxCol + 3; j++) {
      if (grid[i][j] === num) return false;
    }
  }
  
  return true;
};

// Find the next empty cell
export const findEmptyCell = (grid: number[][]): [number, number] | null => {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (grid[row][col] === 0) {
        return [row, col];
      }
    }
  }
  return null;
};

// Solve sudoku using backtracking
export const solveSudoku = (grid: number[][]): boolean => {
  const emptyCell = findEmptyCell(grid);
  
  if (!emptyCell) {
    return true; // Puzzle solved
  }
  
  const [row, col] = emptyCell;
  
  for (let num = 1; num <= 9; num++) {
    if (isValidMove(grid, row, col, num)) {
      grid[row][col] = num;
      
      if (solveSudoku(grid)) {
        return true;
      }
      
      grid[row][col] = 0; // Backtrack
    }
  }
  
  return false;
};

// Check if the current state is valid
export const isValidSudoku = (grid: number[][]): boolean => {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (grid[row][col] !== 0) {
        const num = grid[row][col];
        grid[row][col] = 0; // Temporarily remove to check
        if (!isValidMove(grid, row, col, num)) {
          grid[row][col] = num; // Restore
          return false;
        }
        grid[row][col] = num; // Restore
      }
    }
  }
  return true;
};

// Generate a sample puzzle for demonstration
export const getSamplePuzzle = (): number[][] => {
  return [
    [5, 3, 0, 0, 7, 0, 0, 0, 0],
    [6, 0, 0, 1, 9, 5, 0, 0, 0],
    [0, 9, 8, 0, 0, 0, 0, 6, 0],
    [8, 0, 0, 0, 6, 0, 0, 0, 3],
    [4, 0, 0, 8, 0, 3, 0, 0, 1],
    [7, 0, 0, 0, 2, 0, 0, 0, 6],
    [0, 6, 0, 0, 0, 0, 2, 8, 0],
    [0, 0, 0, 4, 1, 9, 0, 0, 5],
    [0, 0, 0, 0, 8, 0, 0, 7, 9]
  ];
};

// Deep copy 2D array
export const deepCopy = (arr: number[][]): number[][] => {
  return arr.map(row => [...row]);
};