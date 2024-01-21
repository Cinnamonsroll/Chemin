import { useEffect } from 'react';
interface Log {
    type: number,
    data: {
        x?: number,
        y?: number,
        z?: number
        time?: number
    }
}
export default function Export({ logs, name, setShowModal, setCode }: {
    logs: Log[],
    name: string,
    setShowModal: (value: boolean) => void,
    setCode: (code: string) => void
}) {
    const generateCode = () => {
        let code = `[\n`;
        for (let log of logs) {
            switch (log.type) {
                case 0: {
                    code += `   (self.ctx.rotate, ${log.data.z}),\n`
                    code += `   (self.ctx.robot.move, (${log.data.x}, ${log.data.y})),\n`;
                    break;
                }
                case 1: { 
                    code += `   (self.ctx.wait, ${log.data.time}),\n`;
                    break; 
                }
            }
        }
        code += "]"
        setCode(code)
        setShowModal(true)
    }
    
    return (
        <div onClick={() => generateCode()} className={`cursor-pointer p-2 rounded-md transition-colors bg-purple-600 text-purple-400 bg-opacity-30 w-10 relative`}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
            </svg>
        </div>
    );
}
