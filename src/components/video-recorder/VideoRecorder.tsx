import {FC, useEffect, useRef, useState} from "react";
import {clsx} from "clsx";
import {VideoPlayback} from "../video-playback/VideoPlayback.tsx";
import {useMediaPermissions} from "../../hooks/useMediaPermissions.ts";
import {PermissionDenied} from "../permission-denied/PermissionDenied.tsx";
import {PauseCircleIcon, PlayCircleIcon, StopCircleIcon} from "@heroicons/react/24/solid";
import {ActionButton} from "../action-button/ActionButton.tsx";

const MAX_RECORD_TIME = 60 * 60 * 1000;

export const VideoRecorder: FC = () => {

    const [recordingStatus, setRecordingStatus] = useState<'recording' | 'paused' | 'stopped'>('stopped');

    const liveStreamVideo = useRef<HTMLVideoElement>(null);
    const mediaRecorder = useRef<MediaRecorder>();

    const [recordedVideo, setRecordedVideo] = useState<string>();

    const {mediaStream, permissionDenied, hasMediaPermissions, requestMediaPermissions} = useMediaPermissions();

    const recordingTimeoutRef = useRef<any>();

    const startVideoRecord = () => {
        if (mediaStream) {
            mediaRecorder.current = mediaRecorder.current = new MediaRecorder(mediaStream);
            mediaRecorder.current.start();
            setRecordingStatus('recording');
            setRecordedVideo('');

            recordingTimeoutRef.current = setTimeout(() => {
                stopVideoRecord();
            }, MAX_RECORD_TIME);
        }
    }

    const pauseVideoRecord = () => {
        if (mediaRecorder.current) {
            mediaRecorder.current.pause();
            setRecordingStatus('paused');
        }
    }

    const resumeVideoRecord = () => {
        if (mediaRecorder.current) {
            mediaRecorder.current.resume();
            setRecordingStatus('recording');
        }
    }

    const stopVideoRecord = () => {
        clearTimeout(recordingTimeoutRef.current);
        if (mediaRecorder.current) {
            mediaRecorder.current.stop();
            setRecordingStatus('stopped');
            mediaRecorder.current.ondataavailable = (event) => {
                const blob = new Blob([event.data], {type: 'video/webm'});
                console.log(event.data);
                console.log(URL.createObjectURL(blob));
                setRecordedVideo(URL.createObjectURL(blob))
            }
        }
    }

    useEffect(() => {
        if (mediaStream && liveStreamVideo.current) {
            liveStreamVideo.current.srcObject = mediaStream;
        }
    }, [mediaStream]);

    return (
        <div className={'flex flex-col gap-4 items-center'}>
            {
                recordingStatus === 'recording' &&
                <div className={'fixed rounded-full h-5 w-5 top-2 right-2 animate-pulse bg-red-600'}/>
            }
            {
                !hasMediaPermissions && !permissionDenied &&
                <div className={'flex flex-row gap-2 items-center'}>
                    <ActionButton onClick={() => requestMediaPermissions('video-audio')}>Record Video</ActionButton>
                    <ActionButton onClick={() => requestMediaPermissions('screen')}>Record Screen</ActionButton>
                </div>
            }
            {
                permissionDenied && <PermissionDenied/>
            }
            {
                <div className={clsx('w-full sm:w-96 h-auto', (!hasMediaPermissions || recordedVideo) && 'hidden')}>
                    <video className={'h-full w-full'} muted autoPlay
                           ref={liveStreamVideo}/>
                </div>
            }
            {
                !recordedVideo && hasMediaPermissions && !!mediaStream && <>
                    <div className={'flex items-center gap-2 fixed bottom-5 sm:static'}>
                        {
                            recordingStatus === 'stopped' &&
                            <button className={'rounded-full bg-red-500 border-4 border-red-800 w-12 aspect-square'}
                                    onClick={startVideoRecord}>
                                <span hidden>Record</span>
                            </button>
                        }
                        {
                            recordingStatus === 'paused' &&
                            <button title={'resume'} onClick={resumeVideoRecord}>
                                <PlayCircleIcon className={'w-12 aspect-square text-gray-800'} title={'pause'}/>
                                <span hidden>Resume</span>
                            </button>
                        }
                        {
                            recordingStatus === 'recording' &&
                            <button onClick={pauseVideoRecord}>
                                <PauseCircleIcon className={'w-12 aspect-square text-gray-800'} title={'pause'}/>
                                <span hidden>Pause</span>
                            </button>
                        }
                        {
                            ['recording', 'paused'].includes(recordingStatus) &&
                            <button title={'resume'} onClick={stopVideoRecord}>
                                <StopCircleIcon className={'w-12 aspect-square text-red-500'} title={'pause'}/>
                                <span hidden>Resume</span>
                            </button>
                        }
                    </div>
                </>
            }
            {
                !!recordedVideo &&
                <VideoPlayback recordedVideo={recordedVideo} recordAgainAction={() => setRecordedVideo('')}/>
            }
        </div>
    )
}
