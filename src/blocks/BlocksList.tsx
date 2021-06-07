import {useState} from "react";


export interface ChainBlock {
    id: number;
    hash?: string;
    previousHash: string;
}

interface AddAction {
    type: 'add'
    payload: ChainBlock
}

interface DeleteAction {
    type: 'remove'
    payload: number
}

interface UpdateAction {
    type: 'update'
    payload: number
    hash: string
}


function blocksReducer(state: ChainBlock[], action: AddAction | DeleteAction | UpdateAction): ChainBlock[] {
    switch (action.type) {
        case "add":
            return [...state, action.payload]
        case "remove":
            return state.filter((chainBlock: ChainBlock) => action.payload !== chainBlock.id)
        case "update": {
            const changedBlock = state.find((block: ChainBlock) => block.id === action.payload);
            if (changedBlock) {
                const nextBlock = state.find((block: ChainBlock) => block.id === (changedBlock.id + 1));
                const unchangedBlocks = state.filter((block: ChainBlock) => {
                    if (!!nextBlock) {
                        return block.id !== action.payload && block.id !== nextBlock.id
                    }
                    return block.id !== action.payload
                });
                if (!!nextBlock) {
                    return [...unchangedBlocks, ...[{...changedBlock, hash: action.hash}, {
                        ...nextBlock,
                        previousHash: action.hash
                    }]]
                }
                return [...unchangedBlocks, {...changedBlock, hash: action.hash}]
            }
            return state
        }
        default:
            return state

    }
}

function useReducer(reducer: (state: ChainBlock[], action: AddAction | DeleteAction | UpdateAction) => ChainBlock[], initialState: ChainBlock[]): [ChainBlock[], (action: AddAction | DeleteAction | UpdateAction) => void] {
    const [state, setState] = useState(initialState);

    function dispatch(action: AddAction | DeleteAction | UpdateAction) {
        const nextState = reducer(state, action);
        setState(nextState);
    }

    return [state, dispatch];
}

function BlocksList() {

}

export default BlocksList
