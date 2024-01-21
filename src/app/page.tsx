"use client"
import Clear from '@/components/Clear.icon';
import Load from '@/components/Load.icon';
import Save from '@/components/Save.icon';
import State from '@/components/State.icon';
import { Toaster, toast } from 'sonner'
import React, { useState, useRef, MouseEvent, useEffect } from 'react';
import Export from '@/components/Export.icon';
import { types } from '@/components/icons';
import { CodeModal } from '@/components/modals/CodeModal';

interface Log {
  type: number,
  data: {
    x?: number,
    y?: number,
    z?: number
    time?: number
  }
}

const Home: React.FC = () => {
  const [logsName, setLogsName] = useState<string>("Untitled auton")
  const [code, setCode] = useState<string>(``)
  const [logs, setLogs] = useState<Log[]>([]);
  const [autos, setAutos] = useState<Array<{ id: string; name: string; logs: Log[] }>>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false)
  const [playing, setPlaying] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0, z: 270 });
  const initialPosition = useRef({ x: 0, y: 0, z: 270 });
  const [replayPosition, setReplayPosition] = useState({ x: 0, y: 0, z: 270 })
  const circleRef = useRef<HTMLDivElement>(null);
  const [selectedSpot, setSelectedSpot] = useState(-1)
  const [currentStep, setCurrentStep] = useState(0);

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    initialPosition.current = { x: e.clientX - position.x, y: e.clientY - position.y, z: 270 };
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
      let angle = 270
      const prevLog = logs[logs.length - 1]?.data || { x: 0, y: 0, z: 270 };
      if (prevLog.x !== undefined && prevLog.y !== undefined && prevLog.z !== undefined) {
        const a = prevLog.x - newX
        const b = prevLog.y - newY
        angle = Math.atan2(b, a) - prevLog.z
      }
      setPosition({ x: newX, y: newY, z: angle });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (position.x !== (logs.at(-1)?.data.x) && position.y !== (logs.at(-1)?.data.y)) setLogs([...logs, {
      type: 0,
      data: {
        x: position.x,
        y: position.y,
        z: position.z
      }
    }]);
  };

  useEffect(() => {
    if (playing) {
      const intervalId = setInterval(() => {
        if (currentStep < logs.filter((log: Log) => log.type === 0).length) {

          setReplayPosition({
            x: logs.filter((log: Log) => log.type === 0)[currentStep].data.x || 0,
            y: logs.filter((log: Log) => log.type === 0)[currentStep].data.y || 0,
            z: logs.filter((log: Log) => log.type === 0)[currentStep].data.z || 270,
          });
          setCurrentStep(currentStep + 1);
        } else {
          clearInterval(intervalId);
          setPlaying(false);
          setCurrentStep(0);
          setReplayPosition({
            x: 0,
            y: 0,
            z: 270
          })
        }
      }, 1000);

      return () => clearInterval(intervalId);
    } else {
      setPlaying(false);
      setCurrentStep(0);
    }
  }, [playing, currentStep, logs.filter((log: Log) => log.type === 0)]);
  useEffect(() => {
    if (loading) {
      const storedAutos = JSON.parse(localStorage.getItem('autos') || '[]');
      setAutos(storedAutos);
    }
  }, [loading]);

  const handlePlayPause = () => {
    setPlaying((prevPlaying) => !prevPlaying);
  };

  return (
    <>
      <Toaster />
      <CodeModal showModal={showModal} setShowModal={setShowModal} code={code} />
      <main
        className="min-h-screen grid grid-cols-4 justify-center items-center overflow-hidden"
        tabIndex={0}
      >
        
        <div
          className="bg-[#272934] w-full h-full relative col-span-3"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onKeyDown={handleKeyDown}
        >
          <div
            ref={circleRef}
            className={` w-20 h-20 border border-rose-500 bg-rose-500 bg-opacity-20 rounded-full absolute ${isDragging ? 'opacity-70' : 'opacity-100'} cursor-move hover:cursor-grab flex justify-center`}
            style={{
              top: `${playing ? replayPosition.y : position.y}px`,
              left: `${playing ? replayPosition.x : position.x}px`,
              transition: playing ? 'all 1s ease' : "",
              transform: `rotate(${playing ? replayPosition.z : position.z}deg)`
            }}
          >
            <div className="size-5 rounded-md p-2 bg-black m-2"></div>
          </div>
          {logs.filter((log: Log) => log.type === 0).map((log: Log, index: number) => {
            return <div onClick={() => setSelectedSpot(index)} key={index} className={`size-10 rounded-md transition-colors ${selectedSpot === index ? "bg-yellow-600 text-yellow-400" : "bg-purple-600 text-purple-400"} bg-opacity-30 absolute flex items-center justify-center`} style={{
              top: `${(log?.data?.y || 0) + 20}px`,
              left: `${(log?.data?.x || 0) + 20}px`,

            }}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
              </svg>

            </div>
          })}
        </div>
        <div className="bg-[#1f2129] w-full h-full cols-span-1 gap-2">
          <div className="w-full h-full p-4">
            {loading ? <>
              <div className="flex p-1 gap-2 flex-col">
                {autos.map((auto: { id: string; name: string; logs: Log[]; }, index: number) => {
                  return <div onClick={() => {
                    setLogs(auto.logs)
                    setLogsName(auto.name)
                    setLoading(false)
                    toast.success(`${auto.name} loaded successfully!`)
                  }} key={index} className="cursor-pointer rounded-md bg-[#17181e] p-2 shadow-lg flex flex-row items-center text-white">
                    <p>{auto.name}</p>
                  </div>
                })}
              </div>
            </> : <>
              <label className="relative ">
                <input
                  value={logsName || ""}
                  onInput={(e) => setLogsName(e.currentTarget.value)}
                  type="text"
                  className={`fancy-input h-10 w-full px-6 pl-0 text-lg text-white border-b-2 bg-transparent ${logsName ? "border-purple-600" : "border-gray-500 focus:border-purple-600 "} border-opacity-50 outline-none focus:text-white transition duration-200`}
                />
                <span
                  className={`text-lg text-opacity-80 absolute -left-6 mx-6 transition duration-200 input-text ${logsName
                    ? "text-purple-600 transform bg-transparent -translate-y-5 top-[0px]"
                    : "text-white top-[2px]"
                    }`}
                >
                  Auton Name
                </span>
              </label>
              <div className="grid grid-cols-2 gap-3 mt-3">
                {logs.length === 0 && <>
                  {[1, 1, 1].map((_, index: number) => {
                    return <div key={index} className="group rounded-md bg-[#17181e] p-6 shadow-lg flex flex-row items-center gap-3 animate-pulse">
                    </div>
                  })}
                </>}
                {logs.map((log: Log, index: number) => {
                  return <div key={index} className="group rounded-md bg-[#17181e] p-2 shadow-lg flex flex-row items-center gap-3">
                    <div className={`p-2 rounded-md transition-colors ${selectedSpot === index ? "bg-yellow-600 text-yellow-400" : "bg-purple-600 text-purple-400"} bg-opacity-30 w-10`}>
                      {types[log.type].icon}
                    </div>
                    <div className="flex flex-col gap-2 items-center justify-center">
                      <h1 className="text-lg text-white">{types[log.type].name}</h1>
                    </div>
                    <div onClick={() => {
                      setLogs(logs.filter((_, i) => i !== index))
                    }} className="opacity-0 transition-all cursor-pointer group-hover:opacity-100 relative -right-7 -top-6 bg-red-600 text-red-400 bg-opacity-30 size-7 rounded-full flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                      </svg>
                    </div>
                  </div>
                })}
                <div onClick={() => {
                  setLogs([...logs, {
                    type: 2,
                    data: {
                      time: 1000
                    }
                  }])
                }} className="cursor-pointer rounded-md bg-[#17181e] p-2 shadow-lg flex flex-row items-center gap-3">
                  <div className={`p-2 rounded-md transition-colors bg-purple-600 text-purple-400 bg-opacity-30 w-10`}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                  </div>
                  <div className="flex flex-col gap-2 items-center justify-center">
                    <h1 className="text-lg text-white">Intake</h1>
                  </div>
                </div>
                <div onClick={() => {
                  setLogs([...logs, {
                    type: 3,
                    data: {
                      time: 1000
                    }
                  }])
                }} className="cursor-pointer rounded-md bg-[#17181e] p-2 shadow-lg flex flex-row items-center gap-3">
                  <div className={`p-2 rounded-md transition-colors bg-purple-600 text-purple-400 bg-opacity-30 w-10`}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                  </div>
                  <div className="flex flex-col gap-2 items-center justify-center">
                    <h1 className="text-lg text-white">Shooter</h1>
                  </div>
                </div>
              </div>
            </>
            }
          </div>
          <div className="w-full flex justify-center">
            <div className="flex gap-3 absolute bottom-0  p-2 rounded-t-md bg-[#17181e]">
              <State playing={playing} setPlaying={handlePlayPause} amount={logs.length} />
              <Clear clearLogs={() => {
                setLogs([])
                setPosition({ x: 0, y: 0, z: 0 })
              }} />
              <Export logs={logs} name={logsName} setShowModal={setShowModal} setCode={setCode} />
              <Save logs={logs} logsName={logsName} onSave={() => toast.success(`${logsName} saved successfully!`)} />
              <Load setLoading={setLoading} />

            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;