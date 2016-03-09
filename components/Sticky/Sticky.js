/* @flow */

import React, {PropTypes} from 'react';
import ReactDOM from 'react-dom';

import LayoutEvents from '../../lib/LayoutEvents';

type Props = {
  side: 'top' | 'bottom',
  offset: number,
  children?: any
}

type State = {
  fixed: bool,
  height: (number | string),
  left: (number | string),
  width: (number | string),
};

export default class Sticky extends React.Component {

  props: Props;

  static propTypes = {
    side: PropTypes.oneOf(['top', 'bottom']).isRequired,

    /**
     * Отступ от границы в пикселях
     **/
    offset: PropTypes.number,

    children: PropTypes.node
  };

  state: State;

  _wrapper: HTMLElement;
  _inner: HTMLElement;

  _immediateState: $Shape<State>;
  _layoutSubscription: {remove: () => void};

  static defaultProps: {offset: number} = {
    offset: 0,
  };

  constructor(props: Props, context: any) {
    super(props, context);

    this.state = {
      fixed: false,
      height: 'auto',
      left: 'auto',
      width: 'auto',
    };

    this._immediateState = {};
  }

  render() {
    let wrapperStyle = null;
    let innerStyle = null;
    if (this.state.fixed) {
      wrapperStyle = {
        height: this.state.height,
      };

      innerStyle = ({
        left: this.state.left,
        position: 'fixed',
        width: this.state.width,
        zIndex: 100,
      }: Object);

      if (this.props.side === 'top') {
        innerStyle.top = this.props.offset;
      } else {
        innerStyle.bottom = this.props.offset;
      }
    }

    return (
      <div style={wrapperStyle} ref={this._refWrapper}>
        <div style={innerStyle} ref={this._refInner}>
          {this.props.children}
        </div>
      </div>
    );
  }

  // $FlowIssue 850
  _refWrapper = (ref) => {
    this._wrapper = ref;
  };

  // $FlowIssue 850
  _refInner = (ref) => {
    this._inner = ref;
  };

  componentDidMount() {
    this._reflow();

    this._layoutSubscription = LayoutEvents.addListener(() => this._reflow());
  }

  componentWillUnmount() {
    this._layoutSubscription.remove();
  }

  componentDidUpdate() {
    this._reflow();
  }

  // $FlowIssue 850
  _reflow = () => {
    const wrapRect = this._wrapper.getBoundingClientRect();
    const wrapBottom = wrapRect.bottom;
    const wrapLeft = wrapRect.left;
    const wrapTop = wrapRect.top;
    const fixed = this.props.side === 'top'
      ? wrapTop < this.props.offset
      : wrapBottom > window.innerHeight - this.props.offset;

    this._setStateIfChanged({fixed});

    if (fixed) {
      const width = this._wrapper.offsetWidth;
      this._setStateIfChanged({width, left: wrapLeft}, () => {
        const height = this._inner.offsetHeight;
        this._setStateIfChanged({height});
      });
    }
  };

  _setStateIfChanged(state: $Shape<State>, callback?: () => void) {
    let changed = false;
    for (const key in state) {
      if (this._immediateState[key] !== state[key]) {
        changed = true;
        this._immediateState[key] = state[key];
      }
    }

    if (changed) {
      this.setState(state, callback);
    } else {
      if (callback) {
        callback();
      }
    }
  };
}
