import React, {Component} from 'react';
import InputMask from 'react-input-mask';

class PhoneNumberInput extends Component {
    render() {
        return (
            <InputMask
                {...this.props}
                alwaysShowMask
                mask={"(999) 999-9999"}
                maskChar={"#"}/>
        );
    }
}

export default PhoneNumberInput;