"use client"
import React, { useState, useRef, MouseEvent } from 'react';
interface Log {
  x: number,
  y: number
}
const Home: React.FC = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const initialPosition = useRef({ x: 0, y: 0 });
  const circleRef = useRef<HTMLDivElement>(null);
  const [logs, setLogs] = useState<Log[]>([]);
  const [replayPosition, setReplayPosition] = useState({ x: 0, y: 0 })
  const [replaying, setReplaying] = useState(false);
  const [selectedSpot, setSelectedSpot] = useState(-1)
  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    initialPosition.current = { x: e.clientX - position.x, y: e.clientY - position.y };
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Backspace' || e.key === 'Delete') {
      e.preventDefault()
      if (selectedSpot !== -1) {
        setLogs((prevLogs) => prevLogs.filter((_, i) => i !== selectedSpot));
        setSelectedSpot(-1);
      }
    }
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (isDragging && circleRef.current) {
      const maxX = circleRef.current.parentElement!.offsetWidth - circleRef.current.offsetWidth;
      const maxY = circleRef.current.parentElement!.offsetHeight - circleRef.current.offsetHeight;

      const newCenterX = e.clientX - initialPosition.current.x
      const newCenterY = e.clientY - initialPosition.current.y

      const newX = Math.min(maxX, Math.max(0, newCenterX));
      const newY = Math.min(maxY, Math.max(0, newCenterY));

      setPosition({ x: newX, y: newY });
    }
  };


  const handleMouseUp = () => {
    setIsDragging(false);
    if (position.x !== (logs.at(-1)?.x) && position.y !== (logs.at(-1)?.y)) setLogs([...logs, {
      x: position.x,
      y: position.y
    }]);
  };
  function replay() {
    setReplaying(true);
    setReplayPosition({ x: 0, y: 0 });
    const totalDuration = logs.length * 1000;
    setTimeout(() => {
      logs.forEach((log, i) => {
        setTimeout(() => {
          setReplayPosition(log);
        }, i * 1000);
      });

      setTimeout(() => {
        setReplaying(false);
      }, totalDuration);
    }, 1000);
  }


  return (
    <main
      className="min-h-screen grid grid-cols-4 justify-center items-center"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div
        className="bg-[#272934] w-full h-full relative col-span-3"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <div
          ref={circleRef}
          className={`w-20 h-20 border border-rose-500 bg-rose-500 bg-opacity-20 rounded-full absolute ${isDragging ? 'opacity-70' : 'opacity-100'} cursor-move hover:cursor-grab`}
          style={{
            top: `${replaying ? replayPosition.y : position.y}px`,
            left: `${replaying ? replayPosition.x : position.x}px`,
            transition: replaying ? 'all 1s ease' : "",
          }}
        ></div>
        {logs.map((log: Log, index: number) => {
          return <div onClick={() => setSelectedSpot(index)} key={index} className={`p-2 rounded-md transition-colors ${selectedSpot === index ? "bg-yellow-600 text-yellow-400" : "bg-purple-600 text-purple-400"} bg-opacity-30 w-10 relative`} style={{
            top: `${log.y}px`,
            left: `${log.x}px`,

          }}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
            </svg>

          </div>
        })}
      </div>
      <div className="bg-[#1f2129] w-full h-full p-4 cols-span-1">
        <div className="grid grid-cols-2 gap-3">
          {logs.length === 0 && <>
            {[1, 1, 1].map((_, index: number) => {
              return <div key={index} className="group rounded-md bg-[#17181e] p-4 shadow-lg flex flex-row items-center gap-3 animate-pulse">
              </div>
            })}
          </>}
          {logs.map((log: Log, index: number) => {
            return <div key={index} className="group rounded-md bg-[#17181e] p-2 shadow-lg flex flex-row items-center gap-3">
              <div className={`p-2 rounded-md transition-colors ${selectedSpot === index ? "bg-yellow-600 text-yellow-400" : "bg-purple-600 text-purple-400"} bg-opacity-30 w-10`}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
                </svg>

              </div>
              <div className="flex flex-col gap-2 items-center justify-center">
                <h1 className="text-lg text-white">Move</h1>
              </div>
              <div onClick={() => {
                setLogs(logs.filter((_, i) => i !== index))
              }} className="opacity-0 transition-all cursor-pointer group-hover:opacity-100 relative -right-7 -top-5 bg-red-600 text-red-400 bg-opacity-30 size-7 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>

              </div>
            </div>
          })}
        </div>
        {logs.length > 3 && (<div className="w-full flex items-center justify-center mt-3">
          <button className="rounded-md px-4 py-2 bg-purple-500 bg-opacity-40 text-white" onClick={replay}>Replay</button>
        </div>)}
      </div>
    </main >
  );
};

export default Home;
