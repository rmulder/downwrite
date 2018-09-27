import * as React from 'react';
import styled from 'styled-components';
import { colors } from '../utils/defaultStyles';

const Box = styled.div``;

interface ILayoutTrigger {
  active: boolean;
  theme: any;
}

const LayoutTrigger = styled.div`
  display: inline-block;
  margin: 8px 0 8px 16px;
  cursor: pointer;
  font-size: 12px;
  color: inherit;
  opacity: ${(props: ILayoutTrigger) => (props.active ? 1 : 0.5)};
  &:after {
    content: '';
    display: block;
    border-bottom: 5px solid
      ${(props: ILayoutTrigger) =>
        props.active ? props.theme.link || colors.blue400 : 'transparent'};
  }
`;

interface ILayoutControl {
  layout: string | 'grid' | 'list';
  layoutChange: (x: string) => void;
}

const LayoutControl: React.SFC<ILayoutControl> = ({ layout, layoutChange }) => (
  <Box>
    <LayoutTrigger active={layout === 'grid'} onClick={() => layoutChange('grid')}>
      Grid
    </LayoutTrigger>
    <LayoutTrigger active={layout === 'list'} onClick={() => layoutChange('list')}>
      List
    </LayoutTrigger>
  </Box>
);

export default LayoutControl;
