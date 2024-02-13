import {FC, useEffect, useRef, useState} from "react";
import {clsx} from "clsx";

export const VideoRecorder: FC = () => {

    const [hasPermission, setHashPermission] = useState(false);
    const [stream, setStream] = useState<MediaStream>();
    const [recordingStatus, setRecordingStatus] = useState<'recording' | 'paused' | 'stopped'>('stopped');

    const liveStreamVideo = useRef<HTMLVideoElement>(null);
    const mediaRecorder = useRef<MediaRecorder>();

    const [recordedVideo, setRecordedVideo] = useState<string>();

    const getCameraStream = async () => {
        if ('MediaRecorder' in window) {
            try {
                return await navigator.mediaDevices.getUserMedia({video: true, audio: true});
            } catch (e) {
                console.error(e);
            }
        } else {
            alert("The MediaRecorder API is not supported in your browser.");
        }
    }

    const handleStartVideoStream = async () => {
        const _stream = await getCameraStream();
        setHashPermission(true);
        setStream(_stream);
    }

    const startVideoRecord = () => {
        if (stream) {
            mediaRecorder.current = mediaRecorder.current = new MediaRecorder(stream);
            mediaRecorder.current.start();
            setRecordingStatus('recording');
            setRecordedVideo('');
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
        if (mediaRecorder.current) {
            mediaRecorder.current.stop();
            setRecordingStatus('stopped');
            mediaRecorder.current.ondataavailable = (event) => {
                const blob = new Blob([event.data], {type: 'video/webm'});
                setRecordedVideo(URL.createObjectURL(blob))
            }
        }
    }

    useEffect(() => {
        if (stream && liveStreamVideo.current) {
            liveStreamVideo.current.srcObject = stream;
        }
    }, [stream]);

    return (
        <div className={'flex flex-col gap-2 items-center'}>
            <button className={'rounded bg-blue-200 px-2 py-1'} onClick={handleStartVideoStream}>
                Start Video
            </button>
            <video className={clsx('w-96 aspect-video', !hasPermission && 'hidden')} muted autoPlay
                   ref={liveStreamVideo}/>
            {
                hasPermission && !!stream && <div className={'flex items-center gap-2'}>
                    {
                        recordingStatus === 'stopped' &&
                        <button className={'rounded bg-red-200 px-2 py-1'} onClick={startVideoRecord}>
                            Record
                        </button>
                    }
                    {
                        recordingStatus === 'paused' &&
                        <button className={'rounded bg-red-200 px-2 py-1'} onClick={resumeVideoRecord}>
                            Resume
                        </button>
                    }
                    {
                        recordingStatus === 'recording' &&
                        <button className={'rounded bg-red-200 px-2 py-1'} onClick={pauseVideoRecord}>
                            Pause
                        </button>
                    }
                    {
                        ['recording', 'paused'].includes(recordingStatus) &&
                        <button className={'rounded bg-red-200 px-2 py-1'} onClick={stopVideoRecord}>
                            Stop
                        </button>
                    }
                </div>
            }
            {
                !!recordedVideo && <div className={'flex flex-col items-center gap-2'}>
                    <video className={'w-96 aspect-video'} controls>
                        <source src={recordedVideo} type={'video/webm'}/>
                    </video>
                    <a download={'video.webm'} href={recordedVideo}>
                        <button className={'rounded bg-blue-200 px-2 py-1'}>Download Video</button>
                    </a>
                </div>
            }
        </div>
    )
}
