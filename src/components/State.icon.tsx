import { useEffect, useState } from "react";

export default function State({
    playing,
    setPlaying,
    amount
}: {
    playing: boolean,
    setPlaying: () => any,
    amount: number
}) {
    const [indice, setIndice] = useState(0)
    useEffect(() => {
        let intervalId: NodeJS.Timeout;

        if (playing) {
            intervalId = setInterval(() => {
                setIndice((prevIndice: number) => ++prevIndice)
            }, 1000);
        }else{
            setIndice(0)
        }

        return () => {
            clearInterval(intervalId);
        };
    }, [playing, amount]);

    return (
        <>

            {playing ? (
                <div className="w-10 flex items-center justify-center p-2">
                <div className="relative w-6 h-6 animate-progress">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                        <circle
                            className="text-purple-400 text-opacity-30 stroke-current"
                            strokeWidth="10"
                            cx="50"
                            cy="50"
                            r="40"
                            fill="transparent"
                        ></circle>
                        <circle
                            className="text-indigo-600 progress-ring__circle stroke-current"
                            strokeWidth="10"
                            strokeLinecap="round"
                            cx="50"
                            cy="50"
                            r="40"
                            fill="transparent"
                            strokeDasharray="400"
                            strokeDashoffset={`calc(400 - (5 * (100 / ${amount}) * ${indice}) / 2)`}
                        ></circle>
                    </svg>
                </div>
                </div>
            ) : (
                <div onClick={() => setPlaying()} className={`cursor-pointer p-2 rounded-md transition-colors bg-purple-600 text-purple-400 bg-opacity-30 w-10 relative`}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
                    </svg>
                </div>
            )}
        </>
    );
}
