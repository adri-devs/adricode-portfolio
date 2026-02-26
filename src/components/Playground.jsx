import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Trophy, Play, RotateCcw, X, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const SPEED = 150;

export default function Playground({ onClose }) {
  const [activeGame, setActiveGame] = useState(null);

  const games = [
    { id: 'snake', name: 'Snake Retro', icon: '🐍', available: false },
    { id: 'pong', name: 'Cyber Pong', icon: '🏓', available: false },
    { id: 'breakout', name: 'Brick Breaker', icon: '🧱', available: false },
    { id: 'tetris', name: 'Block Puzzle', icon: '🧩', available: false },
  ];

  if (!activeGame) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-md mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Play className="w-5 h-5 text-purple-600" /> Zona Recreo
          </h3>
          {onClose && (
            <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4">
          {games.map((game) => (
            <div 
              key={game.id}
              className={`p-4 rounded-xl border-2 transition-all flex items-center justify-between ${
                game.available 
                  ? 'border-purple-100 dark:border-purple-900/30 hover:border-purple-500 cursor-pointer' 
                  : 'border-gray-100 dark:border-gray-700 opacity-75 grayscale'
              }`}
              onClick={() => game.available && setActiveGame(game.id)}
            >
              <div className="flex items-center gap-4">
                <span className="text-3xl">{game.icon}</span>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white">{game.name}</h4>
                  <p className="text-xs text-gray-500">{game.available ? '¡Haz clic para jugar!' : 'Próximamente'}</p>
                </div>
              </div>
              {!game.available && (
                <span className="text-[10px] font-black px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-400 rounded-md uppercase">
                  No disponible
                </span>
              )}
            </div>
          ))}
        </div>

        <p className="mt-8 text-xs text-center text-gray-500 dark:text-gray-400 font-medium">
          Más juegos en camino...
        </p>
      </div>
    );
  }

  /* SNAKE AUTO-GENERADO, DE EJEMPLO PARA EL DESARROLLO */
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => parseInt(localStorage.getItem('snake-highscore') || '0'));
  const [isPlaying, setIsPlaying] = useState(false);
  const gameLoopRef = useRef();

  const generateFood = useCallback((currentSnake) => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      if (!currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood(generateFood(INITIAL_SNAKE));
    setIsGameOver(false);
    setScore(0);
    setIsPlaying(true);
  };

  const moveSnake = useCallback(() => {
    if (isGameOver || !isPlaying) return;

    setSnake((prevSnake) => {
      const head = prevSnake[0];
      const newHead = {
        x: (head.x + direction.x + GRID_SIZE) % GRID_SIZE,
        y: (head.y + direction.y + GRID_SIZE) % GRID_SIZE,
      };

      // Check collision with self
      if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setIsGameOver(true);
        setIsPlaying(false);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check food collision
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => s + 10);
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, isGameOver, isPlaying, generateFood]);

  useEffect(() => {
    if (isPlaying && !isGameOver) {
      gameLoopRef.current = setInterval(moveSnake, SPEED);
    } else {
      clearInterval(gameLoopRef.current);
    }
    return () => clearInterval(gameLoopRef.current);
  }, [isPlaying, isGameOver, moveSnake]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'ArrowUp': if (direction.y === 0) setDirection({ x: 0, y: -1 }); break;
        case 'ArrowDown': if (direction.y === 0) setDirection({ x: 0, y: 1 }); break;
        case 'ArrowLeft': if (direction.x === 0) setDirection({ x: -1, y: 0 }); break;
        case 'ArrowRight': if (direction.x === 0) setDirection({ x: 1, y: 0 }); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('snake-highscore', score.toString());
    }
  }, [score, highScore]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-md mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Play className="w-5 h-5 text-purple-600" /> Playground: Snake
        </h3>
        <div className="flex gap-2">
          <button 
            onClick={() => setActiveGame(null)} 
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors text-gray-500"
            title="Volver al menú"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          {onClose && (
            <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          )}
        </div>
      </div>

      <div className="flex justify-between mb-4">
        <div className="text-center">
          <p className="text-xs uppercase font-bold text-gray-500 dark:text-gray-400">Puntuación</p>
          <p className="text-2xl font-black text-purple-600 dark:text-purple-400">{score}</p>
        </div>
        <div className="text-center">
          <p className="text-xs uppercase font-bold text-gray-500 dark:text-gray-400 flex items-center gap-1">
            <Trophy className="w-3 h-3" /> Record
          </p>
          <p className="text-2xl font-black text-amber-500">{highScore}</p>
        </div>
      </div>

      <div 
        className="relative bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden border-2 border-gray-200 dark:border-gray-700 mx-auto"
        style={{ width: '280px', height: '280px', display: 'grid', gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)` }}
      >
        {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
          const x = i % GRID_SIZE;
          const y = Math.floor(i / GRID_SIZE);
          const isSnake = snake.some(s => s.x === x && s.y === y);
          const isHead = snake[0].x === x && snake[0].y === y;
          const isFood = food.x === x && food.y === y;

          return (
            <div 
              key={i} 
              className={`w-full h-full rounded-sm transition-colors duration-200 ${
                isHead ? 'bg-purple-600 dark:bg-purple-500 z-10' : 
                isSnake ? 'bg-purple-400 dark:bg-purple-700' : 
                isFood ? 'bg-red-500 animate-pulse' : 
                'bg-transparent'
              }`}
            />
          );
        })}

        {(!isPlaying || isGameOver) && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center text-white p-6 text-center">
            {isGameOver ? (
              <>
                <h4 className="text-2xl font-black mb-2 text-red-500 uppercase italic">¡Game Over!</h4>
                <p className="mb-6 font-medium">Has chocado contigo mismo.</p>
              </>
            ) : (
              <h4 className="text-2xl font-black mb-6 uppercase italic">¿Listo para jugar?</h4>
            )}
            <button 
              onClick={resetGame}
              className="flex items-center gap-2 px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition-all active:scale-95 shadow-lg shadow-purple-600/30"
            >
              <RotateCcw className="w-5 h-5" />
              {isGameOver ? 'REINTENTAR' : 'EMPEZAR'}
            </button>
          </div>
        )}
      </div>

      <div className="mt-6 grid grid-cols-3 gap-2 md:hidden">
        <div />
        <button onClick={() => direction.y === 0 && setDirection({x: 0, y: -1})} className="p-4 bg-gray-200 dark:bg-gray-700 rounded-xl flex justify-center active:scale-90"><ChevronUp className="w-6 h-6" /></button>
        <div />
        <button onClick={() => direction.x === 0 && setDirection({x: -1, y: 0})} className="p-4 bg-gray-200 dark:bg-gray-700 rounded-xl flex justify-center active:scale-90"><ChevronLeft className="w-6 h-6" /></button>
        <button onClick={() => direction.y === 0 && setDirection({x: 0, y: 1})} className="p-4 bg-gray-200 dark:bg-gray-700 rounded-xl flex justify-center active:scale-90"><ChevronDown className="w-6 h-6" /></button>
        <button onClick={() => direction.x === 0 && setDirection({x: 1, y: 0})} className="p-4 bg-gray-200 dark:bg-gray-700 rounded-xl flex justify-center active:scale-90"><ChevronRight className="w-6 h-6" /></button>
      </div>

      <p className="mt-4 text-xs text-center text-gray-500 dark:text-gray-400 font-medium">
        Usa las flechas del teclado para moverte
      </p>
    </div>
  );
}
