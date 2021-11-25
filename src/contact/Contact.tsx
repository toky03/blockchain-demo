import {Button, Card, Container, Grid, Paper, Snackbar, TextField} from "@material-ui/core";
import './Contact.css'
import {useForm} from "../hooks/hooks";
import axios from "axios";
import {useState} from "react";
import MuiAlert, {AlertProps} from '@material-ui/lab/Alert';
import {cardStyle, logoBackground} from "../theming/theme";
import {useTranslation} from "react-i18next";
import React from "react";


function Alert(props: AlertProps) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function Contact() {

    const {t} = useTranslation();

    const initialValues = {name: '', subject: '', message: '', sender: ''};

    const [open, setOpen] = useState(false);

    const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    function submitForm(formValue: any) {
        axios
            .post("api/contact", formValue)
            .then(res => {
                setOpen(true)
                resetFormValues({name: '', subject: '', message: '', sender: ''})
            })
            .catch(err => console.log(err));
    }

    let {formValues, handleChange, handleSubmit, resetFormValues} = useForm(initialValues, submitForm)

    return (
        <div style={logoBackground}>
        <Container maxWidth={'xs'} >
            <Card style={{...cardStyle, padding: '30px', width: undefined}} elevation={10}>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={6} direction={'column'} justify={'space-around'}
                          alignContent={'space-around'}>
                        <Grid item>
                            <TextField
                                name={'name'}
                                value={formValues.name}
                                onChange={handleChange}
                                required
                                id="name"
                                label={t('form.name')}
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item>
                            <TextField
                                name={'subject'}
                                onChange={handleChange}
                                value={formValues.subject}
                                required
                                id="subject"
                                label={t('form.subject')}
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item>
                            <TextField
                                name={'sender'}
                                onChange={handleChange}
                                value={formValues.sender}
                                required
                                type={'email'}
                                id="sender"
                                label={t('form.sender')}
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item>
                            <TextField
                                name={'message'}
                                value={formValues.message}
                                onChange={handleChange}
                                required
                                id="message"
                                multiline
                                rows={5}
                                label={t('form.message')}
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item>
                            <Button color={'primary'} type={'submit'}>{t('form.confirmButton')}</Button>
                        </Grid>
                    </Grid>
                </form>
            </Card>
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="success">
                    {formValues.subject+' ' + t('sentConfirmation')}
                </Alert>
            </Snackbar>
        </Container>
    </div>
    )

}

export default Contact;
