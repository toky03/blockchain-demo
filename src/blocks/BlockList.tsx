import {Card, CardContent, Grid, IconButton, Typography} from "@material-ui/core";
import Block from "./Block";
import AddIcon from "@material-ui/icons/Add";
import React, {useEffect, useState} from "react";
import {cardStyle} from "../theming/theme";
import {useTranslation} from "react-i18next";

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
                const nextBlock = state.find((block: ChainBlock) => block.id === (changedBlock.id +1));
                const unchangedBlocks = state.filter((block: ChainBlock) => {
                    if(!!nextBlock){
                        return block.id !== action.payload &&  block.id !== nextBlock.id
                    }
                    return block.id !== action.payload
                });
                if(!!nextBlock){
                    return [...unchangedBlocks, ...[{...changedBlock, hash: action.hash}, {...nextBlock, previousHash: action.hash}]]
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


function BlockList() {

    const {t} = useTranslation();
    const [blocks, dispatch] = useReducer(blocksReducer, []);

    useEffect(() => {
        const firstBlock: ChainBlock = {id: 0, previousHash: '0000'}
        dispatch({type: 'add', payload: firstBlock});
    }, [])


    const blockChanged = (blockId: number, hash: string) => {
        dispatch({type: 'update', payload: blockId, hash})
    }

    function addBlock(): void {
        const lastBlock = readLastBlock();
        if (lastBlock && lastBlock.hash) {
            dispatch({type: 'add', payload: {id: lastBlock.id + 1, previousHash: lastBlock.hash}});
        }
    }

    function readLastBlock(): ChainBlock | undefined {
        const lastId: number = Math.max(...blocks.map((block: ChainBlock) => block.id));
        return blocks.find((block: ChainBlock) => block.id === lastId);
    }


    return (
        <div className={'blockList'}>
            <Grid
                container
                direction="row"
                justify="center"
                alignItems="center"
            >{blocks?.sort((a: ChainBlock, b: ChainBlock) => a.id - b.id).map((block: ChainBlock) => (
                <Block key={block.id} hashChanged={(blockId: number, hash: string) => blockChanged(blockId, hash)}
                       availableBlocks={blocks}
                       blockId={block.id} previousHash={block.previousHash}/>)
            )
            }
                {readLastBlock()?.hash &&
                <Card style={cardStyle}>
                    <CardContent>
                        <Typography variant="h6">
                            {t('demo.addBlock')}
                        </Typography>
                        <IconButton onClick={addBlock}><AddIcon color={"secondary"} fontSize={'large'}/></IconButton>
                    </CardContent>
                </Card>}
            </Grid>
        </div>
    )
}

export default BlockList;
