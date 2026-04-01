import {Logo} from "./index"

import {
    Link
} from "react-router-dom"

export default function VideoCard({
    _id,
    title,
    owner,
    views,
    duration,
    thumbnail="/missing-thumbnail.jpg",
    createdAt=Date.now(),
    className="",
    mode = "portrait", // ✅ NEW
    ...props
}) {

    const convertDuration = (duration) => {
        if (typeof duration !== "number") {
            duration = Number(duration);
        }

        let seconds = Math.floor(duration % 60);

        if (duration >= 3600) {
            let hours = Math.floor(duration / 3600);
            let minutes = Math.floor((duration % 3600) / 60);

            return `${hours}:${minutes === 0 ? "00" : minutes}:${seconds === 0 ? "00" : seconds}`
        } else if (duration >= 60) {
            let minutes = Math.floor((duration % 3600) / 60);

            return `${minutes}:${seconds === 0 ? "00" : seconds}`
        } else {
            return `00:${seconds === 0 ? "00" : seconds}`
        }
    }

    const convertUploadTime = (createdAt) => {
        const now = Date.now();
        const diff = now - new Date(createdAt).getTime();

        const minutes = Math.floor(diff / (1000 * 60));
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const weeks = Math.floor(diff / (1000 * 60 * 60 * 24 * 7));
        const months = Math.floor(diff / (1000 * 60 * 60 * 24 * 30));
        const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365));

        if (minutes < 1) return "just now";
        if (minutes < 60) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
        if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
        if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`;
        if (weeks < 4) return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
        if (months < 12) return `${months} month${months > 1 ? "s" : ""} ago`;

        return `${years} year${years > 1 ? "s" : ""} ago`;
    };

    const formatViews = (views) => {
        if (typeof views !== "number") {
            views = Number(views);
        }

        if (views < 1000) return `${views} view${views === 1 ? "" : "s"}`;

        if (views < 1_000_000) {
            const val = (views / 1000).toFixed(1).replace(/\.0$/, "");
            return `${val}K views`;
        }

        if (views < 1_000_000_000) {
            const val = (views / 1_000_000).toFixed(1).replace(/\.0$/, "");
            return `${val}M views`;
        }

        const val = (views / 1_000_000_000).toFixed(1).replace(/\.0$/, "");
        return `${val}B views`;
    };

    return (
        <Link to={`/watch?v=${_id}`}>
            <div
                className={`
                    border rounded-lg border-transparent bg-white
                    ${mode === "landscape" ? "flex gap-3 items-start" : "flex flex-col"}
                    ${className}
                `}
                {...props}
            >

                {/* 🎬 Thumbnail */}
                <div className={`
                    upper-section relative cursor-pointer
                    ${mode === "landscape" ? "w-48 shrink-0" : ""}
                `}>
                    <img
                        src={thumbnail}
                        alt="thumbnail"
                        className={`
                            object-cover mx-auto
                            ${mode === "landscape" ? "w-full h-28 rounded-md" : "w-50 h-50"}
                        `}
                    />
                    <span className="video-views py-1 px-2 bg-black opacity-80 text-white text-xs font-semibold rounded-sm absolute bottom-2 right-2">
                        {convertDuration(duration)}
                    </span>
                </div>

                {/* 📄 Info Section */}
                <div className={`
                    lower-section
                    ${mode === "landscape"
                        ? "flex flex-col justify-between flex-1"
                        : "grid grid-cols-[50px_1fr] mt-2"
                    }
                `}>

                    {/* 👤 Avatar (hide in landscape or make small) */}
                    {mode === "portrait" && (
                        <div className="image-container">
                            <Logo
                                src={owner.avatar}
                                alt="profile image"
                                className="rounded-full w-12 h-12 cursor-pointer"
                            />
                        </div>
                    )}

                    {/* 📄 Text */}
                    <div className={`${mode === "portrait" ? "ml-2" : ""}`}>
                        <p className={`font-semibold ${mode === "landscape" ? "text-base" : "text-xl"}`}>
                            {title}
                        </p>

                        <p className="text-sm text-gray-500">
                            {owner?.fullName || owner?.name}
                        </p>

                        <div className="text-sm text-gray-500">
                            {formatViews(views)} &#183; {convertUploadTime(createdAt)}
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    )
}