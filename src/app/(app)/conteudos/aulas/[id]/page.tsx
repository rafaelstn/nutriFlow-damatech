import { LessonDetailScreen } from "@/features/lessons/LessonDetailScreen";

export default async function LessonPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <LessonDetailScreen lessonId={id} />;
}
