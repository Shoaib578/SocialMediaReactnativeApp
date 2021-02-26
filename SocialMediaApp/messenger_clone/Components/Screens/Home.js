import React from 'react'
import main_styles from '../Style/main'
import {View,Text, ActivityIndicator, FlatList,TouchableOpacity,Dimensions,Image,TextInput, ScrollView,Keyboard,TouchableWithoutFeedback, Alert, Button,} from 'react-native'
import Axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Icon from 'react-native-vector-icons/FontAwesome';
import PushNotification from "react-native-push-notification";

const DismissKeyboard = ({ children }) => (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      {children}
    </TouchableWithoutFeedback>
  );
  



class Home extends React.Component {







    state = {
   
     all_users:[],
     is_loading:true,
     user_info:'',
     search_user:'',
     notfound_msg:'',
    


    }
  
   
    

//   pushNot = (user,msg)=>{
//     PushNotification.localNotification({
//         /* Android Only Properties */
        
       
       
//         color: "#00ffff", // (optional) default: system default
//         vibrate: true, // (optional) default: true
//         vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
       
      
        
//         title: "SDM", // (optional)
//         message: user+' '+msg, // (required)
     
//         playSound: true, // (optional) default: true
//         soundName: "default", // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
        
      
//       });
//   }



    GetAllUsers = async()=>{
      
        const user = await AsyncStorage.getItem('user')
        const parse = JSON.parse(user)
        this.setState({user_info: parse})
        
        Axios.get('http://192.168.10.2:5000/all_users?my_id='+parse.user_id+'&&want_to_search_user=false')
        .then(res=>{
            
            this.setState({all_users:res.data.users,is_loading:false})
         
            
        })
        .catch(err=>console.log(err))
    }

   


   
    
     componentDidMount(){
    
     


     
     this.GetAllUsers()
     
     setInterval(()=>{
         this.GetAllUsers()
     },10000)
    
    

   
        }


    
    render(){
        if(!this.state.is_loading){

        return (
            <DismissKeyboard>
            <View style={{flex:1,alignItems:'center',backgroundColor:'#101010',
            alignContent:'center'}}>
            

                <Text style={{padding:5}}> </Text>
                 <View style={{flexDirection:'row',}}>

                 <TextInput placeholder="Search Users" 
                 
                 placeholderTextColor='white' style={{width:180,height:30,borderRadius:4,
                 borderColor:'#00ffff',backgroundColor:'#00ffff',padding:5,alignSelf:'center'}}
                 onChangeText={async(val)=>{
                    this.setState({search_user:val})

                    if(this.state.search_user.length>0){
                        
                    const user = await AsyncStorage.getItem('user')
                    const parse = JSON.parse(user)
                    Axios.get('http://192.168.10.2:5000/all_users?my_id='+parse.user_id+'&&want_to_search_user=true'+'&&user_name='+this.state.search_user) 

                    .then(res=>{
                            
                            this.setState({all_users:res.data.users,notfound_msg:''})
                            if(res.data == "Could'nt Found User"){
                                this.setState({notfound_msg:res.data})
                            }else{
                                this.setState({notfound_msg:''})
                            }
                    
                    
                    })
                    .catch(err=>console.log(err))
                }else{
                    this.GetAllUsers()
                }

                 }}
                 
                 
                 />
                 <TouchableOpacity style={{left:8}} onPress={()=>Keyboard.dismiss()}>
                 <Icon name='search' color='#00ffff' size={28}/>
                 
                 </TouchableOpacity>
              

                 </View>
             
             {this.state.notfound_msg.length>0?
             <View style={{color:'white',fontSize:20,marginTop:80,alignSelf:'center',alignContent:"center"}}>
                 <Icon name='exclamation-circle' color='red' size={60} style={{textAlign:'center'}}/>
               <Text style={{color:'white',fontSize:20,marginTop:10}}>{this.state.notfound_msg}</Text>

             </View>
             
             
             :null}

             <ScrollView style={{width:'100%',left:'10%'}}>
             <View style={{marginTop:50}}>

             <FlatList
             data={this.state.all_users}
             keyExtractor={(item)=>item.user_id}
             renderItem={({item})=>{
                 return(
                     <TouchableOpacity style={{borderWidth:.5,borderColor:'#00ffff',width:Dimensions.get('window').width*2/2.5,height:50,borderRadius:4,flexDirection:'row',backgroundColor:'#00ffff',marginTop:30}} onPress={()=>{
                       
                        this.props.navigation.navigate('Message',{user_id:item.user_id,my_id:this.state.user_info.user_id})
                     
                     }}>
                     <Image source={{uri:'http://192.168.10.2:5000/static/profile_pic/'+item.profile_pic}} style={{width:40,height:40,borderRadius:100,top:6,marginLeft:20}} />
                     <Text style={{color:'white',textAlign:'center',fontSize:20,left:20,top:12,fontWeight:'bold',}}>{item.user_name}</Text>
                  

                     {item.notifications_count>0?<View style={{textAlign:'right',borderWidth:.5,borderColor:'red',backgroundColor:'red',borderRadius:100,height:20,width:20,alignItems:'center',left:120,}}>
                     <Text style={{color:'white'}}>{item.notifications_count}</Text>
                     </View>:null}

                     </TouchableOpacity>
                 )
             }}
             
             />
             </View>
             </ScrollView>
            </View>
            </DismissKeyboard>
        )
    }else{
        return <View style={{flex:1,alignItems:'center',backgroundColor:'#101010',
        alignContent:'center'}}>
            
            <ActivityIndicator color='#00ffff' size={30} style={{marginTop:60}}/>
            </View>
            
    }

    }
}


export default Home