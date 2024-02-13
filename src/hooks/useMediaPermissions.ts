import {useState} from "react";

export const useMediaPermissions = () => {

    const [hasMediaPermissions, setHasMediaPermissions] = useState(false);
    const [permissionDenied, setPermissionDenied] = useState(false);
    const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);

    const requestMediaPermissions = async (mode: 'video-audio' | 'screen') => {
        try {
            const stream = await (mode === 'screen' ? navigator.mediaDevices.getDisplayMedia({
                video: true,
            }) : navigator.mediaDevices.getUserMedia({
                audio: true,
                video: true,
            }));
            setHasMediaPermissions(true);
            setMediaStream(stream);
            return stream;
        } catch (error) {
            setPermissionDenied(true);
        }
    };

    return {hasMediaPermissions, permissionDenied, mediaStream, requestMediaPermissions};
}
