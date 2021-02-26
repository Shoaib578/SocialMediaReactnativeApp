import React from 'react'
import {View,Text, TextInput, Image,Dimensions,Keyboard,TouchableWithoutFeedback, FlatList,ScrollView} from 'react-native'
import Axios from 'axios'
import main_styles from '../Style/main'
import Icon from 'react-native-vector-icons/FontAwesome';
import Textarea from 'react-native-textarea';
import { TouchableOpacity } from 'react-native-gesture-handler';

const DismissKeyboard = ({ children }) => (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      {children}
    </TouchableWithoutFeedback>
  );
  



  


class Message extends React.Component {

    state = {
        msg:'',
        messages:[],
        msg_page_userinfo:[]
    }

  

    insert_notification = ()=>{
      let formData = new FormData()
      formData.append('actioned_by',this.props.route.params.my_id)
      formData.append('notification_for',this.props.route.params.user_id)
      formData.append('notification_msg',this.state.msg)
      Axios.post('http://192.168.10.2:5000/insert_notification',formData)
      .then(res=>{
          console.log(res.data)
      })
      .catch(err=>console.log(err))
    }

    remove_notifications = ()=>{
    Axios.get('http://192.168.10.2:5000/remove_notifications?my_id='+this.props.route.params.my_id+'&&user_id='+this.props.route.params.user_id)
    .then(res=>console.log(res.data))
    .catch(err=>console.log(err))
    }

    insert_msg = ()=>{
        let formData = new FormData()
        formData.append('wrote_by',this.props.route.params.my_id)
        formData.append('msg_for',this.props.route.params.user_id)
        formData.append('text_msg',this.state.msg)
        Axios.post('http://192.168.10.2:5000/insert_msg',formData)
        .then(res=>{
            console.log(res.data)
            this.get_msgs()
            this.insert_notification()
            this.setState({msg:''})
            
        })
        .catch(err=>console.log(err))
        }

     
    get_msgs = ()=>{
        Axios.get('http://192.168.10.2:5000/get_msg?my_id='+this.props.route.params.my_id+'&&user_id='+this.props.route.params.user_id)
        .then(res=>{
            this.setState({messages:res.data.msgs})
           
        })
        .catch(err=>console.log(err))


        Axios.get('http://192.168.10.2:5000/get_msg?my_id='+this.props.route.params.my_id+'&&user_id='+this.props.route.params.user_id)
        .then(res=>{
            this.setState({msg_page_userinfo:res.data.user_info})
          
        })
        .catch(err=>console.log(err))
    }

    componentDidMount(){
        this.get_msgs()
         this.remove_notifications()
       
         setInterval(()=>{
             this.get_msgs()

         },3000)
    }


    render(){

        

        return (
            <DismissKeyboard>
            <View style={{flex:1,backgroundColor:'#101010',
            }}>

           

    <ScrollView style={{width:'100%'}}>
    {this.state.msg_page_userinfo.map(data=>{
         return(
             <View style={{marginTop:20,alignSelf:'center'}}>
            <Image source={{uri:'http://192.168.10.2:5000/static/profile_pic/'+data.profile_pic}} style={{width:100,height:100,borderRadius:100,}} />
            <Text style={{color:'#00ffff',fontSize:25,marginTop:10,alignSelf:'center',right:10}}>{data.user_name}</Text>

           
            </View>
         )
     })}  
            <Text style={{height:0,width:'80%',borderColor:'#00ffff',borderWidth:.5,marginTop:20,alignSelf:'center'}}> </Text>

           <FlatList 
           data={this.state.messages}
           keyExtractor={(item)=>item.message_id}
           scrollEnabled={true}
           style={{width:'100%',height:'100%'}}
           renderItem={({item})=>(
          
            
     <View>
     
     
     {item.wrote_by != this.props.route.params.my_id?<Image source={{uri:'http://192.168.10.2s:5000/static/profile_pic/'+item.profile_pic}} style={{width:30,height:30,borderRadius:100,left:'4%',top:'50%'}} />:null}

            <View style={{left:item.wrote_by == this.props.route.params.my_id?Dimensions.get('window').width*2/6:Dimensions.get('window').width*2/15, borderWidth:.5,borderColor:item.wrote_by == this.props.route.params.my_id?'#0DAAAA':'#2E2E2D',backgroundColor:item.wrote_by == this.props.route.params.my_id?'#0DAAAA':'#2E2E2D',width:'60%',marginTop:30,borderRadius:4,padding:5,borderTopLeftRadius:10,}}>
                  <Text style={{color:'white',fontSize:18}}>{item.msg_text}</Text>
                 
            </View>
      <Text style={{textAlign:item.wrote_by == this.props.route.params.my_id?'right':'left',color:'white',fontSize:12,paddingRight:item.wrote_by == this.props.route.params.my_id?25:0,left:item.wrote_by != this.props.route.params.my_id?60:0,top:2,opacity:.5}}>{item.posted_date}</Text>
            
     </View>
           
   
             
           ) 
           
           }
           
           
           />
</ScrollView>


          

            
                <View style={{flexDirection:'row'}}>

                <Textarea
                containerStyle={{width:Dimensions.get('window').width*2/2.5,height:50,borderWidth:.5,borderColor:'#00ffff',borderRadius:4,alignSelf:'center',left:20,backgroundColor:'#0DAAAA'}}
                style={{color:'white',fontSize:18}}
                onChangeText={(val)=>this.setState({msg:val})}
                maxLength={300}
                defaultValue={this.state.msg}
                placeholder={'Message'}
                placeholderTextColor={'white'}
                underlineColorAndroid={'transparent'}
            />
               <TouchableOpacity style={{left:20,padding:15}} onPress={this.insert_msg}>
               <Icon name='paper-plane' color='#00ffff' size={30} />
               </TouchableOpacity>

                </View>

            </View>
           
            </DismissKeyboard>
        )
    }
}

export default Message