import React, { useState, useRef } from "react";

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function CuteMemoryGame() {
  const EMOJIS = ["🐰", "🐱", "🐻", "🐼", "🐸", "🐤",
                  "🐶", "🦊", "🦁", "🐯", "🦉", "🐧"]; 
  const MAX_MOVES = 20;

  const [cards, setCards] = useState(() =>
    shuffle([...EMOJIS, ...EMOJIS]).map((v, i) => ({
      id: i,
      value: v,
      revealed: false,
      matched: false,
    }))
  );
  const [selected, setSelected] = useState([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const lock = useRef(false);

  const resetGame = () => {
    setCards(
      shuffle([...EMOJIS, ...EMOJIS]).map((v, i) => ({
        id: i,
        value: v,
        revealed: false,
        matched: false,
      }))
    );
    setSelected([]);
    setMoves(0);
    setMatches(0);
    setGameOver(false);
    lock.current = false;
  };

  const handleFlip = (index) => {
    if (lock.current || gameOver) return;
    const c = cards[index];
    if (!c || c.revealed || c.matched) return;

    const next = cards.map((card, i) => (i === index ? { ...card, revealed: true } : card));
    setCards(next);

    if (selected.length === 0) {
      setSelected([index]);
      return;
    }

    if (selected.length === 1) {
      const first = selected[0];
      const second = index;

      if (first === second) return;

      setSelected([first, second]);
      setMoves((m) => {
        const newMoves = m + 1;
        if (newMoves >= MAX_MOVES && matches < EMOJIS.length) {
          setGameOver(true);
        }
        return newMoves;
      });

      if (next[first].value === next[second].value) {
        const matched = next.map((card, i) =>
          i === first || i === second ? { ...card, matched: true } : card
        );
        setTimeout(() => {
          setCards(matched);
          setMatches((m) => m + 1);
          setSelected([]);
          if (matches + 1 === EMOJIS.length) {
            setGameOver(true); // win condition
          }
        }, 300);
      } else {
        lock.current = true;
        setTimeout(() => {
          const flippedBack = next.map((card, i) =>
            i === first || i === second ? { ...card, revealed: false } : card
          );
          setCards(flippedBack);
          setSelected([]);
          lock.current = false;
        }, 800);
      }
    }
  };

  const wrapperStyle = (isFlipped) => ({
    width: "100%",
    height: "100%",
    position: "relative",
    transformStyle: "preserve-3d",
    transition: "transform 520ms cubic-bezier(.2,.8,.2,1)",
    transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
    willChange: "transform",
  });

  const faceStyle = {
    position: "absolute",
    inset: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "18px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.12)", // ✨ soft shadow
    padding: "8px", // ✨ subtle padding
    backfaceVisibility: "hidden",
    WebkitBackfaceVisibility: "hidden",
  };

  const backFaceStyle = {
    ...faceStyle,
    transform: "rotateY(180deg)",
  };

  return (
    
    <div className="w-full max-w-3xl mx-auto p-6">
      {/* Header Bar */}
<header className="w-full bg-gradient-to-r from-pink-100 via-purple-100 to-blue-100 shadow-md py-6 mb-10">
  <h1 className="text-center text-5xl font-extrabold text-gray-800 tracking-wide drop-shadow-sm">
    🎀 Memo Match 🎀
  </h1>
</header>

      {/* Header */}
      <div className="text-center mb-16">
        <h2 className="text-7xl font-extrabold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent mb-10 tracking-wider drop-shadow-lg">
          ✨ Cute Memory ✨
        </h2>
        <p className="text-gray-800 font-semibold text-2xl leading-relaxed px-10 py-6 bg-white rounded-2xl shadow-md inline-block">
          Match all the cute pairs within{" "}
          <span className="text-pink-600 font-bold">{MAX_MOVES} moves</span> 💖
        </p>
      </div>

      {/* Stats & Reset */}
      <div className="bg-gradient-to-r from-pink-100 via-purple-100 to-pink-50 rounded-3xl shadow-xl p-10 mb-14">
        <div className="flex justify-around items-center w-full px-4 gap-10">
          
         <div className="stats-container">
  {/* Moves */}
  <div className="stat-card pink">
    <div className="stat-value">{moves}</div>
    <div className="stat-label">Moves</div>
  </div>

  {/* Matches */}
  <div className="stat-card purple">
    <div className="stat-value">{matches}</div>
    <div className="stat-label">Matches</div>
  </div>
</div>

          {/* Reset Button */}
          <button
            onClick={resetGame}
            className="reset-btn"
          >
            🔄 Reset
          </button>
        </div>
      </div>

      {/* Game Over or Board */}
      {gameOver ? (
        <div className="text-center my-6 p-6">
          {matches === EMOJIS.length ? (
            <p className="text-3xl font-extrabold py-8 px-12 bg-white rounded-2xl shadow-lg inline-block">
              🎉 You Win! Amazing memory skills! 🎉
            </p>
          ) : (
            <p className="text-3xl font-extrabold py-8 px-12 bg-white rounded-2xl shadow-lg inline-block text-red-500">
              😢 Game Over! You ran out of moves.
            </p>
          )}
        </div>
      ) : (
        <div className="w-full max-w-5xl mx-auto grid grid-cols-6 gap-6 p-12 bg-gradient-to-br from-pink-50 to-purple-50 rounded-3xl shadow-inner">
          {cards.map((card, index) => {
            const isFlipped = card.revealed || card.matched;
            return (
              <div
                key={card.id}
                onClick={() => handleFlip(index)}
                className="relative cursor-pointer perspective hover:scale-105 transition-transform duration-200"
                style={{ width: "112px", height: "144px" }}
              >
                <div style={wrapperStyle(isFlipped)}>
                  <div
                    style={{
                      ...faceStyle,
                      background: "#ffd6e0",
                      color: "#c21f3a",
                      fontSize: 28,
                    }}
                  >
                    ❓
                  </div>
                  <div
                    style={{
                      ...backFaceStyle,
                      background: "#ffffff",
                      fontSize: 36,
                    }}
                  >
                    {card.value}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      
      {/* <div className="mt-14 text-center">
        <div className="text-xl text-gray-800 bg-gradient-to-r from-yellow-100 to-orange-100 border border-yellow-200 px-12 py-6 rounded-full inline-block shadow-md font-medium tracking-wide">
          💡 <span className="font-bold">Pro tip:</span> Match all pairs within{" "}
          <span className="text-pink-600 font-extrabold">{MAX_MOVES} moves!</span>
        </div>
      </div> */}
    </div>
  );
}
