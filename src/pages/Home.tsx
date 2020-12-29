
import React, {useState} from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  TextInput,
  Modal,
  StyleProp,
} from 'react-native';

import ApiMailService from '../services/apiMailService/ApiMailService';



export default function Home() {


  interface UserInterface{
    id: string;
    name: string;
    email: string;
  }
  const [participants, ParticipantHandle] = useState<UserInterface[]>([])
  const [trakedParticipant, setTrakedParticipant] = useState<UserInterface>({id:"", name:"", email:""})
  const [newParticipantName, setNewParticipantName] = useState<string>('')
  const [newParticipantEmail, setNewParticipantEmail] = useState<string>('')

  const [alert, setalert] = useState<string>("")
  const [errors, seterrors] = useState<{inputname: string, email: string}>({inputname: "", email: ""})

  const [newParticipantModalVisible, setnewParticipantModalVisible] = useState(false);
  const [alertModalVisible, setalertModalVisible] = useState(false);
  const [loadingModalVisible, setloadingModalVisible] = useState(false);
  const [deleteModalVisible, setdeleteModalVisible] = useState(false);
  const [questionModalVisible, setquestionModalVisible] = useState(false);

  const [errorStyle, setErrorStyle] = useState<any>(StyleSheet.create({errorStyleS:{display: 'none', color: 'red', fontSize: 8}}));

  const checkNewUser = () => {
    
    let ret = true;
    if(participants.map(participant => participant.email).indexOf(newParticipantEmail) != -1){
      seterrors({inputname: errors.inputname, email: 'Email already in participants'})
      ret = false
    }else if(!newParticipantEmail.includes('@')){
      seterrors({inputname: errors.inputname, email:'Not a valid Email'})
      ret = false;
    }
    if(newParticipantName == ""){
      ret = false;
      seterrors({email: errors.email, inputname:'Name cannot be empty'})
    }
    return ret;
  }
  
  const addNewParticipant = () => {
    if(!checkNewUser()){
      setErrorStyle(StyleSheet.create({errorStyleS:{display: 'flex', color: 'red', fontSize: 8}}))
    }else{
      seterrors({inputname: "", email: ""})
      setErrorStyle(StyleSheet.create({errorStyleS:{display: 'none', color: 'red', fontSize: 8}}))
      ParticipantHandle([...participants, {
        id: `${participants.length > 0 ? parseInt(participants.slice(-1)[0].id) + 1 : 1}`,
        name: newParticipantName,
        email: newParticipantEmail
      }]);
      setNewParticipantName('');
      setNewParticipantEmail("");
      setnewParticipantModalVisible(false);
    }
  }

  const deleteParticipant = (id:string) => {
    setdeleteModalVisible(false)
    let deletedParticipant = participants[participants.map(el => el.id).indexOf(id)]
    ParticipantHandle([...participants.filter(participant => participant.id != id)]);
    setalert(`Participant ${deletedParticipant.name} Deleted`);
    setalertModalVisible(true);
    setTimeout(() => setalertModalVisible(false), 1000)
  }

  const deleteParticipantHandler = (id: string) => {
    setTrakedParticipant(participants[participants.map(el => el.id).indexOf(id)]);
    setdeleteModalVisible(true)
  }

  const sortAndSend = async () => {//check internet connection
    setalert('Sorting and Sending');
    setloadingModalVisible(true);
    ApiMailService.sortAndSend(participants).then(
      (success : any) => setloadingModalVisible(false)
    ).catch(
      err => {
        setloadingModalVisible(false)
        setalert(err.data as string)
        setalertModalVisible(true)
      }
    )
  }

  return (
    <>
      <StatusBar hidden={true} />
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          contentContainerStyle={{backgroundColor:'rgba(186, 232, 247, 0.68)', flex: 1}}>
            <View style={styles.header}>
              <Text style={styles.headerText}>Secret Friend Project</Text>
            </View>
            <View style={{padding: 24}}>
              <Modal
                animationType="fade"
                transparent={true}
                visible={newParticipantModalVisible}
              >
                <View style={styles.centeredView}>
                  <View style={styles.modalView}>
                    <TouchableOpacity style={styles.close} onPress={() => setnewParticipantModalVisible(false)}>
                      <Text style={{color: 'rgb(217, 38, 38)'}}>X</Text>
                    </TouchableOpacity>
                    <TextInput
                      style={styles.input}
                      value={newParticipantName}
                      onChangeText={setNewParticipantName}
                      placeholder={"Participant Name"}
                    /> 
                    {
                      errors.inputname != ""?
                      (<Text style={errorStyle.errorStyleS}>{errors.inputname}</Text>) : (<></>)
                    }
                    <TextInput
                      style={styles.input}
                      value={newParticipantEmail}
                      onChangeText={setNewParticipantEmail}
                      placeholder={"Participant Email"}
                    />
                    {
                      errors.email != ""?
                      (<Text style={errorStyle.errorStyleS}>{errors.email}</Text>):(<></>)
                    }
                    <TouchableOpacity style={styles.Modalbutton} onPress={addNewParticipant}>
                      <Text style={styles.ModalButtonText}>Add Participant</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>
              <TouchableOpacity style={styles.button} onPress={() => setnewParticipantModalVisible(true)}>
                <Text>Add Participant</Text>
              </TouchableOpacity>
              {
                participants.length > 3 ?
                  (<>
                    <TouchableOpacity style={styles.button} onPress={sortAndSend}>
                      <Text style={{color: 'black'}}>Sort and Send</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.warningButton} onPress={() => setquestionModalVisible(true)}>
                      <Text style={styles.delButtonText}>Clear Participants</Text>
                    </TouchableOpacity>
                  </>
                  ) : ( 
                    <TouchableOpacity style={styles.disalbedButton}>
                      <Text style={styles.delButtonText}>Not Enough Participants</Text> 
                    </TouchableOpacity>)
                
              }
            </View>
            <View style={styles.header}>
              <Text style={styles.headerText}>Participants:</Text>
            </View>
            <View style={styles.userContainer} >
              <ScrollView style={styles.userList}>
              <View style={{padding: 10}} >
              {
                participants.map(
                  participant => {
                    return (
                        <View style={styles.userComponent} key={participant.id}>
                          <Text style={styles.userComponentTextName}>{participant.name}</Text>
                          <Text style={styles.userComponentTextEmail}>{participant.email}</Text>
                          <TouchableOpacity style={styles.delButton} onPress={() => deleteParticipantHandler(participant.id)}>
                            <Text style={styles.delButtonText}>Delete</Text>
                          </TouchableOpacity>
                        </View>
                    )
                  }
                )
              }
              </View>
              </ScrollView>
            </View>
              <Modal animationType="slide" visible={alertModalVisible} transparent={true}>
                <View style={styles.alertCenteredView}>
                  <View style={styles.modalView}>
                    <Text> {alert} </Text>
                    <TouchableOpacity style={styles.alertModalbutton} onPress={() => setalertModalVisible(false)}>
                            <Text>Ok</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>
              <Modal animationType="fade" visible={loadingModalVisible} transparent={true}>
                <View style={styles.centeredView}>
                  <View style={styles.loadingModalView}>
                    <Text> {alert} </Text>
                  </View>
                </View>
              </Modal>
              <Modal
                animationType="fade"
                transparent={true}
                visible={deleteModalVisible}
              >
                <View style={styles.centeredView}>
                  <View style={styles.modalView}>
                    <Text>Do you really wanna delete {trakedParticipant.name}?</Text>
                    <View style={{flexDirection: 'row'}}>
                      <View style={{width: '50%'}}>
                        <TouchableOpacity style={styles.Modalbutton} onPress={() =>{ deleteParticipant(trakedParticipant.id)}}>
                          <Text style={styles.ModalButtonText}>Accept</Text>
                        </TouchableOpacity>
                      </View>
                      <View style={{width: '50%'}}>
                        <TouchableOpacity style={styles.dangerButton} onPress={()=>setdeleteModalVisible(false)}>
                          <Text style={styles.ModalButtonText}>Decline</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
              </Modal>
              <Modal
                animationType="fade"
                transparent={true}
                visible={questionModalVisible}
              >
                <View style={styles.centeredView}>
                  <View style={styles.modalView}>
                    <Text>Do you really wanna clear Participants?</Text>
                    <View style={{flexDirection: 'row'}}>
                      <View style={{width: '50%'}}>
                        <TouchableOpacity style={styles.Modalbutton} onPress={() =>{ ParticipantHandle([]);setquestionModalVisible(false)}}>
                          <Text style={styles.ModalButtonText}>Accept</Text>
                        </TouchableOpacity>
                      </View>
                      <View style={{width: '50%'}}>
                        <TouchableOpacity style={styles.dangerButton} onPress={()=>setquestionModalVisible(false)}>
                          <Text style={styles.ModalButtonText}>Decline</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
              </Modal>
        </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  input: {
    backgroundColor: '#fff',
    borderWidth: 1.4,
    borderColor: '#d3e2e6',
    borderRadius: 20,
    height: 56,
    paddingVertical: 18,
    paddingHorizontal: 24,
    marginBottom: 16,
    width: '100%',
    textAlignVertical: 'top',
  },
  userContainer:{
    flex: 1,
    padding: 20
  },
  userList: {
    borderRadius: 20,
    borderColor: '#eee',
    borderWidth: 3,
    padding: 10,
    backgroundColor: 'white'
  },
  userComponent:{
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#eee',
    paddingTop: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  userComponentTextName:{
    flex: 1,
    textAlign: 'center',
  },
  userComponentTextEmail:{
    flex: 2,
    textAlign: 'center',
  },
  header: {
    paddingVertical: 15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgb(163, 224, 245)',
  },
  headerText:{
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 20,
    letterSpacing: 1,
    textShadowColor: 'rgb(0, 0, 0)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10,
    color: 'white'
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    width: '90%',
    paddingHorizontal: 15,
    paddingVertical: 5,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  loadingModalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    width: '90%',
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: 'rgba(0,0,0,0.2)'
  },
  alertCenteredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button : {
    height: 56,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    borderColor: '#eeeeee',
    borderStyle: 'solid',
    borderWidth: 2,
    marginBottom: 10,
    backgroundColor: '#ffffff',
  },
  close : {
    height: 40,
    width: 40,
    borderRadius: 20,
    borderStyle: 'solid',
    borderColor: 'rgb(217, 38, 38)',
    borderWidth: 1,
    marginVertical: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 'auto'
  },
  Modalbutton : {
    height: 56,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    borderColor: 'rgb(125, 232, 152)',
    borderStyle: 'solid',
    borderWidth: 2,
    marginBottom: 10,
    backgroundColor: 'rgba(26, 255, 83, 0.6)',
    width: '90%',
  },
  ModalButtonText:{
    color: 'white',
    fontWeight: '900',
    fontSize: 18
  },
  alertModalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    width: '90%',
    paddingHorizontal: 15,
    paddingVertical: 5,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  alertModalButtonText:{
    color: 'white',
    fontWeight: '900',
    fontSize: 18
  },
  alertModalbutton : {
    height: 56,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    borderColor: 'rgb(221, 221, 60)',
    borderStyle: 'solid',
    borderWidth: 2,
    marginBottom: 10,
    backgroundColor: 'rgba(255, 255, 51, 0.6)',
    width: '90%',
  },
  delButton : {
    height: 30,
    padding: 5,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    borderColor: 'rgb(255, 51, 51)',
    borderStyle: 'solid',
    borderWidth: 2,
    marginBottom: 10,
    marginLeft: 5,
    backgroundColor: 'rgba(255, 51, 51, 0.7)',
  },
  delButtonText: {
    color: 'white',
    fontWeight: '600'
  },
  disalbedButton:{
    height: 56,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    borderColor: '#555',
    borderStyle: 'solid',
    borderWidth: 2,
    marginBottom: 10,
    backgroundColor: '#aaa',
  },
  warningButton : {
    height: 56,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    borderColor: 'rgb(255, 153, 51)',
    borderStyle: 'solid',
    borderWidth: 2,
    marginBottom: 10,
    backgroundColor: 'rgba(255, 128, 0, 0.7)',
  },
  dangerButton : {
    height: 56,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    borderColor: 'rgb(255, 51, 51)',
    borderStyle: 'solid',
    borderWidth: 2,
    marginBottom: 10,
    backgroundColor: 'rgba(255, 51, 51, 0.7)',
  },
});

