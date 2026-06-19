import { ClipLoader } from "react-spinners";

interface LoaderProps {
  loading?: boolean;
  color?: string;
  size?: number;
}

const Loader = ({
  loading = true,
  color = "#2563eb",
  size = 50,
}: LoaderProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <ClipLoader loading={loading} color={color} size={size} data-testid="loading-spinner" />
    </div>
  );
};

export default Loader;
