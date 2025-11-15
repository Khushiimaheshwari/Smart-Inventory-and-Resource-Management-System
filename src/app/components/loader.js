export default function Loader() {
  return (
    <div className="w-full h-[60vh] flex justify-center items-center">
      <div className="h-12 w-12 rounded-full border-4 border-t-transparent border-r-transparent animate-spin"
        style={{
          borderLeftColor: "#00C3A1",
          borderBottomColor: "#00C3A1",
          boxShadow: "0 0 15px rgba(0,195,161,0.4)"
        }}
      ></div>
    </div>
  );
}
