import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useGetVideoByIdQuery } from "../redux/api/videoApiSlice.js";
import { useGetUserChannelProfileQuery, useAddToWatchHistoryMutation } from "../redux/api/userApiSlice.js";
import VideoDescription from "../components/VideoDescription.jsx";
import CommentList from "../components/CommentList.jsx";
import AddComment from "../components/AddComments.jsx";
import Subscription from "../components/Subscription.jsx";

const WatchPage = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { videoId } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, error } = useGetVideoByIdQuery(videoId);
  const video = data?.data || data; // depends on backend response

  const { data: channelData } = useGetUserChannelProfileQuery(video?.owner?.username, {
    skip: !video?.owner?.username, // skip until username is available
  });

  const [addToWatchHistory] = useAddToWatchHistoryMutation();

  useEffect(() => {
    if (videoId) {
      addToWatchHistory(videoId);
    }
  }, [videoId, addToWatchHistory]);

  if (isLoading) return <p className="text-gray-400">Loading video...</p>;
  if (error) return <p className="text-red-500">Error loading video.</p>;
  if (!video) return <p className="text-gray-400">Video not found</p>;

  const handleClickChannel = () => {
    navigate(`/user-channel/${video.owner?.username}`);
  };

  return (
    <div className="min-h-[80vh] text-white p-6 ml-10 max-w-6xl mx-auto">
      {/* Video Player */}
      <div className="mt-10 relative aspect-video w-[800px] h-[450px] border border-gray-700 rounded-lg overflow-hidden shadow-lg">
        <video src={video.videoFile} controls className="w-full h-full" />
      </div>

      {/* Title + Info */}
      <h1 className="mt-4 text-2xl font-bold">{video.title}</h1>

      {/* Stats */}
      <div className="flex gap-6 mt-3 text-sm text-gray-500">
        <span>{video.views} views</span>
        <span>{new Date(video.createdAt).toLocaleDateString()}</span>
      </div>

      {/* Description */}
      <VideoDescription description={video.description} />

      {/* Channel Info */}
      <div className="flex items-center justify-between max-w-3xl mt-6">
        <div
          className="flex items-center gap-3 mt-4 p-2 rounded-md group cursor-pointer w-fit hover:bg-gray-900/20 transition-colors duration-300"
          onClick={handleClickChannel}
        >
          <img
            src={video.owner?.avatar}
            alt={video.owner?.username}
            className="w-10 h-10 rounded-full transition-transform duration-300 group-hover:scale-105"
          />
          <span className="text-sm font-medium text-white transition-colors duration-300 group-hover:text-red-500">
            {video.owner?.fullname}
          </span>
          <span className="text-sm text-gray-500">
            · {channelData?.data?.subscribersCount || 0} subscribers
          </span>
        </div>
        <Subscription
          channelId={video.owner?._id}
          isSubscribed={channelData?.data?.isSubscribed}
        />
      </div>

      {/* Comments */}
      <div>
        <h2 className="mt-6 text-xl font-semibold">Comments Section</h2>
        <AddComment videoId={videoId} />
        <CommentList videoId={videoId} currentUserId={userInfo?._id} />
      </div>
    </div>
  );
};

export default WatchPage;
