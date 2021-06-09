import {useState} from "react";



type AddAction<T> = {
  type: 'add'
  payload: T
}

type DeleteAction = {
  type: 'remove'
  payload: number
}

type UpdateActionHash = {
  type: 'updateHash'
  payload: number
  hash: string
  proof?: boolean
}

export interface ChainBlock {
  id: number;
  hash?: string;
  previousHash: string;
  proof?: boolean
}


export function blocksReducer(state: ChainBlock[], action: Action<ChainBlock>): ChainBlock[] {
  switch (action.type) {
    case "add":
      return [...state, action.payload]
    case "remove":
      return state.filter((chainBlock: ChainBlock) => action.payload !== chainBlock.id)
    case "updateHash": {
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
          return [...unchangedBlocks, ...[{...changedBlock, hash: action.hash, proof: action.proof}, {
            ...nextBlock,
            previousHash: action.hash
          }]]
        }
        return [...unchangedBlocks, {...changedBlock, hash: action.hash, proof: action.proof}]
      }
      return state
    }
    default:
      return state

  }
}



export type Action<T> = AddAction<T> | DeleteAction | UpdateActionHash;


export function useReducer<T>(reducer: (state: T[], action: Action<T>) => T[], initialState: T[]): [T[], (action: Action<T>) => void] {
  const [state, setState] = useState(initialState);

  function dispatch(action: Action<T>) {
    const nextState = reducer(state, action);
    setState(nextState);
  }

  return [state, dispatch];
}
