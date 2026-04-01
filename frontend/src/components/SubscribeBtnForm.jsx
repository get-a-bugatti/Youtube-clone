import { useEffect, useState } from "react"
import {SubscribeBtn} from "./index.js"
import axios from "axios"

export default function SubscribeBtnForm({
    channel={}
}) {

    const [isSubscribed, setIsSubscribed] = useState(false);
    
    useEffect(() => {
        
        if (!channel.isSubscribed && channel.username) {
            axios.get(`/api/v1/users/c/${channel.username}/isSubscribed`)
            .then(response => {
                console.log("subscribed status :: SubscribeBtn :", response);
                setIsSubscribed(response.data.data);
            })
            .catch(error => {
                alert(error);
            });
            
        } else if (channel.isSubscribed && channel.username) {
            setIsSubscribed(channel.isSubscribed);
        }
        
    }, [])


    const handleSubmit = async (e) => {
        e.preventDefault();

        setIsSubscribed(prev => !prev);
        try {
            const response = await axios.post(`/api/v1/users/c/${channel.username}/subscription`);

        } catch (error) {
            setIsSubscribed(prev => !prev);
            alert(error);
        }
    };


    return (
        <form onSubmit={handleSubmit}>
            <SubscribeBtn isSubscribed={isSubscribed}/>
        </form>
    )

}