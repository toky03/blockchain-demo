import React from "react";
import {
    Card,
    CardContent,
    Grid,
    Link,
    Typography
} from "@material-ui/core";
import './Overview.css';
import HomeIcon from '@material-ui/icons/Home';
import VideocamIcon from '@material-ui/icons/Videocam';
import LockIcon from '@material-ui/icons/Lock';
import {cardStyle} from "../theming/theme";
import {Trans, useTranslation} from "react-i18next";


function Overview() {

    const {t} = useTranslation();

    return (
        <div style={{
            backgroundImage: 'url(./pictures/background1.JPG)',
            backgroundSize: "cover",
            backgroundAttachment: "fixed",
            marginTop: '-64px',
            color: "#f5f5f5"
        }}>
            <Typography variant='h1' color={'secondary'} align={'center'}>
                {t('welcome')}
            </Typography>
            <Grid>
                <Grid
                    xs={12}
                    container
                    direction="row"
                    justify="center"
                    alignItems="stretch"
                >
                    <Card style={cardStyle} elevation={8}>
                        <CardContent>
                            <HomeIcon fontSize="large"/>
                            <Typography variant="h6">
                                {t('headingCard.hostingTitle')}
                            </Typography>
                            <Trans i18nKey={'headingCard.hostingContent'}>
                                <p>Der Pool läuft auf einem Kubernetes Cluster mit jeweils einem Pod für die zwei Relay
                                    Nodes und einem Pod für den Producing Node</p>
                                <p>Der Vorteil von Kubernetes ist, dass bei einem Fehlerfall der Pod angibt "ungesund"
                                    zu sein und Kubernetes startet daraufhin einen neuen Pod</p>
                                <p>Zusätzlich können auch Wartungsarbeiten unterbruchsfrei durchgeführt werden. Damit
                                    kann garantiert werden, dass kein Slot verfehlt wird.</p>
                            </Trans>
                        </CardContent>
                    </Card>
                    <Card style={cardStyle} elevation={8}>
                        <CardContent>
                            <CardContent>
                                <VideocamIcon fontSize="large"/>
                                <Typography variant="h6">
                                    {t('headingCard.monitoringTitle')}
                                </Typography>
                                <Trans i18nKey={'headingCard.monitoringContent'}>
                                    <p>Die Cardano Nodes werden 24/7 mit Prometheus und Grafana gemonitored.</p>
                                    <p>Falls etwas schief läuft was nicht von selbst behoben werden kann wird durch das
                                        Alerting direkt eine Meldung versendet.</p>
                                </Trans>
                            </CardContent>
                        </CardContent>
                    </Card>
                    <Card style={cardStyle} elevation={8}>
                        <CardContent>
                            <LockIcon fontSize="large"/>
                            <Typography variant="h6">
                                {t('headingCard.securityTitle')}
                            </Typography>
                            <Trans i18nKey={'headingCard.securityContent'}>
                                <p>Das Kubernetes Cluster ist in der Schweiz gehostet und ist nur via eine Sichere
                                    verbindung gesichert.</p>
                                <p>Es sind nur die beiden Relay Nodes gegen aussen sichtbar, der block produzierende
                                    Node ist nur innerhalb des Kubernetes Clusters sichtbar.</p>
                            </Trans>
                        </CardContent>
                    </Card>
                </Grid>
                <Typography variant='h1' color={'secondary'} align={'center'}>
                    {t('cardano.title')}
                </Typography>
                <Grid container
                      direction={'row'}
                      justify="space-around"
                      alignItems="stretch">
                    <Card style={cardStyle} elevation={10}>
                        <CardContent>
                            <Typography variant="h4">
                                {t('cardano.coin.title')}
                            </Typography>
                            <Trans i18nKey={'cardano.coin.content'}>
                                Text<Link href={'/block-demo'}>Demo link</Link>text<Link href={'https://cardano.org/'}>Link</Link>test
                            </Trans>
                        </CardContent>
                    </Card>
                    <Card elevation={10} style={cardStyle}>
                        <CardContent>
                            <Typography variant="h4">
                                {t('cardano.staking.title')}
                            </Typography>
                            <Trans i18nKey={'cardano.staking.content'}>
                                Staking descriptionbeschreibung<Link href={'https://cardano.org/calculator/?calculator=delegator'}>Staking Anleitung</Link>staking betreiben
                            </Trans>
                        </CardContent>

                    </Card>
                </Grid>
                <Typography variant='h1' color={'secondary'} align={'center'}>
                    {t('info.title')}
                </Typography>
                <Grid container
                      direction={'row'}
                      justify="space-around"
                      alignItems="stretch">
                    <Card style={cardStyle} elevation={10}>
                        <CardContent>
                            <Typography variant="h4">
                                {t('info.aboutMe.title')}
                            </Typography>
                            <Trans i18nKey={'info.aboutMe.content'}>
                                <p>Nach meinem Studium als Wirtschaftsingenieur stieg ich als Softwareentwickler in
                                    einem
                                    Beratungsunternehmen ein.</p>
                                <p>Nachdem ich genug Erfahrung gesammelt habe und auch weil ich wieder zurück in das
                                    wunderschöne Berner Seeland (von dort her auch der Name <strong>Seeland
                                        Stakepool</strong>) wechselte ich zu einer schweizer Versicherung, bei der ich weiterhin
                                    als Software Entwicker arbeite.</p>
                            </Trans>
                        </CardContent>
                    </Card>
                    <Card elevation={10} style={cardStyle}>
                        <CardContent>
                            <Typography variant="h4">
                                {t('info.contact.title')}
                            </Typography>
                            <Trans i18nKey={'info.contact.content'}>
                                <p>Erreichen kann man mich via<Link href={'/contact'}>Kontaktformular</Link></p>
                            </Trans>
                        </CardContent>

                    </Card>
                </Grid>

            </Grid>

        </div>


    );
}

export default Overview;
