export const dynamic = 'force-dynamic'

interface Post {
    title: string;
    content: string;
    slug: string;
}

interface Props {
    params: { slug: string };
}

async function getPosts() {
    const res = await fetch('http://localhost:3000/api/content');
    const posts: Post[] = await res.json();

    return posts;
}
export default async function Blog() {
    const posts = await getPosts();

    return (
        <div>
            <ul>
                {posts.map((post: Post) => {
                    return <li key={post.slug}><a href={`/blog/${post.slug}`}> {post.title}</a></li>;
                })}
            </ul>
        </div>
    );

}
