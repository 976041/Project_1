import { Appbar } from "../components/Appbar"
import { BlogCard } from "../components/BlogCard"
import { BlogSkeleton } from "../components/BlogSkeleton"
import { useBlogs } from "../hooks"


export const Blogs = () =>{
//    console.log("hi from blogs")
  const { loading, blogs} = useBlogs()
//   console.log("hi from blogs after useblogs")
//   console.log(loading);
//   console.log(blogs)
  
  if(loading){
    return <div>
            <Appbar /> 
            <div  className="flex justify-center">
                <div>
                    <BlogSkeleton />
                    <BlogSkeleton />
                    <BlogSkeleton />
                    <BlogSkeleton />
                    <BlogSkeleton />
                </div>
            </div>
        </div>
  }
//   console.log("hi after if")
  return <div>
     <Appbar />
     {/* console.log("hi after false") */}
        <div  className="flex justify-center">
            <div>
                {blogs.map(blog => <BlogCard
                    id={blog.id}
                    authorName={blog.author.name || "Anonymous"}
                    title={blog.title}
                    content={blog.content}
                    publishedDate={"2nd Feb 2024"}
                />)}
            </div>
        </div>
  </div>
}