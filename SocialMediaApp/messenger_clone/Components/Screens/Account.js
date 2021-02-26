import React from 'react'
import {View,Text,TouchableOpacity,Image} from 'react-native'
import Axios from 'axios'
import main_styles from '../Style/main'
import AsyncStorage from '@react-native-async-storage/async-storage'
import AwesomeButton from "react-native-really-awesome-button";
import Icon from 'react-native-vector-icons/FontAwesome'
class Account extends React.Component {

   state = {
       user_info:[]
   }

    UserInfo = async()=>{
    const user = await AsyncStorage.getItem('user')
    const parse = JSON.parse(user)
    this.setState({user_info:parse})
    
    }

    logout = async()=>{
     await AsyncStorage.removeItem('user')
     this.props.navigation.reset({
        index:0,
        routes:[{name:'GetStart'}]
    })
     
    }

    async componentDidMount(){
      await  this.UserInfo()
       
    }
    render(){
        return (
            <View style={{flex:1,alignItems:'center',backgroundColor:'#101010',
            alignContent:'center',}}>
            
            
                 <Image source={{uri:'http://192.168.10.7:5000/static/profile_pic/'+this.state.user_info.profile_pic}} style={{width:130,height:130,borderRadius:100,marginTop:80}} />
                 <Text style={{color:'#00ffff',fontSize:25,top:10}}>{this.state.user_info.user_name}</Text>
                 <Text style={{height:0,width:'80%',borderColor:'#00ffff',borderWidth:.5,top:20}}> </Text>

                 <View style={{width:'80%',borderColor:'#00ffff',borderWidth:.5,top:80,height:'30%',opacity:.6,backgroundColor:'#00ffff',borderRadius:4,padding:8,alignSelf:'center'}}>
                     <Text style={{textAlign:'center',color:'#00ffff',fontSize:25,fontWeight:'bold'}}>Guide</Text>
                     <View style={{top:10,left:10}}>
                     <Text style={{color:'#00ffff',fontSize:18}}><Text style={{fontWeight:'bold',color:'white'}}>{this.state.user_info.user_name}</Text> You have the Ability to Customize your Account 
                  Details By Pressing Button on top.You can also Logout By Pressing Button Below.Thanks for Using Our App
                  
                  </Text>
                     </View>
                   
                 </View>

                 <AwesomeButton
                        style={{alignSelf:'center',marginTop:70,left:'4.5%'}}
                        
                        width={'90%'}
                        backgroundShadow={null}
                        onPress={this.logout}
                        backgroundColor='#00ffff'
                        backgroundDarker='#00ffff'
                        >
                        <Text style={{fontSize:20,color:'white',fontWeight:'bold'}}>Logout</Text>
                        </AwesomeButton>
                

            </View>
        )
    }
}

export default Account