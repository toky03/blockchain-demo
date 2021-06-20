import {
    createRsaKeyPair,
    decode,
    decryptMessage,
    distributeHash,
    encryptMessage, sha256
} from "../utils/cryptoUtils";
import {BehaviorSubject, Observable, of, Subject} from "rxjs";
import {catchError, map, switchMap} from "rxjs/operators";
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
import {cardStyle, minerCard} from "../theming/theme";
import React, {ChangeEvent, useEffect, useState} from "react";
import {useTranslation} from "react-i18next";

interface PosBlockInput {
    hashChanged: (blockId: number, hash: string, proof: boolean) => void
    stakeholders: Stakeholder[]
    previousHash: string
    blockId: number;
}


export class Stakeholder {
    private _privatePublicKeyPair: CryptoKeyPair | undefined

    constructor(private _stake: number, private _name: string, private _id: number) {
    }

    initKeyPair(): Observable<void> {
        return createRsaKeyPair().pipe((map((keys: CryptoKeyPair) => {
            this._privatePublicKeyPair = keys
        })));
    }


    signMessage(msg: string): Observable<ArrayBuffer> {
        if (this._privatePublicKeyPair) {
            return encryptMessage(this._privatePublicKeyPair.publicKey, msg)
        } else {
            throw new Error('keys not defined yet')
        }
    }

    verifyMessage(msg: ArrayBuffer): Observable<string> {
        if (this._privatePublicKeyPair) {
            return decryptMessage(this._privatePublicKeyPair.privateKey, msg).pipe(catchError(err => {
                console.error(err.message)
                return of('failure')
            }));
        } else {
            throw new Error('keys not yet defined')
        }
    }

    set stake(stake: number) {
        this._stake = stake;
    }

    get stake(): number {
        return this._stake;
    }

    get name(): string {
        return this._name;
    }

    get id(): number {
        return this._id;
    }
}


type Distribution = {
    input: string
    stakeDistribution: Stakeholder[]
}

type Signature = {
    assignedStakeholder: string
    verification: ArrayBuffer | null
}

type SignatureRequest = {
    stakeholder: Stakeholder,
    verification: ArrayBuffer
}

function calculateAssignee(distribution: Distribution): [Observable<Signature>, (distribution: Distribution) => void] {
    const subject = new BehaviorSubject(distribution);
    const putVal: (val: Distribution) => void = (newVal: Distribution) => {
        subject.next(newVal);
    }

    const start = subject.pipe(
        switchMap((val: Distribution) => distributeHash(val.input).pipe(map((distribuion: number) => ({
            distribuion,
            val
        })))),
        map(({distribuion, val}: { distribuion: number, val: Distribution }) => {
            if (val.stakeDistribution.length > 0) {
                const sortedStakeholders = val.stakeDistribution.slice(0).sort((a: Stakeholder, b: Stakeholder) => a.stake - b.stake)
                const sumStake = sortedStakeholders.map((stakeDistribution: Stakeholder) => stakeDistribution.stake).reduce((a: number, b: number) => a + b, 0)
                const assigneeStake = sumStake / sortedStakeholders[0].stake
                const result = Math.round((distribuion * 200 + assigneeStake) / 201)
                return {stakeholder: sortedStakeholders[result], inputValue: val.input}
            }
            return {stakeholder: null, inputValue: ''}
        }),
        switchMap((hashDistributeVal: { stakeholder: Stakeholder, inputValue: string } | { stakeholder: null, inputValue: string }) => {
            if (!hashDistributeVal.stakeholder) {
                return of({
                    assignedStakeholder: '',
                    verification: null
                })
            }
            return hashDistributeVal.stakeholder.signMessage(hashDistributeVal.inputValue).pipe(map((signedMessage: ArrayBuffer) => {
                return {
                    assignedStakeholder: hashDistributeVal.stakeholder.name,
                    verification: signedMessage
                }
            }))

        }));
    return [start, putVal]
}

function verifyBlock(): [Observable<string>, (stakeholder: SignatureRequest) => void] {
    const subject = new Subject<SignatureRequest>();
    const putVal: (val: SignatureRequest) => void = (newVal: SignatureRequest) => {
        subject.next(newVal)
    }

    const start = subject.pipe(
        switchMap((val: SignatureRequest) => val.stakeholder.verifyMessage(val.verification))
    );
    return [start, putVal]
}

