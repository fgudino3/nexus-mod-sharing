export default function CenteredContent({ children }: React.PropsWithChildren) {
  return (
    <div
      style={{ height: `calc(100vh - 100px)` }}
      className="flex flex-col justify-center items-center"
    >
      {children}
    </div>
  );
}
