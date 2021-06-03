import {
  Button,
  Card,
  CardActions,
  CardContent, CircularProgress,
  List,
  ListItemText,
  TextField,
  Typography
} from "@material-ui/core";
import React, {ChangeEvent, useEffect, useState} from "react";
import {sha256} from "../utils/cryptoUtils";
import {BehaviorSubject, EMPTY, Observable, of, Subject, Subscription} from "rxjs";
import {expand, switchMap} from "rxjs/operators";
import {ChainBlock} from "./BlockList";
import {cardStyle} from "../theming/theme";
import {useTranslation} from "react-i18next";


type BlockInputProps = {
  blockId: number
  previousHash: string
  availableBlocks: ChainBlock[]
  hashChanged: (blockId: number, hash: string) => void
}

function initialHashState(initialInput: string) : [Observable<string>, (val: string) => void] {
  const subject = new BehaviorSubject(initialInput);
  const putVal:  (val: string) => void = (newVal: string) => {
    subject.next(newVal);
  }
  const start = subject.pipe(switchMap((val: string) => sha256(val)))
  return [start, putVal]
}

function Block(props: BlockInputProps) {
  const {t} = useTranslation();
  const [[calHashObservable$, putContentVal], _] = useState(initialHashState(''));
  const [callbackFn, setCallbackFn] = useState(() => (val: string) => {});
  const [calHash, setCalHash] = useState('')
  const [isLoading, setLoading] = useState<boolean>(false)
  const [nonce, setNonce] = useState(0);
  const [textContent, setTextContent] = useState('')

  function updateHash(hash: string) {
    setCalHash(hash);
  }

  useEffect(() => {
    props.hashChanged(props.blockId, calHash);
  }, [calHash])

  useEffect(() => {
    putContentVal(textContent+ props.previousHash + nonce)
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
    putContentVal(text+ props.previousHash + nonce)
  }

  async function calculateHash(): Promise<void> {
    let currentNonce = 0;
    of('').pipe(expand((currentHash: string) => {
      if(currentHash.startsWith('0')){
        updateHash(currentHash)
        return EMPTY;
      }
      currentNonce = currentNonce +1;
      setNonce(() => currentNonce)
      updateHash(currentHash)
      return sha256(textContent+props.previousHash+(currentNonce));
    })).subscribe();

  }

  return (
    <Card style={{...cardStyle, width: '500px', backgroundColor: calHash.startsWith('0')? '#cde7c0': '#ff000038', margin: '10px'}}>
      <CardContent>
        <Typography variant="h6">
          {t('demo.heading') +props.blockId}
        </Typography>
        <TextField onChange={textFieldChange} multiline label={t('demo.content')} rows={5} variant={'outlined'}/>
        <List>
          <ListItemText primary={t('demo.predecessor')} secondary={props.previousHash} />
          <ListItemText primary={t('demo.nonce')} secondary={nonce} />
          <ListItemText primary={t('demo.hash')} secondary={calHash} />
        </List>
        {isLoading && <CircularProgress />}
      </CardContent>
      <CardActions><Button onClick={calculateHash}>{t('demo.mine')}</Button></CardActions>
    </Card>
  )
}

export default Block;
