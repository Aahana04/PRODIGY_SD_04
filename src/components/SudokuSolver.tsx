import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, Lightbulb, CheckCircle } from 'lucide-react';
import SudokuGrid from './SudokuGrid';
import { solveSudoku, isValidSudoku, getSamplePuzzle, deepCopy } from '../utils/sudokuSolver';

const SudokuSolver: React.FC = () => {
  const [puzzle, setPuzzle] = useState<number[][]>(() => getSamplePuzzle());
  const [originalPuzzle, setOriginalPuzzle] = useState<number[][]>(() => getSamplePuzzle());
  const [isGiven, setIsGiven] = useState<boolean[][]>(() => 
    getSamplePuzzle().map(row => row.map(cell => cell !== 0))
  );
  const [isSolved, setIsSolved] = useState<boolean[][]>(() => 
    Array(9).fill(null).map(() => Array(9).fill(false))
  );
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | 'info'>('info');

  const showMessage = (text: string, type: 'success' | 'error' | 'info') => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleCellChange = (row: number, col: number, value: number) => {
    const newPuzzle = deepCopy(puzzle);
    newPuzzle[row][col] = value;
    setPuzzle(newPuzzle);
    
    // Update solved status
    const newIsSolved = deepCopy(isSolved);
    newIsSolved[row][col] = false;
    setIsSolved(newIsSolved);
  };

  const solvePuzzle = async () => {
    if (!isValidSudoku(puzzle)) {
      showMessage('Invalid puzzle configuration. Please check for conflicts.', 'error');
      return;
    }

    setIsLoading(true);
    setMessage('Solving puzzle...');
    setMessageType('info');

    // Add a small delay to show loading state
    await new Promise(resolve => setTimeout(resolve, 500));

    const puzzleCopy = deepCopy(puzzle);
    const solved = solveSudoku(puzzleCopy);

    if (solved) {
      // Mark newly solved cells
      const newIsSolved = Array(9).fill(null).map(() => Array(9).fill(false));
      for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
          if (puzzle[row][col] === 0 && puzzleCopy[row][col] !== 0) {
            newIsSolved[row][col] = true;
          }
        }
      }
      
      setPuzzle(puzzleCopy);
      setIsSolved(newIsSolved);
      showMessage('Puzzle solved successfully!', 'success');
    } else {
      showMessage('No solution exists for this puzzle.', 'error');
    }

    setIsLoading(false);
  };

  const resetPuzzle = () => {
    setPuzzle(deepCopy(originalPuzzle));
    setIsSolved(Array(9).fill(null).map(() => Array(9).fill(false)));
    setMessage('');
  };

  const clearPuzzle = () => {
    const emptyPuzzle = Array(9).fill(null).map(() => Array(9).fill(0));
    setPuzzle(emptyPuzzle);
    setOriginalPuzzle(emptyPuzzle);
    setIsGiven(Array(9).fill(null).map(() => Array(9).fill(false)));
    setIsSolved(Array(9).fill(null).map(() => Array(9).fill(false)));
    setMessage('');
  };

  const loadSamplePuzzle = () => {
    const sample = getSamplePuzzle();
    setPuzzle(sample);
    setOriginalPuzzle(sample);
    setIsGiven(sample.map(row => row.map(cell => cell !== 0)));
    setIsSolved(Array(9).fill(null).map(() => Array(9).fill(false)));
    setMessage('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Sudoku Solver</h1>
          <p className="text-gray-600 text-lg">
            Enter your puzzle and let the algorithm solve it using backtracking
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-xl p-8 mb-6">
          <div className="flex justify-center mb-6">
            <SudokuGrid
              puzzle={puzzle}
              onCellChange={handleCellChange}
              isGiven={isGiven}
              isSolved={isSolved}
            />
          </div>

          <div className="flex flex-wrap justify-center gap-4 mb-6">
            <button
              onClick={solvePuzzle}
              disabled={isLoading}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
            >
              <Play size={20} />
              {isLoading ? 'Solving...' : 'Solve Puzzle'}
            </button>

            <button
              onClick={resetPuzzle}
              className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
            >
              <RotateCcw size={20} />
              Reset
            </button>

            <button
              onClick={loadSamplePuzzle}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
            >
              <Lightbulb size={20} />
              Load Sample
            </button>

            <button
              onClick={clearPuzzle}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
            >
              Clear All
            </button>
          </div>

          {message && (
            <div className={`flex items-center justify-center gap-2 p-4 rounded-lg text-center font-medium ${
              messageType === 'success' ? 'bg-green-100 text-green-800' :
              messageType === 'error' ? 'bg-red-100 text-red-800' :
              'bg-blue-100 text-blue-800'
            }`}>
              {messageType === 'success' && <CheckCircle size={20} />}
              {message}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-xl p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">How to Use</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Instructions</h3>
              <ul className="text-gray-600 space-y-1">
                <li>• Enter numbers 1-9 in the empty cells</li>
                <li>• Blue cells are given numbers (cannot be changed)</li>
                <li>• Green cells are solved by the algorithm</li>
                <li>• Click "Solve Puzzle" to automatically complete it</li>
                <li>• Use "Load Sample" to try a pre-loaded puzzle</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Algorithm</h3>
              <p className="text-gray-600">
                The solver uses a backtracking algorithm that systematically tries
                numbers 1-9 in each empty cell, checking for conflicts in rows,
                columns, and 3×3 boxes. When a conflict is found, it backtracks
                and tries the next possibility until a solution is found.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SudokuSolver;