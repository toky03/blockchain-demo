import {
    Card,
    CardContent,
    Grid,
    IconButton,
    Slider,
    Typography
} from "@material-ui/core";
import PowBlock, {Miner} from "./PowBlock";
import AddIcon from "@material-ui/icons/Add";
import React, {ChangeEvent, useEffect, useState} from "react";
import {cardStyle, conceptDescriptionCardStyle} from "../theming/theme";
import {Trans, useTranslation} from "react-i18next";
import {blocksReducer, ChainBlock, useReducer} from "./state";


const MAX_RATE = 100;

function PowBlockList() {

    const {t} = useTranslation();
    const [blocks, dispatch] = useReducer(blocksReducer, []);
    const [miners, setMiners] = useState([new Miner(MAX_RATE, 'A'), new Miner(20, 'B')])

    useEffect(() => {
        const firstBlock: ChainBlock = {id: 0, previousHash: '0000'}
        dispatch({type: 'add', payload: firstBlock});
    }, [])

    function updateMiner(refIndex: number, value: number | number[]): void {
        const updatedMiners = miners.map((miner: Miner, index: number) => {
            if (index === refIndex) {
                return new Miner(MAX_RATE - (value as number), miner.name)
            }
            return miner;
        })
        setMiners(updatedMiners)
    }


    const blockChanged = (blockId: number, hash: string) => {
        dispatch({type: 'updateHash', payload: blockId, hash})
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
                <Card style={conceptDescriptionCardStyle}>
                    <Typography variant="h6">
                        {t('demo.pow.title')}
                    </Typography>
                    <Trans i18nKey={'demo.pow.content'}><p>a</p><p>b</p></Trans>
                    <Grid container justify={'center'} direction={'row'} spacing={2}>
                        {miners.map((miner: Miner, index: number) => (
                            <Card key={index} style={cardStyle}>
                                <CardContent>
                                    <Typography id="discrete-slider" gutterBottom>
                                        {t('demo.hashrate') + ' Miner ' + miner.name}
                                    </Typography>
                                    <Slider
                                        defaultValue={30}
                                        aria-labelledby="discrete-slider"
                                        valueLabelDisplay="auto"
                                        step={10}
                                        marks
                                        min={10}
                                        max={MAX_RATE}
                                        onChange={(val: ChangeEvent<{}>, newVal: number | number[]) => updateMiner(index, newVal)}
                                    />
                                </CardContent>
                            </Card>
                        ))}
                    </Grid>
                </Card>
            </Grid>
            <Grid
                container
                direction="row"
                justify="center"
                alignItems="center"
            >{blocks?.sort((a: ChainBlock, b: ChainBlock) => a.id - b.id).map((block: ChainBlock) => (
                <PowBlock key={block.id}
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

export default PowBlockList;
