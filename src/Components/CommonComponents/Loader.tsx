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
    <div className="flex justify-center items-center min-h-screen">
      <ClipLoader
        loading={loading}
        color={color}
        size={size}
      />
    </div>
  );
};

export default Loader;