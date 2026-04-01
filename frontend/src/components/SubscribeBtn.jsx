import {Button} from "./index.js"

export default function SubscribeBtn({
    isSubscribed
}) {


    return (
        <Button 
        type="submit" 
        bgColor={`${isSubscribed ? "bg-white" : "bg-black"}`} 
        textColor={`${isSubscribed ? "text-black" : "text-white"}`}
        className={`rounded-3xl px-3 cursor-pointer transition duration-300 ease-in-out ${isSubscribed ? "" : "hover:bg-gray-800 active:bg-gray-400"} hover:font-bold active:border-2 border`}
        >
            {isSubscribed ? "Unsubscribe" : "Subscribe"}
        </Button>
    )
}