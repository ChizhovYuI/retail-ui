// tslint:disable:jsx-no-lambda
import * as React from 'react';
import { storiesOf } from '@storybook/react';
import CurrencyInput from '../CurrencyInput';
import Gapped from '../../Gapped';
import Button from '../../Button';
import Toggle from '../../Toggle';
import { Nullable } from '../../../typings/utility-types';

interface CurrencyInputDemoProps {
  borderless?: boolean;
}

interface CurrencyInputDemoState {
  value: Nullable<number>;
  signed: boolean;
  digits: Nullable<number>;
}

class CurrencyInputDemo extends React.Component<
  CurrencyInputDemoProps,
  CurrencyInputDemoState
> {
  public state: CurrencyInputDemoState = {
    value: null,
    signed: false,
    digits: 2
  };

  public render() {
    return (
      <Gapped vertical gap={20}>
        <Gapped gap={10}>
          <Button onClick={() => this.setState({ value: 0 })}>
            Set <b>0</b>
          </Button>
          <Button onClick={() => this.setState({ value: null })}>
            Set <b>null</b>
          </Button>
          <Button onClick={this._handleRand}>
            Set <b>rand</b>
          </Button>
        </Gapped>
        <CurrencyInput
          borderless={this.props.borderless}
          value={this.state.value}
          fractionDigits={this.state.digits}
          signed={this.state.signed}
          onChange={this._handleChange}
        />
        <div>
          value: <b>{this._formatValue(this.state.value)}</b>
        </div>
        <div>
          <span>signed: </span>
          <Toggle checked={this.state.signed} onChange={this._handleSigned} />
        </div>
        <input
          type="range"
          value={this.state.digits == null ? 15 : this.state.digits}
          min={0}
          max={15}
          onChange={this._handleDigits}
        />
        <div>
          digits: <b>{this._formatValue(this.state.digits)}</b>
        </div>
      </Gapped>
    );
  }

  private _handleChange = (event: any, value: Nullable<number>) => {
    this.setState({ value });
  };

  private _handleRand = () => {
    const fraction = this.state.digits == null ? 4 : this.state.digits;
    const length = Math.min(15, 7 + fraction);
    const rand = Math.floor(Math.random() * Math.pow(10, length));
    const value = rand / Math.pow(10, fraction);
    this.setState({ value });
  };

  private _handleDigits = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      value: null,
      digits:
        event.target.value === '15' ? null : parseInt(event.target.value, 10)
    });
  };

  private _handleSigned = (value: boolean) => {
    this.setState({
      value: null,
      signed: value
    });
  };

  private _formatValue = (value: Nullable<number>): string => {
    return value == null ? 'null' : value.toString();
  };
}

storiesOf('CurrencyInput', module)
  .add('Demo', () => <CurrencyInputDemo />)
  .add('With borderless', () => <CurrencyInputDemo borderless={true} />);
