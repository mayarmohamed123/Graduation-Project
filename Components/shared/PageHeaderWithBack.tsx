import PrvButton from "./prvButton";

export default function PageHeaderWithBack({ title }: { title: string }) {
    return <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex">
            <div className="flex gap-3 items-center w-full">
                <PrvButton />
                <h3 className="text-2xl font-semibold text-gray-900">{title}</h3>
            </div>
        </div>
    </div>
}