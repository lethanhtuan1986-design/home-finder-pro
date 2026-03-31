import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

// Redirect legacy /search/map to /search?view=map
const MapSearchPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    params.set("view", "map");
    navigate(`/search?${params.toString()}`, { replace: true });
  }, [navigate, searchParams]);

  return null;
};

export default MapSearchPage;
