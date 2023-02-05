import React, { useEffect, useRef, useState } from "react";

import "./AudioFilePlayer.scss";

export interface AudioFilePlayerProps {
    url: string | null;
}

const AudioFilePlayer = (props: AudioFilePlayerProps) => {

    const [isLoading, setIsLoading] = useState(true);
    const refAudioPlayer = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if(props.url === null || refAudioPlayer.current === null)
            return;
        const domAudioPlayerWrapper = document.createElement("div");
        const domAudio = document.createElement("audio");
        const domSource = document.createElement("source");
        domSource.src = props.url;
        domAudio.appendChild(domSource);
        domAudioPlayerWrapper.appendChild(domAudio);
        refAudioPlayer.current.appendChild(domAudioPlayerWrapper);

        const audioPlayer = new global.GreenAudioPlayer(domAudioPlayerWrapper);
        return () => {
            domAudioPlayerWrapper.remove();
        }
    }, [isLoading]);

    useEffect(() => {
        setIsLoading(props.url === null);
    }, [props.url]);

    return (
        <div className="AudioPlayer">
            { isLoading === true ? (
                <div className="AudioFilePlayer-Loading">
                    <span>Stahuji nahrávku ze serveru...</span>
                </div>
            ) : (
                <div className="AudioPlayer-Player" ref={refAudioPlayer} >
                </div>   
            )}

        </div>
    );
}

export default AudioFilePlayer;