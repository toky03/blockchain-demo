import {
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  List,
  ListItemText,
  TextField,
  Typography
} from "@material-ui/core";
import React, {ChangeEvent, useEffect, useState} from "react";
import {sha256} from "../utils/cryptoUtils";
import {BehaviorSubject, merge, Observable, of} from "rxjs";
import {delay, expand, map, switchMap, takeWhile} from "rxjs/operators";
import {cardStyle, minerCard} from "../theming/theme";
import {useTranslation} from "react-i18next";
import {ChainBlock} from "./state";


type BlockInputProps = {
  blockId: number
  previousHash: string
  availableBlocks: ChainBlock[]
  hashChanged: (blockId: number, hash: string) => void
  miners: Miner[]
}

type MinerDisplay = {
  name: string
  nonce: number
  hash: string
}

export class Miner {
  private _nonce: number;
  private _hash: string;

  constructor(private _delay: number, private _name: string) {
    this._nonce = 0;
    this._hash = '';
  }

  get delay(): number {
    return this._delay;
  }

  get name(): string {
    return this._name;
  }

  get nonce(): number {
    return this._nonce;
  }

  get hash(): string {
    return this._hash;
  }


  set nonce(value: number) {
    this._nonce = value;
  }

  set hash(value: string) {
    this._hash = value;
  }

  toDisplay(): MinerDisplay {
    return {name: this._name, nonce: this._nonce, hash: this._hash}
  }
}

function initialHashState(initialInput: string): [Observable<string>, (val: string) => void] {
  const subject = new BehaviorSubject(initialInput);
  const putVal: (val: string) => void = (newVal: string) => {
    subject.next(newVal);
  }
  const start = subject.pipe(switchMap((val: string) => sha256(val)))
  return [start, putVal]
}

function initMiner(miner: Miner, content: string): Observable<MinerDisplay> {
  return of({
    name: miner.name,
    hash: '',
    nonce: 0
  }).pipe(expand((currentMiner: MinerDisplay) => {
    miner.hash = currentMiner.hash
    miner.nonce = currentMiner.nonce
    const newNonce = Math.floor(Math.random() * 500)
    return sha256(content + (newNonce)).pipe(delay(miner.delay), map((hash: string) => ({
      name: miner.name,
      hash,
      nonce: newNonce
    })));
  }));
}

function PowBlock(props: BlockInputProps) {
  const {t} = useTranslation();
  const [[calHashObservable$, putContentVal], _] = useState(initialHashState(''));
  const [calHash, setCalHash] = useState('')
  const [nonce, setNonce] = useState(0);
  const [textContent, setTextContent] = useState('')
  const [displayMiners, setMiners] = useState<MinerDisplay[]>([])

  function updateHash(hash: string) {
    setCalHash(hash);
  }

  useEffect(() => {
    setMiners(props.miners.map((miner: Miner) => ({
      name: miner.name,
      nonce: miner.nonce,
      hash: miner.hash
    })))
  }, [props.miners])

  useEffect(() => {
    props.hashChanged(props.blockId, calHash);
  }, [calHash])

  useEffect(() => {
    putContentVal(textContent + props.previousHash + nonce)
  }, [props.previousHash])


  useEffect(() => {
    const subscription = calHashObservable$.subscribe((currentHash: string) => {
      updateHash(currentHash)
    });
    return () => subscription.unsubscribe();
  }, [calHashObservable$])

  function textFieldChange(changeElement: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const text = changeElement.target.value;
    setTextContent(text);
    putContentVal(text + props.previousHash + nonce)
  }

  async function calculateHash(): Promise<void> {
    const miners: Observable<MinerDisplay>[] = props.miners.map((miner: Miner) => initMiner(miner, props.previousHash + textContent));

    merge(...miners).pipe(map((miner: MinerDisplay) => {
      const updatedMiners: MinerDisplay[] = displayMiners.map((minerTmp: MinerDisplay) => {
        if (minerTmp.name === miner.name) {
          return miner
        }
        return minerTmp

      })
      setMiners(updatedMiners)
      if (miner.hash.startsWith('0')) {
        updateHash(miner.hash)
        setNonce(miner.nonce)
        return true;
      }
      return false
    }), takeWhile((result: boolean) => !result)).subscribe()

  }

  return (
      <Card style={{
        ...cardStyle,
        width: '500px',
        backgroundColor: calHash.startsWith('0') ? cardStyle.backgroundColor : '#ff000038',
        margin: '10px'
      }}>
        <CardContent>
          <Typography variant="h6">
            {t('demo.heading') + props.blockId}
          </Typography>
          <TextField onChange={textFieldChange} multiline label={t('demo.content')} rows={5}
                     variant={'outlined'}/>
          <List>
            <ListItemText primary={t('demo.predecessor')} secondary={props.previousHash}/>
            <ListItemText primary={t('demo.nonce')} secondary={nonce}/>
            <ListItemText primary={t('demo.hash')} secondary={calHash}/>
            <Grid container direction={'row'} justify={'space-around'} alignItems={'center'}>
              {displayMiners.map((miner: MinerDisplay) => (
                  <Grid key={miner.name} item xs={6} style={{justifyContent: 'flex-start'}}>
                    <Card style={{
                      ...minerCard,
                      backgroundColor: miner.hash === calHash ? cardStyle.backgroundColor : minerCard.backgroundColor
                    }}>
                      <List>
                        <ListItemText primary={t('demo.minerName')} secondary={miner.name}/>
                        <ListItemText primary={t('demo.nonce')} secondary={miner.nonce}/>
                        <ListItemText style={{textOverflow: 'ellipsis', overflow: 'hidden'}}
                                      primary={t('demo.hash')} secondary={miner.hash}/>
                      </List>
                    </Card>
                  </Grid>
              ))}
            </Grid>
          </List>
        </CardContent>
        <CardActions><Button onClick={calculateHash}>{t('demo.mine')}</Button></CardActions>
      </Card>
  )
}

export default PowBlock;
