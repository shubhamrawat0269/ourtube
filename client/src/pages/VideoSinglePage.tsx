import { useSearchParams } from "react-router-dom";

const VideoSinglePage = () => {
  const [searchParams] = useSearchParams();
  const videoId = searchParams.get("v");
  console.log(videoId);

  return <div>Video ID: {videoId}</div>;
};

export default VideoSinglePage;
