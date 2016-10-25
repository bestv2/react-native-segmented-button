import React, { Component, PropTypes } from 'react';
import ReactNative, {
    StyleSheet,
    Text,
    Image,
    View,
    Animated,
    ScrollView,
    TouchableHighlight,
    PixelRatio,
    Platform,
    Dimensions,
    TouchableOpacity
} from "react-native"
let screen = Dimensions.get('window');
let styles = StyleSheet.create({
    scrollOuter: {
        //width: 40
    },
    navBar: {
        width: screen.width,
        flexDirection: 'column',
    },

    navItem: {
        marginLeft: 5,
        marginRight: 5,
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 7,
        paddingRight: 7,
        alignItems: 'center',
        height: 45,
    },
    navItemText: {
        marginTop: 6,
        fontSize: 13,
    },
    activeBottom: {
        position: 'absolute',
        left: 0,
        bottom: 1,
        marginTop: 2,

    },
    activeBottomLine: {
        borderBottomWidth: 1,
    }
});
let bottomAdded = -15;
export default class SegmentedButton extends Component {
    static defaultProps = {
        tinyColor: '#434343',
        activeTinyColor: '#00afa5'
    }
    static propTypes = {
        items: PropTypes.array.isRequired,
    };
    constructor(props) {
        super(props);
        this.state = {
            activeIndex: this.props.activeIndex || 0,
            x: new Animated.Value(0),
            abWidth: new Animated.Value(0)
        }
    }

    getActiveIndex() {
        return this.state.activeIndex;
    }

    componentDidMount() {

        var thiz = this;

        if(!thiz.props.items || !thiz.props.items.length){
            return null
        }
        setTimeout(() => {
            console.log(123);
            thiz.refs[0].measureLayout(
                ReactNative.findNodeHandle(thiz.refs.scrollView),
                (ox, oy, width, height, pageX, pageY) => {

                    Animated.parallel([          // 在decay之后并行执行：
                        Animated.spring(  // 支持: spring, decay, timing，过渡的动画方式
                            thiz.state.abWidth,
                            {
                                toValue: width + bottomAdded, // 目标值
                                friction: 7 // 动画方式的参数
                            }
                        ),
                        Animated.spring(  // 支持: spring, decay, timing，过渡的动画方式
                            thiz.state.x,
                            {
                                toValue: ox - bottomAdded / 2,  // 目标值
                                friction: 7 // 动画方式的参数
                            }
                        ),
                    ]).start();

                }
            );
        }, 0);
    }

    _onSegmentBtnPress(e, index) {
        var thiz = this;

        thiz.setState({
            activeIndex: index,

        });
        var item = thiz.refs[index];
        item.measureLayout(
            ReactNative.findNodeHandle(thiz.refs.scrollView),
            (ox, oy, width, height, pageX, pageY) => {

                Animated.parallel([
                    Animated.spring(
                        thiz.state.abWidth,
                        {
                            toValue: width + bottomAdded,
                            friction: 7
                        }
                    ),
                    Animated.spring(
                        thiz.state.x,
                        {
                            toValue: ox - bottomAdded / 2,
                            friction: 7
                        }
                    ),
                ]).start();
            }
        );

        thiz.props.onSegmentBtnPress(e, index);
    }

    render() {
        var thiz = this;
        var navItems = thiz.props.items;
        if(!navItems || !navItems.length){
            return null
        }
        var activeItemIndex = thiz.state.activeIndex;
        var doms = navItems.map(function (item, index) {
            let key = `segment_${index}`;
            let label;
            if(typeof item === 'string'){
                label = item;
            }else {
                label = item.text;
            }
            if (activeItemIndex == index) {
                return (
                    <TouchableOpacity style={[styles.navItem,{marginBottom:1.5}]} key={key} ref={index}>
                        <Text style={[styles.navItemText,{color: thiz.props.activeTinyColor}]}>{label}</Text>
                    </TouchableOpacity>
                );
            } else {
                return (
                    <TouchableOpacity style={[styles.navItem,{}]} key={key} ref={index} onPress={(e)=>{

                        thiz._onSegmentBtnPress(e,index);
                    }}>
                        <Text style={[styles.navItemText,{color: thiz.props.tinyColor}]}>{label}</Text>
                    </TouchableOpacity>
                );
            }

        });
        return (
            <View style={[styles.scrollOuter,{alignItems:'flex-start',justifyContent: 'center'},thiz.props.style]}>
                <ScrollView
                    ref="scrollView"
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    directionalLockEnabled={true}
                    automaticallyAdjustContentInsets={false}
                >
                    {doms}
                    <Animated.View style={[styles.activeBottom,styles.activeBottomLine,{borderColor: thiz.props.activeTinyColor},{
                    width:thiz.state.abWidth,
                    transform: [                        // `transform`是一个有序数组（动画按顺序执行）
                        {translateX: thiz.state.x},
                    ]
                    }]} ref="activeBottom">
                    </Animated.View>
                </ScrollView>
            </View>
        );
    }
}