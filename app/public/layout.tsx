// app/(public)/layout.tsx
export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>

      <main>{children}</main>
      {/* optional shared footer here */}
    </>
  );
}
