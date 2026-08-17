import AccountSidebar from "@/components/account/AccountSidebar";

export default function ContaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-[1440px] px-4 md:px-8 py-8 md:py-12">
      <h1 className="font-serif-editorial text-3xl md:text-4xl mb-8">Minha conta</h1>
      <div className="flex flex-col md:flex-row gap-8 md:gap-12">
        <div className="md:w-48 shrink-0">
          <AccountSidebar />
        </div>
        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </div>
  );
}
