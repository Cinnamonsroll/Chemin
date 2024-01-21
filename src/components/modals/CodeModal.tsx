import { AnimatePresence, motion } from "framer-motion";
import Modal from "../Modal";

export function CodeModal({
    code,
    showModal,
    setShowModal
}: {
    code: string
    showModal: boolean,
    setShowModal: (arg: any) => void
}) {
    const syntaxHighlight = (code: string) => {
        const keywords = ['class', 'def'];
const numbers = /\d+(\.\d+)?/g

        code = code.replace(
            new RegExp(keywords.join('|'), 'g'),
            (match) => `<span class="keyword">${match}</span>`
        );
        code = code.replace(
            numbers,
            (match) => `<span class="number">${match}</span>`
          );

        return code
    };

    return (
        <AnimatePresence>
            <motion.div
                key="code-modal"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
            >
                <Modal
                    showModal={showModal}
                    setShowModal={() => setShowModal(undefined)}
                    bgColor="bg-[#1f2129]"
                >
                    <div className="modal flex items-center justify-start flex-col w-1/2 h-auto transform overflow-hidden bg-[#1f2129] align-middle shadow-2xl transition-all sm:max-w-md sm:rounded-md">
                        <div className="flex items-center justify-center flex-row gap-3 h-full p-3">
                            <div className="bg-[#2b2d31] p-4 rounded-md border border-[#313338]">
                                <pre className="text-white" dangerouslySetInnerHTML={{ __html: syntaxHighlight(code) }} />
                            </div>
                        </div>
                    </div>
                </Modal>
            </motion.div>
        </AnimatePresence>
    );
}
