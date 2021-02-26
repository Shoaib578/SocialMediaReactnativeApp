import React from 'react'
import main_styles from '../Style/main'
import {View,Text,TextInput,Dimensions,Alert,TouchableWithoutFeedback,Keyboard} from 'react-native'
import AwesomeButton from "react-native-really-awesome-button";
import AsyncStorage from '@react-native-async-storage/async-storage'
import Axios from 'axios'


const DismissKeyboard = ({ children }) => (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      {children}
    </TouchableWithoutFeedback>
  );


class Login extends React.Component {
    
    state = {
        username:'',
        password:'',
      
        //Errors
        username_error_state:'',
        password_error_state:'',
        
    }

 //<--------Start Validation----------->

 validate = () =>{
    let username_error = ''
  
    let password_error = ''
  
   
    if(this.state.username.length<=8){
        username_error = 'Username Must Be at least 8 characters'
    }

   
    if(this.state.password.length<=8){
        password_error = 'Password Must Be at least 8 characters'
    }

   
    if(username_error  || password_error ){
        this.setState({username_error_state: username_error, password_error_state: password_error})
        return false
    }

    return true


}

//<--------End Validation----------->



//<-----Login start--------->
Login = async()=>{
let is_validate = this.validate()
if(is_validate){
    this.setState({username_error_state:'',
    password_error_state:'',})
    
    let formData = new FormData()
    formData.append('username',this.state.username)
    formData.append('password',this.state.password)
  await  Axios.post('http://192.168.10.2:5000/login_user',formData)
    .then(res=>{
        if(res.data.msg == 'Logged In'){
            AsyncStorage.setItem('user',JSON.stringify(res.data.user_info))
            this.props.navigation.reset({
                index:0,
                routes:[{name:'Home'}],
               
            });
        }else{
            Alert.alert(res.data.msg)
        }
    })
}
}

//<------Login End------->





    render(){

      
        return (
            <DismissKeyboard>

            <View style={{flex:1,alignItems:'center',backgroundColor:'#101010',
            alignContent:'center'}}>
           <TextInput placeholder='Username' placeholderTextColor='#00ffff' style={{width:Dimensions.get('window').width*2/2.5,height:50,borderRadius:4,borderColor:'#2E2E2D',borderWidth:.5,marginTop:180,padding:15,color:'#00ffff',backgroundColor:'#2E2E2D',fontSize:15}} onChangeText={(val)=>this.setState({username:val})}/>
           <Text style={{color:'red',fontSize:15,fontWeight:'bold'}}>{this.state.username_error_state}</Text>

           <TextInput placeholder='Password' secureTextEntry placeholderTextColor='#00ffff' style={{width:Dimensions.get('window').width*2/2.5,height:50,borderRadius:4,borderColor:'#2E2E2D',borderWidth:.5,marginTop:30,padding:15,color:'#00ffff',backgroundColor:'#2E2E2D',fontSize:15}} onChangeText={(val)=>this.setState({password:val})}/>
           <Text style={{color:'red',fontSize:15,fontWeight:'bold'}}>{this.state.password_error_state}</Text>

           <AwesomeButton
                        height={50}
                        style={{top:30}}
                        width={Dimensions.get('window').width*2/2.5}
                        backgroundShadow={null}
                        onPress={this.Login}
                        backgroundColor='#00ffff'
                        backgroundDarker='#00ffff'
                        >
                        <Text style={{fontSize:20,color:'white',fontWeight:'bold'}}>Login</Text>
                        </AwesomeButton>
            </View>
            </DismissKeyboard>

        )
    }
}


export default Login