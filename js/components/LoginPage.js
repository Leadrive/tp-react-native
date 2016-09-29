import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    ToolbarAndroid,
    Platform,
    ActivityIndicator,
    TextInput,
    Modal,
    Alert,
    InteractionManager,
} from 'react-native';
import Page from './Page'
import * as Api from '../Api'
import TPButton from 'TPButton'
import TPColors from '../common/TPColors'
import HomePage from './HomePage'
import Icon from 'react-native-vector-icons/Ionicons';
var Fabric = require('react-native-fabric');
var { Answers } = Fabric;


export default class LoginPage extends Component {

    constructor() {
        super();
        this.state = ({
            username: '',
            password: '',
            loading: false,
        });
    }

    _usernameSubmit() {
        this.refs.inputPw.focus();
    }

    _passwordSubmit() {
        this._login()
    }

    _cancel() {

    }

    async _login() {
        if (this.state.username.length == '') {
            Alert.alert('提示','请输入登录邮箱');
            return;
        }
        if (this.state.password.length == '') {
            Alert.alert('提示','请输入密码');
            return;
        }
        this.setState({loading: true});
        try {
            const result = await Api.login(this.state.username, this.state.password);
            if (result) {
                Answers.logLogin('Email', true);
                this.props.navigator.resetTo({
                    name: 'HomePage',
                    component: HomePage
                });
            } else {
                Answers.logLogin('Email', false);
                Alert.alert('登录失败', '用户名或密码不正确',
                    [{text: '确定', onPress: () => this.setState({loading: false})}]);
            }
        } catch(err) {
            Answers.logLogin('Email', false);
            Alert.alert('登录失败', err.message,
                [{text: '确定', onPress: () => this.setState({loading: false})}]);
        }
    }


    render() {
        return (
            <Image resizeMode='cover'
                   style={{flex: 1, width: undefined, height: undefined, backgroundColor: "white"}}>
                <View style={{flex: 1, paddingTop: 100, paddingHorizontal: 20}}>
                    <Modal
                        visible={this.state.loading}
                        transparent={true}
                        onRequestClose={this._cancel.bind(this)}>
                        <View style={{
                            flex: 1,
                            justifyContent: "center",
                            alignItems: "center",
                            backgroundColor: "rgba(255, 255, 255, 0.8)"
                        }}>
                            <ActivityIndicator animating={true} color={TPColors.light}/>
                        </View>
                    </Modal>
                    <Text style={{fontSize: 26, paddingBottom: 40, color: '#222', textAlign: 'center'}}>欢迎来到胶囊日记</Text>
                    <View style={styles.inputBox}>
                        <View style={{flexDirection: 'row'}}>
                            <View style={styles.icon_box}>
                                <Icon name="ios-mail-outline" size={20} color={TPColors.inactiveText}
                                      style={{paddingTop: 2}}/>
                            </View>
                            <TextInput
                                style={styles.input}
                                onChangeText={(text) => this.setState({username: text})}
                                value={this.state.username}
                                onSubmitEditing={this._usernameSubmit.bind(this)}
                                keyboardType="email-address"
                                autoCorrect={false}
                                autoFocus={false}
                                autoCapitalize="none"
                                returnKeyType="next"
                                placeholderTextColor={TPColors.inactiveText}
                                placeholder="登录邮箱"/>
                        </View>
                        <View style={styles.line} />
                        <View style={{flexDirection: 'row'}}>
                            <View style={styles.icon_box}>
                                <Icon name="ios-medical-outline" size={18} color={TPColors.inactiveText}
                                      style={{paddingTop: 1}}/>
                            </View>
                            <TextInput
                                ref="inputPw"
                                style={styles.input}
                                onChangeText={(text) => this.setState({password: text})}
                                value={this.state.password}
                                onSubmitEditing={this._passwordSubmit.bind(this)}
                                autoCorrect={false}
                                placeholder="密码"
                                placeholderTextColor={TPColors.inactiveText}
                                secureTextEntry={true}
                                returnKeyType="done"
                                selectTextOnFocus={true}/>
                        </View>
                    </View>
                    <TPButton
                        caption="登录"
                        onPress={this._login.bind(this)}
                        type="bordered"
                        style={{marginTop: 25, marginHorizontal: 30}}/>

                </View>
            </Image>
        );
    }
}

const styles = StyleSheet.create({
    inputBox: {
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 10,
    },
    line: {
        borderColor: '#ccc',
        borderTopWidth: 1,
    },
    input: {
        flex: 1,
        height: 45,
        padding: 10,
        paddingLeft: 0,
        fontSize: 13,
    },
    icon_box: {
        width: 42,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 0.7,
    }
});
