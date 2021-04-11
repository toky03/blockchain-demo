import React, {useEffect, useState} from 'react';
import './App.css';
import Block from "./Block";
import {
    AppBar, Card,
    CardContent,
    Grid,
    IconButton,
    Toolbar,
    Typography
} from "@material-ui/core";
import AddIcon from '@material-ui/icons/Add'

export interface ChainBlock {
    id: number;
    hash?: string;
    previousHash: string;
}

function App() {

    const [blocks, setBlocks] = useState<ChainBlock[]>([]);

    useEffect(() => {
        console.log('initial block set')
        const firstBlock: ChainBlock = {id: 0, previousHash: '0000'}
        setBlocks([firstBlock]);
    }, [])


    const blockChanged = (blockId: number, hash: string) => {
        console.log('all blocks', blocks)
        const unchangedBlocks = blocks.filter((block: ChainBlock) => block.id !== blockId);
        const changedBlock = blocks.find((block: ChainBlock) => block.id === blockId);
        if (changedBlock) {
            setBlocks(() => [...unchangedBlocks, {...changedBlock, hash}])
        }
    }

    function addBlock(): void {
        const lastBlock = readLastBlock();
        if (lastBlock && lastBlock.hash) {
            setBlocks([...blocks, {id: lastBlock.id + 1, previousHash: lastBlock.hash}])
        }
    }

    function readLastBlock(): ChainBlock | undefined {
        const lastId: number = Math.max(...blocks.map((block: ChainBlock) => block.id));
        return blocks.find((block: ChainBlock) => block.id === lastId);
    }


    return (
        <div className="App">
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu">
                    </IconButton>
                    <Typography variant="h6">
                        Blockchain Demo
                    </Typography>
                </Toolbar>
            </AppBar>
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
                    <Card style={{width: '500px', backgroundColor: 'primary', margin: '10px'}}>
                        <CardContent>
                            <Typography variant="h6">
                                Add Block
                            </Typography>
                            <IconButton onClick={addBlock}><AddIcon fontSize={'large'}/></IconButton>
                        </CardContent>
                    </Card>}
                </Grid>
            </div>
        </div>
    );
}

export default App;
