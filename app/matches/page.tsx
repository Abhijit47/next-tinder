type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default function MatchesPage({ params, searchParams }: PageProps) {
  return <div>MatchesPage</div>;
}
