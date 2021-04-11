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
import {sha256} from "./utils/cryptoUtils";
import {BehaviorSubject, EMPTY, Observable, of} from "rxjs";
import {expand, switchMap} from "rxjs/operators";
import {ChainBlock} from "./App";


type BlockInputProps = {
  blockId: number
  previousHash: string
  availableBlocks: ChainBlock[]
  hashChanged: (blockId: number, hash: string) => void
}

function useHash(inialInput: string): [Observable<string>, (val: string) => void] {
  const [hashSubject, setHashSubject] = useState(new BehaviorSubject(inialInput));

  const putVal: (val: string) => void = (newVal: string) => {
    hashSubject.next(newVal);
  }

  return [hashSubject, putVal]
}

function Block(props: BlockInputProps) {
  const [calHashObservable$, putContentVal] = useHash('');
  const [calHash, setCalHash] = useState('')
  const [isLoading, setLoading] = useState<boolean>(false)
  const [nonce, setNonce] = useState(0);
  const [textContent, setTextContent] = useState('')

  useEffect(() => {
    const subscription = calHashObservable$.pipe(
        switchMap((val: string) => {
          return sha256(val)
        })
    ).subscribe((currentHash: string) => {
      setCalHash(currentHash);
      props.hashChanged(props.blockId, currentHash);
    })
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
        setCalHash(currentHash)
        props.hashChanged(props.blockId, currentHash);
        return EMPTY;
      }
      currentNonce = currentNonce +1;
      setNonce(() => currentNonce)
      setCalHash(currentHash)
      props.hashChanged(props.blockId, currentHash);
      return sha256(textContent+props.previousHash+(currentNonce));
    })).subscribe();

  }

  return (
    <Card style={{width: '500px', backgroundColor: 'primary', margin: '10px'}}>
      <CardContent>
        <Typography variant="h6">
          Block #{props.blockId}
        </Typography>
        <TextField onChange={textFieldChange} multiline label={'Block Inhalt'} rows={5} variant={'outlined'}/>
        <List>
          <ListItemText primary={'Vorgänger'} secondary={props.previousHash} />
          <ListItemText primary={'nonce'} secondary={nonce} />
          <ListItemText primary={'Hash'} secondary={calHash} />
        </List>
        {isLoading && <CircularProgress />}
      </CardContent>
      <CardActions><Button onClick={calculateHash}>Minen</Button></CardActions>
    </Card>
  )
}

export default Block;
