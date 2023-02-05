import { Service } from "typedi";

export interface MessageListener {
    (message: string): void;
}

export abstract class StreamedOutput {

    private messages: string[] = [];
    private listeners: MessageListener[] = [];

    clearMessages() {
        this.messages = [];
    }

    appendMessage(message: string) {
        this.messages.push(message);
        this.notifyListeners(message);
    }

    attachListener(listener: MessageListener) {
        for(const message of this.messages) {
            listener(message);
        }
        this.listeners.push(listener);
    }

    private notifyListeners(message: string) {
        for(const listener of this.listeners) {
            listener(message);
        }
    }
}

@Service()
export class StandardOutput extends StreamedOutput {

}

@Service()
export class StandardError extends StreamedOutput {

    appendMessage(message: string): void {
        super.appendMessage("[Error]: " + message);
    }
}

