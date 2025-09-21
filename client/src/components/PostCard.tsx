import { Badge } from "@/components/ui/badge";
import { Clock, User, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import LazyImage from "@/components/LazyImage";

interface Post {
  id: number;
  title: string;
  excerpt: string;
  author: string;
  publishedAt: string;
  readTime: string;
  category: string;
  imageUrl: string;
  slug: string;
  isPopular?: boolean;
}

interface PostCardProps {
  post: Post;
  variant?: "default" | "horizontal" | "minimal";
}

const PostCard = ({ post, variant = "default" }: PostCardProps) => {
  if (variant === "horizontal") {
    return (
      <Link to={`/post/${post.slug}`}>
        <article className="group cursor-pointer">
          <div className="flex space-x-4">
          <div className="flex-shrink-0">
            <div className="w-24 h-24 rounded-lg overflow-hidden">
              <LazyImage
                src={post.imageUrl}
                alt={post.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                aspectRatio="square"
              />
            </div>
          </div>
          
          <div className="flex-1 space-y-2">
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="text-xs">
                {post.category}
              </Badge>
              {post.isPopular && (
                <TrendingUp className="h-3 w-3 text-primary" />
              )}
            </div>
            
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
              {post.title}
            </h3>
            
            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
              <span>{post.readTime}</span>
              <span>{new Date(post.publishedAt).toLocaleDateString('pt-BR')}</span>
            </div>
          </div>
        </div>
      </article>
      </Link>
    );
  }

  if (variant === "minimal") {
    return (
      <Link to={`/post/${post.slug}`}>
        <article className="group cursor-pointer space-y-2">
        <h3 className="font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2">
          {post.title}
        </h3>
        <div className="flex items-center space-x-3 text-xs text-muted-foreground">
          <span>{post.readTime}</span>
          <span>{new Date(post.publishedAt).toLocaleDateString('pt-BR')}</span>
        </div>
      </article>
      </Link>
    );
  }

  return (
    <Link to={`/post/${post.slug}`}>
      <article className="group cursor-pointer bg-card rounded-xl overflow-hidden shadow-card hover:shadow-hover transition-all duration-300 border border-border">
      {/* Image */}
      <div className="aspect-[16/10] overflow-hidden">
        <LazyImage
          src={post.imageUrl}
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          aspectRatio="auto"
        />
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <Badge variant="secondary">
            {post.category}
          </Badge>
          {post.isPopular && (
            <div className="flex items-center space-x-1 text-primary">
              <TrendingUp className="h-4 w-4" />
              <span className="text-xs font-medium">Popular</span>
            </div>
          )}
        </div>

        <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
          {post.title}
        </h3>

        <p className="text-muted-foreground line-clamp-3">
          {post.excerpt}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <User className="h-4 w-4" />
            <span>{post.author}</span>
          </div>
          
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{post.readTime}</span>
            </div>
            <span>{new Date(post.publishedAt).toLocaleDateString('pt-BR')}</span>
          </div>
        </div>
      </div>
    </article>
    </Link>
  );
};

export default PostCard;