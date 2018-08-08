import './style/index.tsx';
import PropTypes from 'prop-types';
import React, { CSSProperties } from 'react';
import Icon from '../icon';
import { PrinterPropTypes } from './PropsType';
import classnames from 'classnames';

/*
* Printer
* - It need two component as children, the first component is treated as the Detail component,
* the second component is treated as the Summary Component
* - The Summary component is show as default.
*/
export interface PrinterProps extends PrinterPropTypes {
  prefixCls?: string;
  disable?: boolean;
  height?: number;
  switchCls?: boolean;
  initialAnim?: boolean;
  onDropdown?: Function;
  onPushUp?: Function;
  style?: CSSProperties;
  props?: any;
}

const noop = () => {};

export default class Printer extends React.Component<PrinterProps, any> {
  static defaultProps = {
    prefixCls: 'am-printer',
    disable: false,
    height: 440,
    switchCls: false,
    children: null,
    initialAnim: false,
    onDropdown: noop,
    onPushUp: noop,
  };

  static propTypes = {
    prefixCls: PropTypes.string,
    show: PropTypes.bool,
    className: PropTypes.string,
    switchCls: PropTypes.bool,
    disable: PropTypes.bool,
    firstLoad: PropTypes.bool,
    onDropdown: PropTypes.func,
    onPushUp: PropTypes.func,
    top: PropTypes.number,
    initialAnim: PropTypes.bool,
  };

  contentHeigth: number;
  firstLoad: boolean;
  upCntrRef: any;
  downCntrRef: any;
  summaryHeight: number;
  height: number;
  timer: any;

  constructor(props: PrinterProps) {
    super(props);
    if (this.props.initialAnim) {
      this.state = {
        show: false,
        top: 0,
      };
    } else {
      this.state = {
        show: false,
        top: this.summaryHeight,
      };
    }

    this.contentHeigth = 0;
    this.summaryHeight = 0;
    this.firstLoad = true;
    // this.upCntrRef = null; // up container
  }

  setUpRef = (element: any) => {
    this.upCntrRef = element;
  }
  setDownRef = (element: any) => {
    this.downCntrRef = element;
  }
  // when change the tab, the printer go back to the initial position
  componentWillReceiveProps() {
    this.setState({
      show: false,
      top: this.summaryHeight,
    });
  }

  componentDidMount() {
    this.contentHeigth = this.upCntrRef.clientHeight + 5;
    this.summaryHeight = this.downCntrRef.clientHeight - 55;

    if (this.timer) {
      clearTimeout(this.timer);
    }
    this.timer = setTimeout(() => {
      if (this.props.initialAnim) {
        this.setState({
          top: this.summaryHeight,
        });
      }
    }, 500);
  }

  moreBtnClick = () => {
    if (this.state.show) {
      if (this.props.onPushUp) {
        this.props.onPushUp();
      }
      this.setState({
        top: this.summaryHeight,
        show: !this.state.show,
      });
    } else {
      if (this.props.onDropdown) {
        this.props.onDropdown();
      }
      this.setState({
        top: this.contentHeigth + this.summaryHeight,
        show: !this.state.show,
      });
    }
  }

  render() {
    const show = this.state.show;
    // get data from parent component props
    const { switchCls, disable, children, height, ...restProps } = this.props;
    let initialAnim = this.props.initialAnim;
    const prefixCls = 'am-printer';

    if (switchCls) {
      this.firstLoad = false;
      initialAnim = false;
    }
    const animationCls = {
      [`${prefixCls}-anim-cntr`]: true,
      [`${prefixCls}-pull-down`]: show,
      [`${prefixCls}-push-up`]: !show,
    };

    const movingCont = classnames({
      [`${prefixCls}-moving-cntr`]: true,
      // [`${prefixCls}-moving-cntr-disable`]: disable,
      [`${prefixCls}-anim-init-cntr`]: initialAnim && this.firstLoad,
    });

    let animationClass;
    if (this.firstLoad && initialAnim) {
      animationClass = classnames(animationCls);
    } else {
      animationClass = classnames({
        [`${prefixCls}-anim-switch`]: switchCls,
        [`${prefixCls}-anim-switch-alter`]: !switchCls,
        ...animationCls,
      });
    }

    const arrowAnimationClass = classnames({
      [`${prefixCls}-button-up`]: true,
      'arrow-rotate': show,
      'arrow-rotate-down': !show,
    });

    const downCntrCls = classnames({
      [`${prefixCls}-down-cntr`]: true,
      [`${prefixCls}-down-padding`]: disable,
    });

    const moreBtnDiv = !disable ? <div className={`${prefixCls}-button`} onClick={this.moreBtnClick}>
      <Icon type="down" color="#108EE9" size="xxs" className={arrowAnimationClass} />
    </div> : null;
    let upChildren;
    let downChildren;
    const kids = children as any;
    if (kids === null || kids.length === 0) {
      upChildren = null;
      downChildren = <div style={{ paddingTop: 50, color: 'red' }}>
      You should have two Components in tag "Printer"</div>;
    } else if (disable === true && kids && kids.length === 1) {
      upChildren = null;
      downChildren = kids && kids.length > 0 ? kids[0] : null;
    } else {
      upChildren = kids && kids.length > 0 ? kids[0] : null;
      downChildren = kids && kids.length > 1 ? kids[1] : null;
    }

    return (
      <div >
        <div className={`${prefixCls}-content-bg`} {...restProps} />
        <div className={`${prefixCls}-component-cntr`} style={{ 'height': height }}>
          <div className={`${prefixCls}-shadow`} >
            <img src="https://gw.alipayobjects.com/zos/rmsportal/DccDetWzhnADThjhTGyo.png" />
          </div>
          <div className={movingCont} style={{ 'top': this.state.top }}>
            <div className={animationClass} >
              <div className={`${prefixCls}-up`} >
                <div className={`${prefixCls}-up-ctnr`} ref={this.setUpRef}>
                  <div className={`${prefixCls}-content-ctnr`}>
                    {upChildren}
                  </div>
                </div>
                <div className={`${prefixCls}-divider-cntr`}>
                  <img src="https://gw.alipayobjects.com/zos/rmsportal/xUwjaISefFdAFfOfbBOR.png" />
                </div>
              </div>
              <div className={downCntrCls} ref={this.setDownRef} >
                {downChildren}
                {moreBtnDiv}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
