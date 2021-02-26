import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import {View,Image,Text,TouchableOpacity,TextInput,Keyboard} from 'react-native'
import title from '../Images/title.png'
import main_styles from '../Style/main'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Login from './Login'
import Register from './Register'
import Home from './Home'
import GetStart from './GetStart'
import Message from './message'
import Account from './Account'
import Icon from 'react-native-vector-icons/FontAwesome';
import EditAccount from './EditAccount'
import pick_account_image from '../Images/pick_account_image.png'


const LoggedinStack = createStackNavigator()
const WithoutLoggedinStack = createStackNavigator()
const HomeStack = createStackNavigator()



class Routes extends React.Component{
   
    state = {
        is_loggedin : false,
        is_loading : true,
        profile_pic :'',
        user_id:'',
     
    }

    
    CheckUserLoggedIn = async()=>{
      const user = await AsyncStorage.getItem('user')
      const parse = JSON.parse(user)
     
      if(parse == null){
          this.setState({is_loggedin:false})
      }else{
          this.setState({is_loggedin:true,profile_pic:parse.profile_pic,user_id:parse.user_id})
      }
    }





     componentDidMount(){
        
        setTimeout(()=>{
            this.setState({is_loading:false})
        },1000)
       
         this.CheckUserLoggedIn()

    }
  
    header_right = (navigation)=>(
        
   
        
        <View style={{flexDirection:'row'}}>
       
        


  <TouchableOpacity style={{marginRight:10}} onPress={()=>navigation.navigate('Account',{user_id:this.state.user_id})}>
        <Icon name='user-circle' color='#00ffff' size={35} style={{marginRight:20}} />
        
        </TouchableOpacity>

        </View>
       
    )

    header_right_account = (navigation)=>(
        <TouchableOpacity style={{right:30}} onPress={()=>navigation.navigate('Edit Account')}>
            <Icon name='edit' size={40} color='#00ffff'/>
        </TouchableOpacity>
    )

    

  HomeStackScreen = ({navigation})=>(
      <HomeStack.Navigator  screenOptions={{gestureEnabled:true,gestureDirection:'horizontal', cardStyleInterpolator:CardStyleInterpolators.forHorizontalIOS,}}>
      <HomeStack.Screen name='Home' component={Home} options={{headerTransparent:true,headerTintColor:'#00ffff',headerRight:()=>this.header_right(navigation),headerStyle:{backgroundColor:'#101010'}}}/>
      <HomeStack.Screen name='Account' component={Account} options={{headerTransparent:false,headerTintColor:'#00ffff',headerRight:()=>this.header_right_account(navigation),headerStyle:{backgroundColor:'#101010'}}}/>
      <HomeStack.Screen name='Edit Account' component={EditAccount} options={{headerTransparent:false,headerTintColor:'#00ffff',headerStyle:{backgroundColor:'#101010'}}}/>
      <HomeStack.Screen name='Message' component={Message} options={{headerTransparent:false,headerTintColor:'#00ffff',headerRight:()=>this.header_right(navigation),headerStyle:{backgroundColor:'#101010'}}}/>
     {/* After Logout */}
      <WithoutLoggedinStack.Screen name='GetStart' component={GetStart} options={{headerShown:false}}/>
      <WithoutLoggedinStack.Screen name='Register' component={Register} options={{headerTransparent:true,headerTintColor:'#00ffff'}}/>
      <WithoutLoggedinStack.Screen name='Login' component={Login} options={{headerTransparent:true,headerTintColor:'#00ffff'}}/>

      </HomeStack.Navigator>
  )


  
    render(){
        if(!this.state.is_loading){

        return (
        <NavigationContainer>
        {this.state.is_loggedin ?
        //If User Was Logged In Then Run This Thing
        <LoggedinStack.Navigator screenOptions={{gestureEnabled:true,gestureDirection:'horizontal', cardStyleInterpolator:CardStyleInterpolators.forHorizontalIOS,}}>
         <LoggedinStack.Screen name='Home' component={this.HomeStackScreen} options={{headerTransparent:true,headerTintColor:'#00ffff',headerShown:false,}}/>
         
         

        </LoggedinStack.Navigator>

        //Else Run This Thing
       :
       <WithoutLoggedinStack.Navigator screenOptions={{gestureEnabled:true,gestureDirection:'horizontal', cardStyleInterpolator:CardStyleInterpolators.forHorizontalIOS}}>
      <WithoutLoggedinStack.Screen name='GetStart' component={GetStart} options={{headerShown:false}}/>
      <WithoutLoggedinStack.Screen name='Register' component={Register} options={{headerTransparent:true,headerTintColor:'#00ffff'}}/>
      <WithoutLoggedinStack.Screen name='Login' component={Login} options={{headerTransparent:true,headerTintColor:'#00ffff'}}/>
     {/* After Login */}

     <LoggedinStack.Screen name='Home' component={this.HomeStackScreen} options={{headerTransparent:true,headerTintColor:'#00ffff',headerShown:false}}/>

       </WithoutLoggedinStack.Navigator>
        }
        </NavigationContainer>
        )
    }else{
        return <View style={main_styles.container}>
                
        <Image source={title} style={{width:70,height:70}}/>
        </View>
    }

    }
}

export default Routes