import React, { FC, ReactNode, useEffect, useState, useRef } from 'react';
import './Modal.scss';
import {IoClose} from "react-icons/io5";

interface ModalProps {
    children: ReactNode;
    visible: boolean;
    setVisible: (visible: boolean) => void;
}

const Modal: FC<ModalProps> = ({ children, visible, setVisible }) => {
    const [shouldRender, setShouldRender] = useState(visible);
    const [animate, setAnimate] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (visible) {
            setShouldRender(true);
            setTimeout(() => {
                setAnimate(true);
            }, 50);
            document.body.style.overflow = 'hidden';
        } else {
            setAnimate(false);
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [visible]);

    const handleTransitionEnd = (e: React.TransitionEvent<HTMLDivElement>) => {
        if (!visible && e.propertyName === 'opacity') {
            setShouldRender(false);
        }
    };

    if (!shouldRender) return null;

    return (
        <div
            ref={modalRef}
            className={`Modal ${animate ? 'active' : ''}`}
            onClick={() => setVisible(false)}
            onTransitionEnd={handleTransitionEnd}
        >
            <IoClose className="close-icon"/>
            <div
                className={`Modal__content ${animate ? 'active' : ''}`}
                onClick={(e) => e.stopPropagation()}
            >
                {children}
            </div>
        </div>
    );
};

export default Modal;
