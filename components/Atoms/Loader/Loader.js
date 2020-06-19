import React from 'react';
import PropTypes from 'prop-types';
import { IconStyled, LoaderStyled, LoaderIconsStyled } from './styles';
import { TaurosIcon } from 'components';

const IconSize = {
  width: '5rem',
  height: '5rem',
};

const Loader = ({ isFullScreen, customHeight }) => (
  <LoaderStyled isFullScreen={isFullScreen} customHeight={customHeight}>
    <LoaderIconsStyled>
      <IconStyled>
        <TaurosIcon {...IconSize} />
      </IconStyled>
      <IconStyled>
        <TaurosIcon {...IconSize} />
      </IconStyled>
    </LoaderIconsStyled>
  </LoaderStyled>
);

Loader.defaultProps = {
  isFullScreen: false,
  customHeight: null,
};

Loader.propTypes = {
  isFullScreen: PropTypes.bool,
  customHeight: PropTypes.node,
};

export default Loader;
