import {Channel as ChannelComponent} from "../components/index";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function Channel() {

    const {username} = useParams();
    const [channel, setChannel] = useState({});
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
     
    useEffect(() => {
        setLoading(true);
        setError(null);
        
        axios.get(`/api/v1/users/c/${encodeURIComponent(username)}/page`)
        .then(res => {
            console.log("response from channel :", res);
            setChannel(res.data?.data?.[0]);
        })
        .catch(error => {
            if (error.response) {
                setError(error.response.data.message);
            } else {
                setError(error.message);
            }
        })
        .finally(() => setLoading(false));
        
    }, [username]);
        

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

        return (
            <div className="w-full">
                <ChannelComponent channel={channel}></ChannelComponent>
            </div>

        )
}