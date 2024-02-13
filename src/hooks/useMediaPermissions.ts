import {useEffect, useState} from "react";

export const useMediaPermissions = () => {

    const [hasMediaPermissions, setHasMediaPermissions] = useState(false);
    const [permissionDenied, setPermissionDenied] = useState(false);
    const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);

    const requestMediaPermissions = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: true,
                video: true,
            });
            setHasMediaPermissions(true);
            setMediaStream(stream);
            return stream;
        } catch (error) {
            setPermissionDenied(true);
        }
    };


    useEffect(() => {
        requestMediaPermissions();
    }, []);
    return {hasMediaPermissions, permissionDenied, mediaStream, requestMediaPermissions};
}
