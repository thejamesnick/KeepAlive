import { Card } from "@/components/Card";

export function ProjectSkeleton() {
    return (
        <Card className="p-5 h-[166px] flex flex-col justify-between animate-pulse">
            <div className="flex justify-between items-start mb-4">
                <div className="flex flex-col gap-2 w-full">
                    <div className="h-4 w-1/2 bg-neutral-200 dark:bg-neutral-800 rounded-md" />
                    <div className="h-3 w-1/3 bg-neutral-100 dark:bg-neutral-900 rounded-md" />
                </div>
                <div className="h-5 w-16 bg-neutral-200 dark:bg-neutral-800 rounded-full" />
            </div>

            <div className="space-y-3 mt-6">
                <div className="flex justify-between items-center">
                    <div className="h-3 w-20 bg-neutral-100 dark:bg-neutral-900 rounded-md" />
                    <div className="h-3 w-16 bg-neutral-200 dark:bg-neutral-800 rounded-md" />
                </div>
                <div className="flex justify-between items-center">
                    <div className="h-3 w-24 bg-neutral-100 dark:bg-neutral-900 rounded-md" />
                    <div className="h-3 w-12 bg-neutral-100 dark:bg-neutral-900 rounded-md" />
                </div>
            </div>
        </Card>
    );
}
