import { useState } from "react"
import parse from "html-react-parser"
import SubscribeBtnForm from "../../features/subscriptions/SubscribeBtnForm.jsx"
import { HiThumbUp, HiShare } from "react-icons/hi";
import { Link } from "react-router-dom";
import {ShareModal} from "../../components/index"

export default function VideoInfo({
    title,
    description = "",
    owner
}) {
    
    // TODO : Rectify Implementation of share button
    // TODO : Implement like button
    // TODO : Implement onclick on channel name, Link to `/users/:channelUsername`.

    const [shareOpen, setShareOpen] = useState(false);

    const currentUrl = typeof window !== "undefined" ? window.location.href : "";


    // const likeVideo = () => {
        
    // }
    
    return (
        <div className="max-w-2xl mx-auto">

            {/* 📝 Title */}
            <div className="mt-4 title-container">
                <h2 className="text-xl font-semibold leading-snug">
                    {title}
                </h2>
            </div>

            {/* 👤 Channel + Actions Row */}
            <div className="mt-4 buttons-container flex items-center justify-between">

 {/* Left: Channel Info with Link implementation */}
 <div className="flex items-center gap-3">
                    <Link to={`/users/${owner?.username}`}>
                        <img
                            src={owner?.avatar}
                            alt="channel"
                            className="w-10 h-10 rounded-full object-cover cursor-pointer"
                        />
                    </Link>

                    <Link to={`/users/${owner?.username}`} className="flex flex-col">
                        <span className="font-medium text-sm hover:underline">
                            {owner?.fullName}
                        </span>
                        <span className="text-xs text-gray-500">
                            @{owner?.username}
                        </span>
                    </Link>

                    <SubscribeBtnForm channel={owner} />
                </div>

                {/* Right: Like / Dislike / Share */}
                <div className="flex items-center gap-3">

                    <button className="cursor-pointer flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200" onClick={(e) => {
                        e.stopPropagation();

                    }}>
                        <HiThumbUp />
                        <span className="text-sm">Like</span>
                    </button>

                    <button className="cursor-pointer flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200"
                        onClick={() => setShareOpen(true)}
                    >
                        <HiShare />
                        <span className="text-sm">Share</span>
                    </button>

                </div>
            </div>

            {/* 📄 Description */}
            <div className="mt-4 description-container bg-gray-50 p-3 rounded-lg">
                <div className="text-gray-700 text-sm">
                    {parse(description)}
                </div>
            </div>

            <ShareModal 
                isOpen={shareOpen}
                onClose={() => setShareOpen(false)} 
                url={currentUrl}
                title={title}
            />
        </div>
    )
}


    // export default function VideoInfo({
    //     title,
    //     description="",
    //     owner
    // }) {
    
    
    //     return (
    //         <div className="max-w-2xl mx-auto">
    //             {/* 📝 Title & Description */}
    //             <div className="mt-4 title-container">
    //                 <h2 className="text-lg font-semibold">{title}</h2>
    //             </div>
    
    //             <div className="mt-4 buttons-container">
    //                 <SubscribeBtn channel={owner} />
    //             </div>
    //             <div className="mt-4 description-container">
    //                 <div className="text-gray-600 text-sm mt-1">{parse(description)}</div>
    //             </div>
    //         </div>
    //     )
    // }