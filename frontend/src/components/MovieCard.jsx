import { Link } from 'react-router-dom';

function MovieCard({ movie }) {
  
  const createdAt = movie.createAt;
  // Extract only the date part
  const datePart = createdAt.split("T")[0]; // "2025-02-27"
  // Convert to dd/mm/yyyy format
  const [year, month, day] = datePart.split("-");
  const formattedDate = `${day}-${month}-${year}`;

  return (
    <Link to={`/player/${movie.id}`} className="card group">
      <div className="relative aspect-video overflow-hidden">
        <img 
          src={movie.thumbnailUrl} 
          alt={movie.title} 
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
          <div className="p-4 w-full">
            <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-primary rounded">
              {movie.duration}
            </span>
          </div>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-medium text-gray-900 dark:text-white truncate">{movie.title}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Added {formattedDate}
        </p>
      </div>
    </Link>
  );
}

export default MovieCard;