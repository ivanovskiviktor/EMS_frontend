import React from 'react';
import { SpinnerContainer, SpinnerOverlay, SpinnerOverlaySmaller} from './Spinner-styles';

const Spinner = ({smaller}) => {
    return(
        smaller ? (<SpinnerOverlaySmaller>
            <SpinnerContainer/>
        </SpinnerOverlaySmaller>) : (<SpinnerOverlay>
            <SpinnerContainer/>
        </SpinnerOverlay>)
    )
}

export default Spinner;
