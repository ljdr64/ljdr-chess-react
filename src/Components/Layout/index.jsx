function Layout({ children }) {
  return (
    <div className="flex flex-col items-center mt-[70px] min-w-[560px]">
      {children}
    </div>
  );
}

export default Layout;
