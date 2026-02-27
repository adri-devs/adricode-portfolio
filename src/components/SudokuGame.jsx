import React, { useState, useEffect, useCallback } from 'react';
import { RefreshCcw, Trophy, ArrowLeft, Lightbulb } from 'lucide-react';

export default function SudokuGame({ onBack }) {
  const [grid, setGrid] = useState(Array(9).fill().map(() => Array(9).fill(0)));
  const [initialGrid, setInitialGrid] = useState(Array(9).fill().map(() => Array(9).fill(0)));
  const [selected, setSelected] = useState(null);
  const [won, setWon] = useState(false);
  const [difficulty, setDifficulty] = useState('medium');

  const isValid = (board, row, col, num) => {
    for (let x = 0; x < 9; x++) if (board[row][x] === num) return false;
    for (let x = 0; x < 9; x++) if (board[x][col] === num) return false;
    let startRow = row - row % 3, startCol = col - col % 3;
    for (let i = 0; i < 3; i++)
      for (let j = 0; j < 3; j++)
        if (board[i + startRow][j + startCol] === num) return false;
    return true;
  };

  const solve = (board) => {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === 0) {
          for (let num = 1; num <= 9; num++) {
            if (isValid(board, row, col, num)) {
              board[row][col] = num;
              if (solve(board)) return true;
              board[row][col] = 0;
            }
          }
          return false;
        }
      }
    }
    return true;
  };

  const generateSudoku = useCallback(() => {
    let newGrid = Array(9).fill().map(() => Array(9).fill(0));
    // Fill diagonal 3x3 boxes
    for (let i = 0; i < 9; i += 3) {
      let nums = [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => Math.random() - 0.5);
      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
          newGrid[i + row][i + col] = nums.pop();
        }
      }
    }
    solve(newGrid);

    // Remove numbers based on difficulty
    const cellsToRemove = difficulty === 'easy' ? 30 : difficulty === 'medium' ? 45 : 55;
    let count = 0;
    while (count < cellsToRemove) {
      let r = Math.floor(Math.random() * 9);
      let c = Math.floor(Math.random() * 9);
      if (newGrid[r][c] !== 0) {
        newGrid[r][c] = 0;
        count++;
      }
    }

    setGrid(newGrid.map(row => [...row]));
    setInitialGrid(newGrid.map(row => [...row]));
    setWon(false);
    setSelected(null);
  }, [difficulty]);

  useEffect(() => {
    generateSudoku();
  }, [generateSudoku]);

  const handleCellClick = (r, c) => {
    if (initialGrid[r][c] === 0) setSelected({ r, c });
  };

  const handleNumberInput = (num) => {
    if (!selected || won) return;
    const { r, c } = selected;
    let newGrid = grid.map(row => [...row]);
    newGrid[r][c] = num === grid[r][c] ? 0 : num;
    setGrid(newGrid);

    // Check win
    if (checkWin(newGrid)) setWon(true);
  };

  const checkWin = (board) => {
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (board[r][c] === 0) return false;
        const val = board[r][c];
        board[r][c] = 0;
        if (!isValid(board, r, c, val)) {
          board[r][c] = val;
          return false;
        }
        board[r][c] = val;
      }
    }
    return true;
  };

  return (
    <div className="flex flex-col items-center max-w-lg mx-auto">
      <div className="w-full flex justify-between items-center mb-6">
         <button onClick={onBack} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-500" />
         </button>
         <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
            {['easy', 'medium', 'hard'].map(d => (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                className={`px-3 py-1 text-[10px] font-black uppercase rounded-lg transition-all ${
                  difficulty === d ? 'bg-purple-600 text-white shadow-md' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {d === 'easy' ? 'Fácil' : d === 'medium' ? 'Medio' : 'Difícil'}
              </button>
            ))}
         </div>
         <button onClick={generateSudoku} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors">
            <RefreshCcw className="w-5 h-5 text-gray-500" />
         </button>
      </div>

      <div className="grid grid-cols-9 border-2 border-gray-900 dark:border-white bg-gray-900 dark:bg-white gap-[1px] mb-8 shadow-2xl rounded-sm overflow-hidden">
        {grid.map((row, r) => (
          row.map((val, c) => (
            <button
              key={`${r}-${c}`}
              onClick={() => handleCellClick(r, c)}
              className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-sm sm:text-lg font-bold transition-all
                ${initialGrid[r][c] !== 0 ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white' : 'bg-white dark:bg-gray-900 text-purple-600 dark:text-purple-400'}
                ${selected?.r === r && selected?.c === c ? 'ring-2 ring-inset ring-purple-500 bg-purple-50 dark:bg-purple-900/20' : ''}
                ${(r + 1) % 3 === 0 && r < 8 ? 'mb-[2px]' : ''}
                ${(c + 1) % 3 === 0 && c < 8 ? 'mr-[2px]' : ''}
              `}
            >
              {val !== 0 ? val : ''}
            </button>
          ))
        ))}
      </div>

      {won ? (
        <div className="text-center animate-bounce mb-8">
          <div className="flex items-center justify-center gap-2 text-green-500 font-black uppercase tracking-widest text-xl">
            <Trophy className="w-6 h-6" />
            ¡Victoria!
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-5 sm:grid-cols-9 gap-2 w-full px-2">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
            <button
              key={num}
              onClick={() => handleNumberInput(num)}
              className="py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl font-black text-gray-900 dark:text-white hover:bg-purple-600 hover:text-white dark:hover:bg-purple-600 transition-all active:scale-90 shadow-sm"
            >
              {num}
            </button>
          ))}
          <button
              onClick={() => handleNumberInput(0)}
              className="py-3 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-700 rounded-xl font-black text-gray-500 dark:text-gray-400 hover:bg-red-500 hover:text-white dark:hover:bg-red-500 transition-all active:scale-90 col-span-5 sm:col-span-9 text-xs uppercase tracking-widest"
          >
            Borrar
          </button>
        </div>
      )}
    </div>
  );
}
