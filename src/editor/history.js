export class HistoryManager {
    constructor(limit = 50) {
        this.history = [""];
        this.index = 0;
        this.limit = limit;
    }

    push(content) {
        if (this.index < this.history.length - 1) {
            this.history = this.history.slice(0, this.index + 1);
        }
        
        if (this.history[this.index] !== content) {
            this.history.push(content);
            if (this.history.length > this.limit) this.history.shift();
            this.index = this.history.length - 1;
        }
    }

    undo() {
        if (this.index > 0) {
            this.index--;
            return this.history[this.index];
        }
        return null;
    }

    redo() {
        if (this.index < this.history.length - 1) {
            this.index++;
            return this.history[this.index];
        }
        return null;
    }
}