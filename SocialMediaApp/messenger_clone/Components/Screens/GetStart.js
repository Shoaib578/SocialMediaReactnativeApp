import React from 'react'
import {View,Text, Button,Dimensions, TouchableWithoutFeedback,Image} from 'react-native'
import main_styles from '../Style/main'
import AwesomeButton from "react-native-really-awesome-button";
import title from '../Images/title.png'
class GetStart extends React.Component {
    render() {
        return(
            <View style={main_styles.container}>
                
                        <Image source={title} style={{width:70,height:70,bottom:90}}/>
                        <AwesomeButton
                        style={{left:18,}}
                        
                        width={'90%'}
                        backgroundShadow={null}
                        onPress={()=>this.props.navigation.navigate('Register')}
                        backgroundColor='#00ffff'
                        backgroundDarker='#00ffff'
                        >
                        <Text style={{fontSize:20,color:'white',fontWeight:'bold'}}>Get Start</Text>
                        </AwesomeButton>


                        <TouchableWithoutFeedback onPress={()=>this.props.navigation.navigate('Login')} >
                            <Text style={{color:'#00ffff',fontSize:21,top:40,fontFamily:'Roboto'}}>Already Have An Account</Text>
                        </TouchableWithoutFeedback>
                
            </View>
        )
    
    }
}

export default GetStart