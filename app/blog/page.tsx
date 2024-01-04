interface Post {
    title: string;
    content: string;
    slug: string;
}

interface Props {
    params: { slug: string };
}

export default async function Blog() {
    const posts: Post[] = await fetch('http://localhost:3000/api/content')
        .then((response) => response.json())

    return (
        <div>
            <ul>
                {posts.map((post) => {
                    return <li><a href={`/blog/${post.slug}`}> {post.title}</a></li>;
                })}
            </ul>
        </div>
    );

}
