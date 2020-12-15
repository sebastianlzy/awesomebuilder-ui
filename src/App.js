import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './App.css';
import {Grid, Paper} from '@material-ui/core'
import {withStyles} from '@material-ui/core/styles';
import ec2Icon from './ec2-icon.png'

const useStyles = (theme) => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
});

class App extends Component {
    state = {
      currHostName: '',
      instanceHostnames: [],
    };

    componentDidMount() {
        this.getCurrHostName()
            .then(res => this.setState({currHostName: res.hostname}))
            .catch(err => this.setState({currHostName: JSON.stringify(err)}));

        this.getHostNames()
            .then(res => this.setState({instanceHostnames: res.hostnames}))
            .catch(err => this.setState({instanceHostnames: [JSON.stringify(err)]}));
    }

    getCurrHostName = async () => {
        const currHostName = await fetch('/api/get-instance-hostname');
        const body = await currHostName.json();
        if (currHostName.status !== 200) throw Error(body.message);
        console.log(body)
        return body;
    };

    getHostNames = async () => {
        const currHostName = await fetch('/api/get-all-instance-hostnames');
        const body = await currHostName.json();
        if (currHostName.status !== 200) throw Error(body.message);
        console.log(body)
        return body;
    };

    renderGrids = (gridValues) => {
      const grids = []
      for (let i = 0; i< gridValues.length; i++) {
        grids.push(
            <Grid item xs key={`homepage-grid-${i}`}>
              <Paper className={this.props.classes.paper}>
                <img src={ec2Icon} alt="ec2 logo" />
                <p>{gridValues[i]}</p>
              </Paper>
            </Grid>
        )
      }
      return grids
    }

    render() {
        return (
            <div className="App">
                <p>{this.state.currHostName}</p>
                <Grid container spacing={3}>
                  {this.renderGrids(this.state.instanceHostnames)}
                </Grid>
            </div>
        );
    }
}

App.propTypes = {
    classes: PropTypes.object.isRequired,
}

export default withStyles(useStyles)(App);