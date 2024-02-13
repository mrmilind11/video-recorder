import {VideoRecorder} from "../video-recorder/VideoRecorder.tsx";

export const Home = () => {
    return (
        <div className={'container max-w-2xl mx-5 sm:mx-auto my-5 flex flex-col gap-4'}>
            <h1 className={'text-4xl font-bold text-center'}>Welcome to the Video Recorder</h1>
            <VideoRecorder/>
        </div>
    );
}
