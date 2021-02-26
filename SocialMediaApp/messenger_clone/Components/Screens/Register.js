import React from 'react'
import main_styles from '../Style/main'
import {View,Text,TextInput,Dimensions,Image,TouchableOpacity,Alert,TouchableWithoutFeedback,Keyboard, ScrollView} from 'react-native'
import AwesomeButton from "react-native-really-awesome-button";
import pick_account_image from '../Images/pick_account_image.png'
import Axios from 'axios'
import {launchImageLibrary} from 'react-native-image-picker';

const DismissKeyboard = ({ children }) => (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      {children}
    </TouchableWithoutFeedback>
  );

class Register extends React.Component {
   
   

    
    state = {
        username:'',
        email:'',
        password:'',
        profile_pic: pick_account_image,

        //Errors
        username_error_state:'',
        email_error_state:'',
        password_error_state:'',
        profile_pic_error_state:''
    }

 //<--------Start Validation----------->

 validate = () =>{
    let username_error = ''
    let email_error = ''
    let password_error = ''
    let profile_pic_error = ''
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if(this.state.username.length<=8){
        username_error = 'Username Must Be at least 8 characters'
    }

    if(reg.test(this.state.email) == false){
     email_error = 'Invalid Email'
    }

    if(this.state.password.length<=8){
        password_error = 'Password Must Be at least 8 characters'
    }

    if(!this.state.profile_pic.uri){
        profile_pic_error = 'Please Choose a Profile Picture'
    }

    if(username_error || email_error || password_error || profile_pic_error){
        this.setState({username_error_state: username_error, email_error_state: email_error,password_error_state: password_error, profile_pic_error_state: profile_pic_error})
        return false
    }

    return true


}

//<--------End Validation----------->


//<-----Register User Start------->

Register = (event)=>{
    
    let is_validate = this.validate()
    if(is_validate){
    this.setState({ username_error_state:'',
    email_error_state:'',
    password_error_state:'',
    profile_pic_error_state:''})

    
    let formData = new FormData()
    formData.append('username',this.state.username)
    formData.append('email',this.state.email)
    formData.append('password',this.state.password)
    formData.append('profile_pic',{
        name: this.state.profile_pic.fileName,
        type: this.state.profile_pic.type,
        uri:
        Platform.OS === 'android' ? this.state.profile_pic.uri : this.state.profile_pic.uri.replace('file://', ''),
    })
    
    Axios.post('http://192.168.10.7:5000/register_user',formData)
    .then(res=>{
        if(res.data == 'You are Registered Successfully'){
            this.setState({email:'',password:'',username:'',profile_pic:pick_account_image})
           
        }
           
        
       
        Alert.alert(res.data)
        
    })
    .catch(err=>console.log(err))
    
    }
}



//<-----Register User End------->




//<-------Pick Image Start----->

PickImage = ()=>{
    const options = {
        
    }
    launchImageLibrary(options, response=>{
        if(response.uri){
            this.setState({profile_pic:response})

        }
    })
}

//<-------Pick Image End----->





    render(){




       


        return (
            <DismissKeyboard>
            <View style={{flex:1,alignItems:'center',backgroundColor:'#101010',
            alignContent:'center'}}>
             

           <TouchableOpacity style={{top:120}} onPress={this.PickImage}>
           <Image source={this.state.profile_pic} style={{width:90,height:90,borderRadius:100}}/>

           </TouchableOpacity>
           <Text style={{color:'red',fontSize:15,fontWeight:'bold',top:120}}>{this.state.profile_pic_error_state}</Text>

           
           <TextInput placeholder='Username' placeholderTextColor='#00ffff' style={{width:Dimensions.get('window').width*2/2.5,height:50,borderRadius:4,borderColor:'#2E2E2D',borderWidth:.5,marginTop:150,padding:15,color:'#00ffff',backgroundColor:'#2E2E2D',fontSize:15}} onChangeText={(val)=>this.setState({username:val})} value={this.state.username}/>
           <Text style={{color:'red',fontSize:15,fontWeight:'bold'}}>{this.state.username_error_state}</Text>
           <TextInput placeholder='Email' placeholderTextColor='#00ffff' style={{width:Dimensions.get('window').width*2/2.5,height:50,borderRadius:4,borderColor:'#2E2E2D',borderWidth:.5,marginTop:20,padding:15,color:'#00ffff',backgroundColor:'#2E2E2D',fontSize:15}} onChangeText={(val)=>this.setState({email:val})} value={this.state.email}/>

           <Text style={{color:'red',fontSize:15,fontWeight:'bold'}}>{this.state.email_error_state}</Text>

           <TextInput placeholder='Password' secureTextEntry placeholderTextColor='#00ffff' style={{width:Dimensions.get('window').width*2/2.5,height:50,borderRadius:4,borderColor:'#2E2E2D',borderWidth:.5,marginTop:20,padding:15,color:'#00ffff',backgroundColor:'#2E2E2D',fontSize:15}} onChangeText={(val)=>this.setState({password:val})} value={this.state.password}/>

           <Text style={{color:'red',fontSize:15,fontWeight:'bold'}}>{this.state.password_error_state}</Text>

           <AwesomeButton
                        height={50}
                        style={{top:30}}
                        width={Dimensions.get('window').width*2/2.5}
                        backgroundShadow={null}
                        onPress={this.Register}
                        backgroundColor='#00ffff'
                        backgroundDarker='#00ffff'
                        >
                        <Text style={{fontSize:20,color:'white',fontWeight:'bold'}}>Register</Text>
                        </AwesomeButton>
                        
            </View>
            </DismissKeyboard>
        )
    }
}


export default Register