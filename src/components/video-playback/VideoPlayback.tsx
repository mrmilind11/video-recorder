import {FC} from 'react';
import {ActionButton} from "../action-button/ActionButton.tsx";
import {ArrowDownTrayIcon, ArrowUturnLeftIcon} from "@heroicons/react/24/solid";

export const VideoPlayback: FC<{ recordedVideo: string; recordAgainAction?: () => void }> = ({
                                                                                                 recordedVideo,
                                                                                                 recordAgainAction
                                                                                             }) => {
    return (
        <div className={'flex flex-col items-center gap-2'}>
            <video className={'w-96 aspect-video'} controls>
                <source src={recordedVideo} type={'video/webm'}/>
            </video>
            <div className={'flex items-center gap-2'}>
                <button>
                    <ArrowUturnLeftIcon className={'w-6 h-6'} onClick={recordAgainAction}/>
                    <span hidden>Retry</span>
                </button>
                <a download={'video.webm'} href={recordedVideo}>
                    <ActionButton className={'flex items-center gap-1'}>
                        <ArrowDownTrayIcon className={'w-6 h-6'}/>
                        Download Video
                    </ActionButton>
                </a>
            </div>
        </div>
    )
}
