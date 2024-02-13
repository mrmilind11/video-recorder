import React, {FC, PropsWithChildren} from 'react';
import {clsx} from "clsx";

export const ActionButton: FC<PropsWithChildren<{
    className?: string
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
}>> = ({onClick, className, children}) => {
    return <button className={clsx(className, 'bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded')}
                   onClick={onClick}>
        {children}
    </button>
}
