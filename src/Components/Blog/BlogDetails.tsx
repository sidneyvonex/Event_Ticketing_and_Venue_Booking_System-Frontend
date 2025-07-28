import { useParams, useNavigate } from "react-router-dom";

const blogs = [
  {
    id: 1,
    title: "Inside Summer Tides",
    subtitle: "A Weekend of Sun, Sand and Saba Saba",
    image:
      "https://assets.citizen.digital/155290/conversions/Summertides-og_image.webp",
    author: "Jane Doe",
    date: "July 20, 2025",
    content:
      "Experience the magic of Summer Tides with our exclusive behind-the-scenes look at Kenya's hottest beach event. From sunrise yoga to sunset parties, discover what made this weekend unforgettable! This is the full content for Inside Summer Tides...",
  },
  {
    id: 2,
    title: "Festival Fashion Trends 2025",
    subtitle: "What to Wear to Stand Out",
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    author: "John Smith",
    date: "July 18, 2025",
    content:
      "Get inspired by the latest festival fashion trends. From bold prints to eco-friendly accessories, see how attendees are making a statement this season. This is the full content for Festival Fashion Trends 2025...",
  },
  {
    id: 3,
    title: "Top 5 Must-See Events in Nairobi",
    subtitle: "Don't Miss Out This Month!",
    image:
      "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=800&q=80",
    author: "Mary Wanjiku",
    date: "July 15, 2025",
    content:
      "From music festivals to art exhibitions, here are the top 5 events you can't afford to miss in Nairobi this month. Plan your weekends now! This is the full content for Top 5 Must-See Events in Nairobi...",
  },
];

export const BlogDetails = () => {
  const { blogId } = useParams();
  const navigate = useNavigate();
  const blog = blogs.find((b) => b.id === Number(blogId));

  if (!blog) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-2xl font-bold text-red-500 mb-4">Blog Not Found</h2>
        <button className="btn btn-primary" onClick={() => navigate(-1)}>
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-2xl p-0 mt-8 mb-12 overflow-hidden">
      <div className="relative w-full h-64 md:h-80">
        <img
          src={blog.image}
          alt={blog.title}
          className="w-full h-full object-cover object-center"
        />
        <span className="absolute top-4 left-4 bg-[#ED3500] text-white text-xs px-4 py-2 rounded-full shadow font-semibold">
          {blog.date}
        </span>
      </div>
      <div className="p-6 md:p-10">
        <button
          className="mb-4 text-blue-600 hover:underline text-sm"
          onClick={() => navigate(-1)}
        >
          &larr; Back to Blogs
        </button>
        <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-2">
          {blog.title}
        </h1>
        <div className="text-lg text-gray-500 mb-2 font-medium">
          {blog.subtitle}
        </div>
        <div className="flex items-center gap-4 mb-6">
          <span className="text-xs text-gray-400 font-semibold">
            By {blog.author}
          </span>
          <span className="text-xs text-gray-400">{blog.date}</span>
        </div>
        <div className="text-base text-gray-800 leading-relaxed mb-6 whitespace-pre-line">
          {blog.content}
        </div>
        {/* Extra blog info section */}
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-xl mb-6">
          <h3 className="font-semibold text-blue-800 mb-2">Key Takeaways</h3>
          <ul className="list-disc list-inside text-blue-900 text-sm space-y-1">
            <li>
              Event Location:{" "}
              <span className="font-medium text-gray-700">
                Diani Beach, Kenya
              </span>
            </li>
            <li>
              Attendance:{" "}
              <span className="font-medium text-gray-700">
                Over 2,000 people
              </span>
            </li>
            <li>
              Featured Artists:{" "}
              <span className="font-medium text-gray-700">
                Sauti Sol, DJ Joe Mfalme
              </span>
            </li>
            <li>
              Weather:{" "}
              <span className="font-medium text-gray-700">Sunny, 28°C</span>
            </li>
          </ul>
        </div>
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span>Share:</span>
            <a href="#" className="hover:text-blue-600">
              Facebook
            </a>
            <a href="#" className="hover:text-blue-600">
              Twitter
            </a>
            <a href="#" className="hover:text-blue-600">
              Instagram
            </a>
          </div>
          <div className="text-xs text-gray-400 mt-2 md:mt-0">
            Last updated: {blog.date}
          </div>
        </div>
      </div>
    </div>
  );
};
