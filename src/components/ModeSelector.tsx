import { Mode } from "~/types";

interface ModeSelectorProps {
  mode: Mode;
  onListMode: () => void;
  onShuffle: () => void;
}

export default function ModeSelector(props: ModeSelectorProps) {
  return (
    <div class="flex justify-center gap-4 mb-8">
      <button
        onClick={props.onListMode}
        class={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
          props.mode === "list"
            ? 'bg-blue-600 text-white shadow-lg transform scale-105'
            : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-blue-400 hover:shadow-md'
        }`}
      >
        📋 Список
      </button>
      <button
        onClick={props.onShuffle}
        class="btn-success px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
      >
        🔀 Перемешать карточки
      </button>
    </div>
  );
}
