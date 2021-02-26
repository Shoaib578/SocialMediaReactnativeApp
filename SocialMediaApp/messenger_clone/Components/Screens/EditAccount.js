import React from 'react';
import {View,Text,Image,TouchableOpacity,TextInput,Dimensions,TouchableWithoutFeedback, Alert,Keyboard,} from 'react-native'
import Axios from 'axios'
import Icon from 'react-native-vector-icons/FontAwesome';
import main_styles from '../Style/main'
import AsyncStorage from '@react-native-async-storage/async-storage'
import AwesomeButton from "react-native-really-awesome-button"
import {launchImageLibrary} from 'react-native-image-picker';

const DismissKeyboard = ({ children }) => (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      {children}
    </TouchableWithoutFeedback>
  );

class EditAccount extends React.Component {
    state = {
        user_info:[],
        username:'',
        email:'',
        password:'',
        profile_pic: '',

        //Errors
        username_error_state:'',
        email_error_state:'',
        password_error_state:'',
       
    }

    

    UserInfo = async()=>{
        const user = await AsyncStorage.getItem('user')
        const parse = JSON.parse(user)
        this.setState({user_info:parse})
        
        }
    

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





//<--------Start Validation----------->

validate = () =>{
    let username_error = ''
    let email_error = ''
    let password_error = ''
    
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;


    if(this.state.username.length>0 && this.state.username.length<=8){
        username_error = 'Username Must Be at least 8 characters'
    }

    if(this.state.email.length>0 && reg.test(this.state.email) == false){
     email_error = 'Invalid Email'
    }

    if(this.state.password.length>0 && this.state.password.length<=8){
        password_error = 'Password Must Be at least 8 characters'
    }

   

    if(username_error || email_error || password_error ){
        this.setState({username_error_state: username_error, email_error_state: email_error,password_error_state: password_error, })
        return false
    }

    return true


}

//<--------End Validation----------->




UpdateAccount = async()=>{
    let is_valid = this.validate()
    if(is_valid){
        if(this.state.email.length>0 || this.state.password.length>0 || this.state.username.length>0 ||  this.state.profile_pic.uri){

        let formData = new FormData()
        formData.append('user_id',this.state.user_info.user_id)
        if(this.state.email.length>0){
            formData.append('email',this.state.email)
        }

        if(this.state.username.length>0){
            formData.append('username',this.state.username)
        }

        if(this.state.password.length>0){
            formData.append('password',this.state.password)
        }

        if(this.state.profile_pic.uri){
           
            formData.append('old_profile_pic',this.state.user_info.profile_pic)

            formData.append('profile_pic',{
                name: this.state.profile_pic.fileName,
                type: this.state.profile_pic.type,
                uri:
                Platform.OS === 'android' ? this.state.profile_pic.uri : this.state.profile_pic.uri.replace('file://', ''),
            })
        }


       await Axios.post('http://192.168.10.7:5000/edit_account',formData)
        .then(res=>{
            Alert.alert(res.data.msg)
            AsyncStorage.getItem('user')
            .then(data=>{
                const parse = JSON.parse(data)

                parse.user_name = res.data.user_info.user_name
                parse.email = res.data.user_info.email
                parse.password = res.data.user_info.password
                parse.profile_pic = res.data.user_info.profile_pic

                AsyncStorage.setItem( 'user', JSON.stringify( parse ) );
                this.UserInfo()
                this.setState({ username_error_state:'',
                email_error_state:'',
                password_error_state:'',})
            }).done()
           
        })
        .catch(err=>console.log(err))
    }else{
        Alert.alert('There is Nothing to Update')
    }

    }
}





    async componentDidMount(){
        await  this.UserInfo()
           
    }

    render() {
        


        return(
            <DismissKeyboard>
            <View style={{flex:1,alignItems:'center',backgroundColor:'#101010',
            alignContent:'center'}}>
            
            <TouchableWithoutFeedback onPress={this.PickImage}>
            
           <Image source={this.state.profile_pic.uri?this.state.profile_pic:{uri:'http://192.168.10.7:5000/static/profile_pic/'+this.state.user_info.profile_pic}} style={{width:130,height:130,borderRadius:100,marginTop:80}} />
          
           </TouchableWithoutFeedback>

                 <Text style={{color:'#00ffff',fontSize:25,top:10}}>{this.state.user_info.user_name}</Text>
                 <Text style={{height:0,width:'80%',borderColor:'#00ffff',borderWidth:.5,top:20}}> </Text>




                 <TextInput placeholder={this.state.user_info.user_name} placeholderTextColor='#00ffff' style={{width:Dimensions.get('window').width*2/2.5,height:50,borderRadius:4,borderColor:'#2E2E2D',borderWidth:.5,marginTop:50,padding:15,color:'#00ffff',backgroundColor:'#2E2E2D',fontSize:15}} onChangeText={(val)=>this.setState({username:val})} value={this.state.username}/>
           <Text style={{color:'red',fontSize:15,fontWeight:'bold'}}>{this.state.username_error_state}</Text>
           <TextInput placeholder={this.state.user_info.email} placeholderTextColor='#00ffff' style={{width:Dimensions.get('window').width*2/2.5,height:50,borderRadius:4,borderColor:'#2E2E2D',borderWidth:.5,marginTop:20,padding:15,color:'#00ffff',backgroundColor:'#2E2E2D',fontSize:15}} onChangeText={(val)=>this.setState({email:val})} value={this.state.email}/>

           <Text style={{color:'red',fontSize:15,fontWeight:'bold'}}>{this.state.email_error_state}</Text>

           <TextInput placeholder='Password' secureTextEntry placeholderTextColor='#00ffff' style={{width:Dimensions.get('window').width*2/2.5,height:50,borderRadius:4,borderColor:'#2E2E2D',borderWidth:.5,marginTop:20,padding:15,color:'#00ffff',backgroundColor:'#2E2E2D',fontSize:15}} onChangeText={(val)=>this.setState({password:val})} value={this.state.password}/>

           <Text style={{color:'red',fontSize:15,fontWeight:'bold'}}>{this.state.password_error_state}</Text>

           <AwesomeButton
                        height={50}
                        style={{top:30}}
                        width={Dimensions.get('window').width*2/2.5}
                        backgroundShadow={null}
                        onPress={this.UpdateAccount}
                        backgroundColor='#00ffff'
                        backgroundDarker='#00ffff'
                        >
                        <Text style={{fontSize:20,color:'white',fontWeight:'bold'}}>Update</Text>
                        </AwesomeButton>
          </View>
          </DismissKeyboard>
        )
    }
}

export default EditAccount