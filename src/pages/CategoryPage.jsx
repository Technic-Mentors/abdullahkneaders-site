import { Navigate, useParams } from 'react-router-dom';

export default function CategoryPage() {
  const { slug } = useParams();
  return <Navigate to={`/onlineshop?category=${slug}`} replace />;
}
