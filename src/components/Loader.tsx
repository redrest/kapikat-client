import React from 'react';
import { ThreeDots } from 'react-loader-spinner';

const Loader = () => {
    return (
        <div style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'transparent',
            zIndex: 1000
        }}>
            <ThreeDots
                height="60"
                width="60"
                color="#FF6818"
                ariaLabel="loading"
                visible={true}
            />
        </div>
    );
};

export default Loader;
