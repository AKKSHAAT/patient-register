import React from "react";

const Loading: React.FC = () => (
    <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
        <div className="w-16 h-16 border-4 border-black border-dashed rounded-full animate-spin"></div>
    </div>
);
export const InlineLoading: React.FC = () => (
    <div className="inline">
        <div className="w-8 h-8 border-4 border-black border-dashed rounded-full animate-spin"></div>
    </div>
);

export default Loading;
