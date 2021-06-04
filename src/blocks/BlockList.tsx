import {
  Card,
  CardContent,
  Grid,
  IconButton,
  Slider,
  TextField,
  Typography
} from "@material-ui/core";
import Block, {Miner} from "./Block";
import AddIcon from "@material-ui/icons/Add";
import React, {ChangeEvent, useEffect, useState} from "react";
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


const MAX_RATE = 100;

function BlockList() {

  const {t} = useTranslation();
  const [blocks, dispatch] = useReducer(blocksReducer, []);
  const [miners, setMiners] = useState([new Miner(MAX_RATE, 'A'), new Miner(20, 'B')])

  useEffect(() => {
    const firstBlock: ChainBlock = {id: 0, previousHash: '0000'}
    dispatch({type: 'add', payload: firstBlock});
  }, [])

  function updateMiner(refIndex: number, field: 'delay' | 'name', value: string | number | number[]): void {
    const updatedMiners = miners.map((miner: Miner, index: number) => {
      if (index === refIndex) {
        return field === 'delay' ? new Miner(MAX_RATE - (value as number), miner.name) : new Miner(miner.delay, value as string)
      }
      return miner;
    })
    setMiners(updatedMiners)
  }


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
        <Grid container spacing={0}
        >
          <Card style={cardStyle}>
            <CardContent>
              <TextField label={'Miner Name'}
                         onChange={(val: any) => updateMiner(0, 'name', val.target.value)}

              />
              <Typography id="discrete-slider" gutterBottom>
                Hash Rate
              </Typography>
              <Slider
                  defaultValue={30}
                  aria-labelledby="discrete-slider"
                  valueLabelDisplay="auto"
                  step={10}
                  marks
                  min={10}
                  max={MAX_RATE}
                  onChange={(val: ChangeEvent<{}>, newVal: number | number[]) => updateMiner(0, 'delay', newVal)}
              />
            </CardContent>
          </Card>
          <Card style={cardStyle}>
            <CardContent>
              <TextField label={'Miner Name'}
                         onChange={(val: any) => updateMiner(1, 'name', val.target.value)}
              />
              <Typography id="discrete-slider" gutterBottom>
                Hash Rate
              </Typography>
              <Slider
                  defaultValue={MAX_RATE}
                  aria-labelledby="discrete-slider"
                  valueLabelDisplay="auto"
                  step={10}
                  marks
                  min={10}
                  max={MAX_RATE}
                  onChange={(val: ChangeEvent<{}>, newVal: number | number[]) => updateMiner(1, 'delay', newVal)}
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid
            container
            direction="row"
            justify="center"
            alignItems="center"
        >{blocks?.sort((a: ChainBlock, b: ChainBlock) => a.id - b.id).map((block: ChainBlock) => (
            <Block key={block.id}
                   hashChanged={(blockId: number, hash: string) => blockChanged(blockId, hash)}
                   miners={miners}
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
              <IconButton onClick={addBlock}><AddIcon color={"secondary"}
                                                      fontSize={'large'}/></IconButton>
            </CardContent>
          </Card>}
        </Grid>
      </div>
  )
}

export default BlockList;
