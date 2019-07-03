import React from 'react';
import BoxTitleWrapper from '../../atoms/box-title' ;
import { BoxWrapper } from './style';

export interface IBox {
  className?: string
  style?: React.CSSProperties
  title?: string
  subtitle?: string
  children?: React.ReactChild
}

export default (props:IBox) => (
  <BoxWrapper
    className={`${props.className} isoBoxWrapper`}
    style={props.style}
  >
    <BoxTitleWrapper title={props.title} subtitle={props.subtitle} />
    {props.children}
  </BoxWrapper>
);
