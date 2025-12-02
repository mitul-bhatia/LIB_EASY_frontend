import { Card, CardContent } from "@/components/ui/card";

// Shows when there's no data
export default function EmptyState({ title, description }) {
  return (
    <Card className="bg-gray-50">
      <CardContent className="text-center py-12">
        <p className="text-gray-500 text-lg">{title}</p>
        {description && (
          <p className="text-sm text-gray-400 mt-2">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}
