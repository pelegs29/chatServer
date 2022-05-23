import React, {useContext, useState, useRef, useEffect} from 'react';
import SideFrame from "../SideFrame/SideFrame";
import ConversationPage from "../ConversationPage/ConversationPage";
import conversation from "../../database/conversation.json"
import {usersContext} from "../../App";
import {Navigate} from "react-router-dom";
import $ from 'jquery';

export const idContext = React.createContext()
export const Conversation = React.createContext()

function MainFrame({userId}) {

    let conversationMap = conversation.conversation
    const usersMaps = useContext(usersContext)

    //Holds the ID of the friend the user is currently talking to
    const [activeConv, setActiveConv] = useState(null);
    const [isSend, setIsSend] = useState(false);

    const [user, setUser] = useState([]);
    
    function fromApiToUser(apiUser) {
        const contacts = [];
        apiUser.contacts.forEach(contact => {
            const NewContact = {
                id: contact.id,
                lastMessage: contact.lastdate,
                last: contact.last
            }
            contacts.push(NewContact);
        });

        return {
            userId: apiUser.id,
            name: apiUser.name,
            email: apiUser.email,
            password: apiUser.password,
            pic: null,
            contacts: contacts,
        };
    }


    async function getUser() {
        if (userId == null)
            return;
        const output = await $.ajax({
            url: 'http://localhost:5125/api/Users/' + userId,
            type: 'GET',
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem('jwt'));
            },
            data: {},
            success: function (data) {
                return data;
            },
            error: function () {
            },
        }).then((data) => {
            return data;
        });
        var user = await output;
        setUser(fromApiToUser(user));
    }

    useEffect(() => {
        console.log(userId)
        getUser();
    }, [])


    return userId ? (
        <div className={"full-screen p-3 mb-2 text-dark m-0 d-flex justify-content-center"} style={{height: "100vh"}}>
            <Conversation.Provider value={conversationMap}>
                <idContext.Provider value={user}>
                    {console.log(user)}
                    {/*<SideFrame activeConv={activeConv} setActiveConv={setActiveConv}/>*/}
                    {/*<ConversationPage activeConv={activeConv} setActiveConv={setActiveConv} isSend={isSend}*/}
                    {/*                  setIsSend={setIsSend}/>*/}
                </idContext.Provider>
            </Conversation.Provider>
        </div>
    ) : <Navigate replace to="/"/>;
}

export default MainFrame;