import { useEffect } from 'react';
interface Log {
    type: number,
    data: {
      x?: number,
      y?: number,
      time?: number
    }
  }
export default function Save({
    logs,
    logsName,
    onSave
}: {
    logs: Log[],
    logsName: string,
    onSave: () => void
}) {
    const handleSaveClick = () => {
        if (logsName.trim() === '') return

        const autos = JSON.parse(localStorage.getItem('autos') || '[]');
        const uniqueId = Date.now().toString();
        const newAuto = { id: uniqueId, name: logsName, logs };
        autos.push(newAuto);
        localStorage.setItem('autos', JSON.stringify(autos));
        onSave()
    };

    return (
        <button onClick={(e) => {
            e.stopPropagation()
            handleSaveClick()
        }} disabled={logsName.trim() === ''} className={`hover:cursor-position p-2 rounded-md transition-colors bg-purple-600 text-purple-400 bg-opacity-30 w-10 relative disabled:bg-opacity-20 disabled:cursor-not-allowed`}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9.75v6.75m0 0-3-3m3 3 3-3m-8.25 6a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" />
            </svg>
        </button>
    );
}
