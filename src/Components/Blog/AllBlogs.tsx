import { useNavigate } from "react-router-dom";

export const AllBlogs = () => {
  const navigate = useNavigate();
  // Example blog data
  const blogs = [
    {
      id: 1,
      title: "Inside Summer Tides",
      subtitle: "A Weekend of Sun, Sand and Saba Saba",
      image:
        "https://assets.citizen.digital/155290/conversions/Summertides-og_image.webp",
      author: "Jane Doe",
      date: "July 20, 2025",
      excerpt:
        "Experience the magic of Summer Tides with our exclusive behind-the-scenes look at Kenya's hottest beach event. From sunrise yoga to sunset parties, discover what made this weekend unforgettable!",
      content: `This is the full content for Inside Summer Tides...`,
    },
    {
      id: 2,
      title: "Festival Fashion Trends 2025",
      subtitle: "What to Wear to Stand Out",
      image:
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
      author: "John Smith",
      date: "July 18, 2025",
      excerpt:
        "Get inspired by the latest festival fashion trends. From bold prints to eco-friendly accessories, see how attendees are making a statement this season.",
      content: `This is the full content for Festival Fashion Trends 2025...`,
    },
    {
      id: 3,
      title: "Top 5 Must-See Events in Nairobi",
      subtitle: "Don't Miss Out This Month!",
      image:
        "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=800&q=80",
      author: "Mary Wanjiku",
      date: "July 15, 2025",
      excerpt:
        "From music festivals to art exhibitions, here are the top 5 events you can't afford to miss in Nairobi this month. Plan your weekends now!",
      content: `This is the full content for Top 5 Must-See Events in Nairobi...`,
    },
  ];

  return (
    <div className="bg-[#FFFFFF] pb-10 px-2 sm:px-8">
      <div className="flex justify-center pt-5 pb-3">
        <h1 className="text-3xl font-bold text-primary">Blogs & Stories</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
        {blogs.map((blog) => (
          <div
            key={blog.id}
            className="card bg-base-100 rounded-2xl shadow-lg hover:shadow-2xl hover:scale-[1.03] transition duration-300 overflow-hidden flex flex-col cursor-pointer"
            onClick={() => navigate(`/blogs/${blog.id}`)}
          >
            <figure className="relative h-56 w-full overflow-hidden">
              <img
                src={blog.image}
                alt={blog.title}
                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-200"
              />
              <span className="absolute top-3 left-3 bg-[#ED3500] text-white text-xs px-3 py-1 rounded-full shadow font-semibold">
                {blog.date}
              </span>
            </figure>
            <div className="card-body flex flex-col flex-1">
              <h2 className="card-title text-xl font-bold text-blue-900 mb-1">
                {blog.title}
              </h2>
              <div className="text-sm text-gray-500 mb-2">{blog.subtitle}</div>
              <div className="text-gray-700 mb-3 flex-1">{blog.excerpt}</div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs text-gray-400">By {blog.author}</span>
              </div>
              <div className="card-actions justify-end mt-auto">
                <button
                  className="btn btn-primary bg-[#ED3500] rounded-xl text-white border-none hover:underline hover:bg-[#FF4F0F]"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/blogs/${blog.id}`);
                  }}
                >
                  Read More
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
