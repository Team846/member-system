import React, {Component} from 'react';
import {InputAdornment, TextField} from "@material-ui/core";
import PhoneNumberInput from "./PhoneNumberInput";

class InputField extends Component {
    render() {
        return (
            <TextField
                fullWidth
                margin={"dense"}
                {...this.props}
                InputProps={this.props.type === "phone" ? {
                    inputComponent: PhoneNumberInput,
                    startAdornment: <InputAdornment position={"start"}>+1</InputAdornment>
                } : {}}
                type={"text"}/>
        );
    }
}

export default InputField;