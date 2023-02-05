
export interface IAudioFileCache {
    clear();
    appendContent(id: number, content: Blob);
    getContent(id: number): Blob | null;
    hasContent(id: number): boolean;
}

interface AudioContentRecord {
    id: number;
    content: Blob;
}

class AudioFileCache implements IAudioFileCache {

    private records: AudioContentRecord[] = [];

    clear() {
        this.records = [];
    }

    appendContent(id: number, content: Blob) {
        const record = this.findAudioRecord(id);
        if(record !== undefined) {
            record.content = content;
        } else {
            this.records.push({id, content});
        }
    }

    getContent(id: number): Blob | null {
        const record = this.findAudioRecord(id);
        return record === undefined ? null : record.content;
    }

    hasContent(id: number): boolean {
        return this.findAudioRecord(id) !== undefined;
    }

    private findAudioRecord(id: number): AudioContentRecord | undefined {
        return this.records.find(rec => rec.id === id);
    }
}

const cache = new AudioFileCache();

export function getAudioFileCache(): IAudioFileCache {
    return cache;
}