function calculateHash(initialInput: string): [Observable<string>, (newInput: string) => void] {
    const subject = new BehaviorSubject<string>(initialInput);
    const putVal: (val: string) => void = (newVal: string) => {
        subject.next(newVal)
    }

    const start = subject.pipe(
        switchMap((content: string) => sha256(content))
    );
    return [start, putVal]
}


function PosBlock(props: PosBlockInput) {

    const {t} = useTranslation();
    const [textContent, setTextContent] = useState(' ')
    const [proof, setProof] = useState('')
    const [verification, setVerification] = useState<ArrayBuffer>()
    const [assignedStakepool, setAssignedStakepool] = useState('')
    const [[assignee$, putInputValue],] = useState(calculateAssignee({
        input: '',
        stakeDistribution: []
    }));
    const [[signatureVerification$, putStakeholder],] = useState(verifyBlock())
    const [[hash$, setHashContent],] = useState(calculateHash(''))
    const [currentHash, setCurrentHash] = useState('')
    const [verificationProof, setVerificationProof] = useState('')

    function textFieldChange(changeElement: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const text = changeElement.target.value;
        setTextContent(() => text);
        putInputValue({
            input: text + props.previousHash,
            stakeDistribution: props.stakeholders
        })
    }

    useEffect(() => {
        putInputValue({
            input: textContent + props.previousHash,
            stakeDistribution: props.stakeholders
        })
    }, [props.previousHash, props.stakeholders, assignee$])

    useEffect(() => {
        const matchingProof = verificationProof === textContent + props.previousHash
        setProof(matchingProof ? 'match' : 'wrong')
        props.hashChanged(props.blockId, currentHash, matchingProof)

    }, [verificationProof, textContent, props.previousHash])

    useEffect(() => {
        const subscription = hash$.subscribe((newHash: string) =>
            setCurrentHash(newHash)
        );
        return () => subscription.unsubscribe();

    }, [hash$])

    useEffect(() => {
        setHashContent(textContent + props.previousHash + verification + proof)
    }, [textContent, props.previousHash, verification, proof])

    useEffect(() => {
        const subscription = assignee$.subscribe((signature: Signature) => {
            if (signature.assignedStakeholder && signature.verification) {
                setAssignedStakepool(signature.assignedStakeholder);
                setVerification(signature.verification)
            }
        })
        return () => subscription.unsubscribe();

    }, [assignee$])

    useEffect(() => {
        const subscription = signatureVerification$.subscribe((signatureVerification: string) => {
            setVerificationProof(signatureVerification)
        })
        return () => subscription.unsubscribe()
    }, [signatureVerification$])

    function signBlock(stakeholder: Stakeholder) {
        if (stakeholder && verification) {
            putStakeholder({stakeholder, verification})
        }
    }

    return (<Card style={{
        ...cardStyle,
        width: '500px',
        backgroundColor: proof === 'match' ? cardStyle.backgroundColor : '#ff000038',
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
                <ListItemText primary={t('demo.assignedStakeholder')} secondary={assignedStakepool}/>
                <ListItemText primary={t('demo.proof')} secondary={proof}/>
                <ListItemText primary={t('demo.encryptedMessage')}
                              secondary={verification ? decode(verification) : ''}/>
                <ListItemText primary={t('demo.hash')} secondary={currentHash}/>
                <Grid container direction={'row'} justify={'space-around'} alignItems={'center'}>
                    {props.stakeholders.map((stakeholder: Stakeholder) => (
                        <Grid key={stakeholder.name} item xs={6} style={{justifyContent: 'flex-start'}}>
                            <Card style={minerCard}>
                                <List>
                                    <ListItemText primary={t('demo.stakeholderName')} secondary={stakeholder.name}/>
                                    <ListItemText primary={'Stake'} secondary={stakeholder.stake}/>
                                </List>
                                <CardActions><Button color={'primary'}
                                                     onClick={() => signBlock(stakeholder)}>{t('demo.signate')}</Button></CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </List>
        </CardContent>
    </Card>)
}

export default PosBlock
