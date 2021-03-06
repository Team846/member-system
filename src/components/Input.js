import {FormControl, InputLabel, MenuItem, OutlinedInput, Select, TextField} from "@material-ui/core";
import React, {Component} from "react";
import ReactDOM from "react-dom";

class Input extends Component {
    inputLabelRef = null;

    componentDidMount() {
        if (this.inputLabelRef) {
            this.setState({
                labelWidth: ReactDOM.findDOMNode(this.inputLabelRef).offsetWidth
            });
        }
    }

    render() {
        const {label, options, type, ...other} = this.props;

        if (type === "select") {
            return (
                <FormControl
                    fullWidth
                    margin="normal"
                    variant="outlined">
                    <InputLabel
                        ref={ref => this.inputLabelRef = ref}
                        variant="outlined">
                        {label}
                    </InputLabel>
                    <Select
                        input={
                            <OutlinedInput labelWidth={this.state.labelWidth}/>
                        }
                        variant="outlined"
                        {...other}>
                        {options.map(option => <MenuItem key={option} value={option}>{option}</MenuItem>)}
                    </Select>
                </FormControl>
            )
        } else {
            return (
                <TextField
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    {...this.props}/>
            )
        }
    }

    state = {
        labelWidth: 0
    };
}

export default Input;