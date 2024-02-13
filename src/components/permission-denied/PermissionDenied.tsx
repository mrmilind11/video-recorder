import {FC} from 'react';

export const PermissionDenied: FC = () => {
    return (
        <div className={'flex flex-col items-center gap-2'}>
            <h1 className={'text-4xl'}>Permission Denied</h1>
            <p className={'text-lg'}>You need to grant permission to use the camera and microphone to use this app.</p>
        </div>
    )
}
