const MAX_HISTORY = 100;
    
class HistoryManager {
    isEqual(a, b) {
        return JSON.stringify(a) === JSON.stringify(b);
    }
    
    constructor(initialState) {
        this.undoStack = []
        this.redoStack = []
        this.currentState = initialState
    }

    saveState(newState) {
        const clonedNewState = this.clone(newState)
        const lastUndoState = this.undoStack[this.undoStack.length - 1]

        if (lastUndoState && this.isEqual(clonedNewState, lastUndoState)) {
            return
        }

        this.undoStack.push(this.clone(this.currentState));
        if (this.undoStack.length > MAX_HISTORY) this.undoStack.shift()

        this.currentState = clonedNewState
        this.redoStack = []
    }
    
    clear(initialState) {
        this.undoStack = []
        this.redoStack = []
        this.currentState = initialState
    }

    undo() {
        if (this.undoStack.length === 0) {
            console.log("Nothing to undo")
        } else {
            this.redoStack.push(this.clone(this.currentState))
            this.currentState = this.undoStack.pop()
        }
        matrixData = this.clone(this.currentState)
        drawMatrix()
    }

    redo() {
        if (this.redoStack.length === 0) {
            console.log("Nothing to redo")
        } else {
            this.undoStack.push(this.clone(this.currentState))
            this.currentState = this.redoStack.pop()
        }
        matrixData = this.clone(this.currentState)
        drawMatrix()
    }

    clone(state) {
        return JSON.parse(JSON.stringify(state))
    }

    getCurrentState() {
        return this.clone(this.currentState)
    }
}

