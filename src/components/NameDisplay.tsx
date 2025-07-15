type Props = {
    name: string;
    onChangeRequest: () => void;
};

export default function NameDisplay({ name, onChangeRequest }: Props) {
    return (
        <div className="flex items-center gap-4">
            <p className="text-sm text-gray-700">
                あなたの名前:<strong>{name}</strong>
            </p>
            <button
                onClick={onChangeRequest}
                className="text-sm text-blue-500 underline"
            >
                名前を変更
            </button>
        </div>
    );
}