type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};
export default function DiscoverPage({ params, searchParams }: PageProps) {
  return <div>DiscoverPage</div>;
}
