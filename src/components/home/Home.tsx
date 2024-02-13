import {VideoRecorder} from "../video-recorder/VideoRecorder.tsx";

export const Home = () => {
    return (
        <div className={'max-w-2xl mx-5 sm:mx-auto my-5 flex flex-col gap-4'}>
            <VideoRecorder/>
        </div>
    );
}
