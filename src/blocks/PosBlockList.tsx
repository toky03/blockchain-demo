import PosBlock, {Stakeholder} from "./PosBlock";
import {Card, CardContent, Grid, IconButton, Slider, Typography} from "@material-ui/core";
import {cardStyle} from "../theming/theme";
import React, {ChangeEvent, useEffect, useState} from "react";
import AddIcon from "@material-ui/icons/Add";
import {blocksReducer, ChainBlock, useReducer} from "./state";
import {useTranslation} from "react-i18next";
import {combineLatest} from "rxjs";
import {map} from "rxjs/operators";


const MAX_STAKE = 100;


function PosBlockList() {

  const {t} = useTranslation();
  const [blocks, dispatch] = useReducer(blocksReducer, []);
  const [stakeholders, setStakeholders] = useState([new Stakeholder(MAX_STAKE, 'A', 0), new Stakeholder(20, 'B', 1)])

  const blockChanged = (blockId: number, hash: string, proof: boolean) => {
    dispatch({type: 'updateHash', payload: blockId, hash, proof})
  }

  useEffect(() => {
      const subscription = combineLatest(stakeholders.map((stakeholder => stakeholder.initKeyPair()))).pipe(map(() => {
        if (blocks.length === 0){
          const firstBlock: ChainBlock = {id: 0, previousHash: ''}
          dispatch({type: 'add', payload: firstBlock});
        }
      })).subscribe();
    return () => subscription.unsubscribe();
  }, [])

  function addBlock(): void {
    const lastBlock = readLastBlock();
    if (lastBlock?.hash) {
      dispatch({
        type: 'add',
        payload: {id: lastBlock.id + 1, previousHash: lastBlock.hash}
      });
    }
  }

  function updateStakeholder(refIndex: number, value: number | number[]): void {
    const updatedStakeholder = stakeholders.map((stakeholder: Stakeholder, index: number) => {
      if (index === refIndex) {
        stakeholder.stake = value as number
      }
      return stakeholder;
    })
    setStakeholders(updatedStakeholder)
  }

  function readLastBlock(): ChainBlock | undefined {
    const lastId: number = Math.max(...blocks.map((block: ChainBlock) => block.id));
    return blocks.find((block: ChainBlock) => block.id === lastId);
  }

  return (
      <div className={'blockList'}>
        <Grid container spacing={0}
        >
          {stakeholders.map((miner: Stakeholder, index: number) => (
              <Card key={index} style={cardStyle}>
                <CardContent>
                  <Typography id="discrete-slider" gutterBottom>
                    {t('demo.stakeCount') + ' Stakeholder '+ miner.name}
                  </Typography>
                  <Slider
                      defaultValue={stakeholders[index].stake}
                      aria-labelledby="discrete-slider"
                      valueLabelDisplay="auto"
                      step={10}
                      marks
                      min={10}
                      max={100}
                      onChange={(val: ChangeEvent<{}>, newVal: number | number[]) => updateStakeholder(index,  newVal)}
                  />
                </CardContent>
              </Card>
          ))}
        </Grid>
        <Grid
            container
            direction="row"
            justify="center"
            alignItems="center"
        >{blocks?.sort((a: ChainBlock, b: ChainBlock) => a.id - b.id).map((block: ChainBlock) => (
            <PosBlock key={block.id}
                      hashChanged={(blockId: number, hash: string, proof: boolean) => blockChanged(blockId, hash, proof)}
                      stakeholders={stakeholders}
                      previousHash={block.previousHash}
                      blockId={block.id} />)
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

export default PosBlockList
