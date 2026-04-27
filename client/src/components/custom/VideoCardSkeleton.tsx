const VideoCardSkeleton = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {[...Array(15)].map((_, i) => (
        <div key={i} className="bg-gray-200 rounded-xl h-45" />
      ))}
    </div>
  );
};

export default VideoCardSkeleton;
