import { useEffect, useState } from "react"
import parse from "html-react-parser"
import { SubscribeBtnForm} from "./index"
import { HiThumbUp, HiShare } from "react-icons/hi";

export default function VideoInfo({
    title,
    description = "",
    owner
}) {
    
    // TODO : Implement share button
    // TODO : Implement like button
    // TODO : Implement onclick on channel name, Link to `/users/:channelUsername`.
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

                {/* Left: Channel + Subscribe */}
                <div className="flex items-center gap-3">
                    <img
                        src={owner?.avatar}
                        alt="channel"
                        className="w-10 h-10 rounded-full object-cover cursor-pointer"
                    />

                    <div className="flex flex-col cursor-pointer">
                        <span className="font-medium text-sm">
                            {owner?.fullName}
                        </span>
                        <span className="text-xs text-gray-500">
                            @{owner?.username}
                        </span>
                    </div>

                    {/* Subscribe Button */}
                    <SubscribeBtnForm channel={owner} />
                </div>

                {/* Right: Like / Dislike / Share */}
                <div className="flex items-center gap-3">

                    <button className="cursor-pointer flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200">
                        <HiThumbUp />
                        <span className="text-sm">Like</span>
                    </button>

                    <button className="cursor-pointer flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200">
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