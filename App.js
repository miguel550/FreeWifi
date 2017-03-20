import React from 'react';
import { StyleSheet, Text, View, ListView, TextInput, Clipboard, ToastAndroid} from 'react-native';
var wifi = require('react-native-android-wifi');



export default class App extends React.Component {
  constructor(){
    super();
    this.state = {wifi: []}
  }
  render() {
    
    wifi.loadWifiList((wifiStringList) => {
        this.setState({wifi: wifiStringList})
        
      },
      (error) => {
        console.log(error);
      }
    );

    return (
      <View style={styles.container}>
        <Text style={styles.textstyle}>Tu real hackeadol</Text>
        <UselessTextInput />
        <WifiList />
        <Text>{this.state.wifi}</Text>
      </View>
    );
  }
}
class WifiList extends React.Component {
  constructor() {
    super();
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows([]),
    };
    wifi.loadWifiList((wifiStringList) => {
        this.setState({dataSource: ds.cloneWithRows(JSON.parse(wifiStringList))})
        
      },
      (error) => {
        console.log(error);
      }
    );
  }
  render(){

    return (
      <ListView 
        dataSource={this.state.dataSource}
        renderRow={(rowData) => <WifiListElement data={rowData} />}
      />
    );
  }
}
class WifiListElement extends React.Component {
  render(){
    return (
      <Text>{this.props.data.BSSID}</Text>
    );
  }
}
class Display extends React.Component {
  constructor(props){
    super(props);
  }
  _setClipboardContent = async () => {
    Clipboard.setString(this.props.show);
    ToastAndroid.show('Copied!', ToastAndroid.SHORT);
  };
  render(){
    return (
      <Text onPress={this._setClipboardContent}>{this.props.show}</Text>
    );
  }
}
class UselessTextInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = { input1: {text: ''}, input2: {text: ''} };
    
  }
  clean(text, replacement){
    newtext = text.toLowerCase().replace(/:/g, '');
    newtext = newtext.substring(0, newtext.length - replacement.length) + replacement.toLowerCase();
    return newtext;
  }
  render() {
    return (
      <View style={styles.container}>
        <Text>Pega aqui el MAC address, mi local.</Text>
        <TextInput
          style={{height: 40, width: 200, borderColor: 'gray', borderWidth: 1}}
          onChangeText={(text) => this.setState({input1:{text}})}
          value={this.state.input1.text}
        />
        <Text>Pega aqui los 4 caracteres que quieres replazar, mi local.</Text>
        <TextInput
          style={{height: 40, width: 200, borderColor: 'gray', borderWidth: 1}}
          onChangeText={(text) => this.setState({input2:{text}})}
          value={this.state.input2.text}
        />
        <Text>Dale al resultado para que se copie, un placer haber ayudado.</Text>
        <Display show={this.clean(this.state.input1.text, this.state.input2.text)}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  textstyle: {
    color: 'blue',
    fontWeight: 'bold',
    fontSize: 30,
    padding: 30,
  }
});